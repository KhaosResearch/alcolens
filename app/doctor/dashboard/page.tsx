'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Users,
  MessageSquare,
  RefreshCw,
  ArrowUpRight,
  TrendingUp,
  AlertOctagon,
  CalendarCheck,
  Smartphone,
  Filter
} from 'lucide-react';
import { primaryFontBold } from '@/app/lib/utils/fonts';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/animate-ui/components/radix/dialog';

// Interfaces
interface PatientResult {
  _id: string;
  patientId: string;
  sex: string;
  totalScore: number;
  levelResult: string;
  createdAt: string;
}

export default function DoctorDashboard() {
  const [results, setResults] = useState<PatientResult[]>([]);
  const [loading, setLoading] = useState(true);

  // NUEVO: Estado para el filtro de riesgo
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'low' | 'ambar' | 'cero'>('all');

  const [showSmsModal, setShowSmsModal] = useState(false);
  const [targetPhone, setTargetPhone] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  // Fetch Data
  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/doctor/results');
      const data = await res.json();
      if (data.success) setResults(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResults(); }, []);

  // KPIs Calculados y Distribución para Gráficas
  const stats = useMemo(() => {
    const total = results.length;
    const highRiskCount = results.filter(r => ['red', 'amber'].includes(r.levelResult)).length;
    const today = results.filter(r => new Date(r.createdAt).toDateString() === new Date().toDateString()).length;
    const avgScore = total > 0 ? (results.reduce((acc, curr) => acc + curr.totalScore, 0) / total).toFixed(1) : 0;

    // Porcentajes para la barra gráfica
    const redPct = total ? (results.filter(r => r.levelResult === 'red').length / total) * 100 : 0;
    const amberPct = total ? (results.filter(r => r.levelResult === 'amber').length / total) * 100 : 0;
    const yellowPct = total ? (results.filter(r => r.levelResult === 'yellow').length / total) * 100 : 0;
    const greenPct = total ? (results.filter(r => r.levelResult === 'green').length / total) * 100 : 0;

    return { total, highRiskCount, today, avgScore, distribution: { redPct, amberPct, yellowPct, greenPct } };
  }, [results]);

  // Filtrado Lógico (Sustituye a la búsqueda por texto)
  const filteredResults = results.filter(r => {
    if (riskFilter === 'all') return true;
    if (riskFilter === 'high') return ['red'].includes(r.levelResult);
    if (riskFilter === 'ambar') return ['amber'].includes(r.levelResult);
    if (riskFilter === 'low') return ['yellow'].includes(r.levelResult);
    if (riskFilter === 'cero') return ['green'].includes(r.levelResult);
    return true;
  });

  // Generar SMS
  const handleGenerateLink = async () => {
    if (!targetPhone) return;
    try {
      const res = await fetch('/api/doctor/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: targetPhone })
      });
      const data = await res.json();
      if (data.success) setGeneratedLink(data.link);
    } catch (e) { alert("Error generando link"); }
  };

  // Helper Badge
  const RiskBadge = ({ level }: { level: string }) => {
    const styles: Record<string, string> = {
      'green': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'yellow': 'bg-amber-100 text-amber-700 border-amber-200',
      'amber': 'bg-orange-100 text-orange-700 border-orange-200',
      'red': 'bg-rose-100 text-rose-700 border-rose-200',
    };
    const labels: Record<string, string> = {
      'green': 'Cero Riesgo', 'yellow': 'Bajo Riesgo', 'amber': 'Riesgo Medio', 'red': 'Alto Riesgo'
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[level] || styles.green}`}>
        {labels[level] || level}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-transparent font-sans text-slate-600 p-6 sm:p-10">

      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER & ACTIONS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className={`${primaryFontBold.className} text-3xl font-extrabold text-white tracking-tight drop-shadow-md`}>
              Panel de Control
            </h1>
            <p className="text-white/80 mt-1 flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              Datos en tiempo real
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchResults} className="p-3 text-white/80 bg-white/10 border border-white/20 hover:bg-white hover:text-background rounded-xl transition-all shadow-sm backdrop-blur-sm">
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>


            <Dialog open={showSmsModal} onOpenChange={setShowSmsModal}>
              <DialogTrigger asChild>
                <button
                  onClick={() => {
                    setGeneratedLink('');
                    setTargetPhone('');
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-background font-bold rounded-xl shadow-lg shadow-black/10 transition-all hover:scale-105 hover:shadow-xl"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Invitar Paciente</span>
                </button>
              </DialogTrigger>

              <DialogContent className="bg-white p-0 overflow-hidden sm:max-w-md rounded-2xl border border-slate-100 shadow-2xl">

                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <DialogHeader className="flex flex-row items-center gap-3 space-y-0 text-left">
                    <div className="p-2 bg-red-50 rounded-lg text-background">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <DialogTitle className="font-bold text-lg text-slate-800">
                      Invitar Paciente
                    </DialogTitle>
                  </DialogHeader>
                </div>

                <div className="p-6 space-y-5">
                  {!generatedLink ? (
                    <>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Número de Teléfono</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm pointer-events-none">+34</span>
                          <input
                            type="tel"
                            placeholder="555 777 888"
                            onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9\s]/g, '').slice(0, 9); }}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-background/20 focus:border-background outline-none transition-all font-mono text-lg placeholder:text-slate-300 font-medium"
                            value={targetPhone}
                            onChange={e => setTargetPhone(e.target.value)}
                          />
                        </div>
                        <p className="text-xs text-slate-400 mt-2 ml-1">Se enviará un enlace seguro válido por 24h.</p>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowSmsModal(false)}
                          className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleGenerateLink}
                          disabled={!targetPhone}
                          className="flex-[2] py-3 bg-background text-white font-bold rounded-xl hover:bg-[#b03030] disabled:opacity-50 disabled:shadow-none shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2"
                        >
                          <span>Generar Enlace</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  ) : (
                    /* VISTA 2: RESULTADO / ÉXITO */
                    <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
                      <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-center">
                        <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                          <CalendarCheck className="w-5 h-5" />
                        </div>
                        <p className="text-emerald-800 font-bold mb-1">¡Invitación Creada!</p>
                        <p className="text-xs text-emerald-600/80 break-all font-mono bg-white/60 p-2 rounded border border-emerald-100/50">{generatedLink}</p>
                      </div>

                      <button
                        onClick={() => {
                          const text = `Hola, le invito a realizar su evaluación de salud hepática: ${generatedLink}`;
                          window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                        }}
                        className="w-full py-3.5 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#20bd5a] transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-200 hover:-translate-y-0.5"
                      >
                        <Smartphone className="w-5 h-5" />
                        <span>Enviar por WhatsApp</span>
                      </button>

                      <button onClick={() => setGeneratedLink('')} className="w-full py-2 text-slate-400 text-sm font-medium hover:text-background transition-colors">
                        Generar otra invitación
                      </button>
                    </div>
                  )}
                </div>

              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard title="Total Evaluados" value={stats.total} icon={Users} trend="+12% vs mes pasado" />
          <KPICard title="Riesgo Elevado" value={stats.highRiskCount} icon={AlertOctagon} isWarning trend="Requieren atención" />
          <KPICard title="Tests Hoy" value={stats.today} icon={CalendarCheck} trend="Actividad normal" />
          <KPICard title="Score Medio" value={stats.avgScore} icon={TrendingUp} trend="Estable" />
        </div>

        {/* NUEVO: GRÁFICA DE DISTRIBUCIÓN DE RIESGO */}
        {stats.total > 0 && (
          <div className="bg-white rounded-3xl p-6 shadow-lg shadow-red-900/5 border border-slate-100">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Distribución Epidemiológica</h3>
            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div style={{ width: `${stats.distribution.redPct}%` }} className="h-full bg-rose-500 transition-all duration-500" title="Alto Riesgo" />
              <div style={{ width: `${stats.distribution.amberPct}%` }} className="h-full bg-orange-400 transition-all duration-500" title="Riesgo Medio" />
              <div style={{ width: `${stats.distribution.yellowPct}%` }} className="h-full bg-amber-300 transition-all duration-500" title="Moderado" />
              <div style={{ width: `${stats.distribution.greenPct}%` }} className="h-full bg-emerald-400 transition-all duration-500" title="Bajo Riesgo" />
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-500"></div>Alto ({Math.round(stats.distribution.redPct)}%)</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-400"></div>Medio ({Math.round(stats.distribution.amberPct)}%)</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-300"></div>Moderado ({Math.round(stats.distribution.yellowPct)}%)</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-400"></div>Bajo ({Math.round(stats.distribution.greenPct)}%)</div>
            </div>
          </div>
        )}

        {/* ZONA DE LISTADO DE ACTIVIDAD */}
        <div className="bg-white rounded-3xl shadow-xl shadow-red-900/10 overflow-hidden border border-slate-100">

          {/* NUEVA BARRA DE FILTROS (Sin Buscador) */}
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-bold text-slate-700">Filtrar por Nivel de Riesgo:</span>
            </div>
            <div className="flex p-1 bg-slate-200/50 rounded-xl">
              <button
                onClick={() => setRiskFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${riskFilter === 'all' ? 'bg-white text-background shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Todos
              </button>
              <button
                onClick={() => setRiskFilter('high')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${riskFilter === 'high' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-rose-600'}`}
              >
                Riesgo Alto
              </button>
              <button
                onClick={() => setRiskFilter('ambar')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${riskFilter === 'ambar' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-amber-600'}`}
              >
                Riesgo Moderado
              </button>
              <button
                onClick={() => setRiskFilter('low')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${riskFilter === 'low' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-yellow-300'}`}
              >
                Riesgo Bajo
              </button>
              <button
                onClick={() => setRiskFilter('cero')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${riskFilter === 'cero' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-emerald-600'}`}
              >
                Cero Riesgo
              </button>
            </div>
          </div>

          {/* Tabla Limpia */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                  <th className="px-6 py-4">Momento</th>
                  <th className="px-6 py-4">Perfil Demográfico</th>
                  <th className="px-6 py-4 text-center">Score</th>
                  <th className="px-6 py-4">Diagnóstico</th>
                  <th className="px-6 py-4 text-right">ID Anónimo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-6"><div className="h-4 bg-slate-100 rounded w-full"></div></td>
                    </tr>
                  ))
                ) : filteredResults.length > 0 ? (
                  filteredResults.map((row) => (
                    <tr key={row._id} className="group hover:bg-red-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-700">
                            {new Date(row.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-slate-400">
                            {new Date(row.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm capitalize font-medium text-slate-600">
                          <span className={`w-2 h-2 rounded-full ${row.sex === 'man' ? 'bg-blue-500' : 'bg-pink-500'}`}></span>
                          {row.sex === 'man' ? 'Hombre' : 'Mujer'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`font-extrabold text-lg ${row.totalScore >= 8 ? 'text-rose-600' : 'text-slate-800'}`}>{row.totalScore}</span>
                        <span className="text-slate-400 text-xs font-semibold">/12</span>
                      </td>
                      <td className="px-6 py-4">
                        <RiskBadge level={row.levelResult} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        {/* El ID pasa a segundo plano visualmente */}
                        <span className="font-mono text-[10px] text-slate-300 group-hover:text-slate-400 transition-colors">
                          #{row.patientId.substring(0, 6)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <div className="bg-slate-50 p-4 rounded-full mb-3">
                          <Filter className="w-8 h-8 opacity-20" />
                        </div>
                        <p className="font-medium">No hay resultados con este filtro.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, icon: Icon, trend, isWarning = false }: any) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className={`p-3 rounded-xl ${isWarning ? 'bg-red-50 text-background' : 'bg-slate-50 text-slate-600'}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${isWarning ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{title}</p>
      <h4 className="text-2xl font-extrabold text-slate-800 mt-1">{value}</h4>
    </div>
  );
}