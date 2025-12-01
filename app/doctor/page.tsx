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
  Filter,
  Activity
} from 'lucide-react';
import { primaryFontBold, primaryFontRegular } from '@/app/lib/utils/fonts';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/animate-ui/components/radix/dialog';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import LiquidButton from '@/app/lib/utils/button-liquids';

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
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'low' | 'ambar' | 'cero'>('all');

  const [showSmsModal, setShowSmsModal] = useState(false);
  const [targetPhone, setTargetPhone] = useState('');
  const [targetNih, setTargetNih] = useState('');
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

  // KPIs Calculados
  const stats = useMemo(() => {
    const total = results.length;
    const highRiskCount = results.filter(r => ['red', 'amber'].includes(r.levelResult)).length;
    const today = results.filter(r => new Date(r.createdAt).toDateString() === new Date().toDateString()).length;
    const avgScore = total > 0 ? (results.reduce((acc, curr) => acc + curr.totalScore, 0) / total).toFixed(1) : 0;

    // Data for Pie Chart
    const riskData = [
      { name: 'Alto Riesgo', value: results.filter(r => r.levelResult === 'red').length, color: '#f43f5e' }, // rose-500
      { name: 'Riesgo Medio', value: results.filter(r => r.levelResult === 'amber').length, color: '#fb923c' }, // orange-400
      { name: 'Bajo Riesgo', value: results.filter(r => r.levelResult === 'yellow').length, color: '#fcd34d' }, // amber-300
      { name: 'Sin Riesgo', value: results.filter(r => r.levelResult === 'green').length, color: '#34d399' }, // emerald-400
    ].filter(item => item.value > 0);

    return { total, highRiskCount, today, avgScore, riskData };
  }, [results]);

  // Filtrado
  const filteredResults = results.filter(r => {
    if (riskFilter === 'all') return true;
    if (riskFilter === 'high') return ['red'].includes(r.levelResult);
    if (riskFilter === 'ambar') return ['amber'].includes(r.levelResult);
    if (riskFilter === 'low') return ['yellow'].includes(r.levelResult);
    if (riskFilter === 'cero') return ['green'].includes(r.levelResult);
    return true;
  });

  // Generar Link y Enviar SMS
  const handleGenerateLink = async () => {
    // El teléfono es obligatorio para el flujo de SMS
    if (!targetPhone) return;

    try {
      const res = await fetch('/api/doctor/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nih: targetNih, phone: targetPhone })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedLink(data.link);
        if (data.smsStatus === 'sent') alert("SMS enviado correctamente vía Twilio.");
        else if (data.smsStatus === 'simulated') alert("SMS Simulado (ver consola del servidor). Configura Twilio en .env para envío real.");
        else if (data.smsStatus === 'failed') alert("Error enviando SMS vía Twilio. Verifica tus claves.");
      }
    } catch (e) { alert("Error generando invitación"); }
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

  // Traducción de filtros
  const filterLabels: Record<string, string> = {
    'all': 'Todos',
    'high': 'Alto Riesgo',
    'ambar': 'Riesgo Medio',
    'low': 'Riesgo Bajo',
    'cero': 'Sin Riesgo'
  };

  return (
    <div className={`${primaryFontRegular.className} min-h-screen bg-background font-sans text-foreground p-6 sm:p-10`}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className={`${primaryFontBold.className} text-3xl font-extrabold text-primary tracking-tight drop-shadow-md`}>
              Panel Médico
            </h1>
            <p className="text-primary/80 mt-1 flex items-center gap-2 font-medium">
              <Activity className="w-4 h-4 animate-pulse" />
              Monitorización en tiempo real
            </p>
          </div>

          <div className="flex gap-3">
            <button onClick={fetchResults} className="p-3 text-secondary/80 bg-primary border border-white/20 hover:bg-background hover:text-primary rounded-xl transition-all shadow-sm backdrop-blur-sm">
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <Dialog open={showSmsModal} onOpenChange={setShowSmsModal}>
              <DialogTrigger asChild>
                <LiquidButton
                  onClick={() => { setGeneratedLink(''); setTargetPhone(''); setTargetNih(''); }}
                  className="flex items-center gap-2 px-6 py-3 bg-card shadow-2xl border text-primary font-bold rounded-xl shadow-lg shadow-black/10 transition-all hover:scale-105 hover:shadow-xl"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Invitar Paciente</span>
                </LiquidButton>
              </DialogTrigger>
              <DialogContent className="bg-secondary p-0 overflow-hidden sm:max-w-md rounded-2xl border border-slate-100 shadow-2xl">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <DialogHeader className="flex flex-row items-center gap-3 space-y-0 text-left">
                    <div className="p-2 bg-primary/40 rounded-lg text-secondary">
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
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">ID del Paciente (NIH)</label>
                          <input
                            type="text"
                            placeholder="Ej: 12345678"
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-background/20 focus:border-background outline-none transition-all font-mono text-lg placeholder:text-slate-300 font-medium uppercase"
                            value={targetNih}
                            onChange={e => setTargetNih(e.target.value)}
                          />
                          <p className="text-xs text-slate-400 mt-2 ml-1">Opcional. Si se deja vacío, será anónimo.</p>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Teléfono (para SMS)</label>
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
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button onClick={() => setShowSmsModal(false)} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors">Cancelar</button>
                        <button
                          onClick={handleGenerateLink}
                          disabled={!targetPhone}
                          className="flex-[2] py-3 bg-primary text-secondary font-bold rounded-xl hover:bg-[#b03030] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2"
                        >
                          <span>Generar Enlace</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
                      <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-center">
                        <p className="text-emerald-800 font-bold mb-1">¡Invitación Creada!</p>
                        <p className="text-xs text-emerald-600/80 break-all font-mono bg-white/60 p-2 rounded border border-emerald-100/50">{generatedLink}</p>
                      </div>


                      <button onClick={() => setGeneratedLink('')} className="w-full py-2 text-slate-400 text-sm font-medium hover:text-background transition-colors">
                        Generar otra invitación
                      </button>

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedLink);
                          alert("Enlace copiado al portapapeles");
                        }}
                        className="w-full py-2 text-primary text-sm font-bold hover:underline transition-colors"
                      >
                        Copiar Enlace Manualmente
                      </button>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* KPI CARDS */}
        <div className={`${primaryFontBold.className} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`}>
          <KPICard title="Total Evaluados" value={stats.total} icon={Users} trend="+12% vs mes pasado" />
          <KPICard title="Riesgo Elevado" value={stats.highRiskCount} icon={AlertOctagon} isWarning trend="Requieren atención" />
          <KPICard title="Tests Hoy" value={stats.today} icon={CalendarCheck} trend="Actividad normal" />
          <KPICard title="Score Medio" value={stats.avgScore} icon={TrendingUp} trend="Estable" />
        </div>

        {/* CHARTS SECTION */}
        <div className={`${primaryFontBold.className} grid lg:grid-cols-3 gap-6`}>
          {/* Pie Chart */}
          <div className="lg:col-span-1 bg-card p-6 rounded-3xl shadow-xl shadow-primary/5 border border-border flex flex-col">
            <h3 className={`${primaryFontBold.className} text-primary mb-6`}>Distribución de Riesgo</h3>
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.riskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="lg:col-span-2 bg-card rounded-3xl shadow-xl shadow-primary/5 border border-border overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h3 className={`${primaryFontBold.className} text-primary`}>Actividad Reciente</h3>
              <div className="flex gap-2">
                {['all', 'high', 'ambar', 'low', 'cero'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setRiskFilter(filter as any)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all capitalize ${riskFilter === filter ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                  >
                    {filterLabels[filter]}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left">
                <thead className="bg-muted/50 text-xs uppercase text-muted-foreground font-bold">
                  <tr>
                    <th className="px-6 py-4">Fecha</th>
                    <th className="px-6 py-4">Paciente</th>
                    <th className="px-6 py-4 text-center">Score</th>
                    <th className="px-6 py-4">Nivel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr><td colSpan={4} className="p-8 text-center text-slate-400">Cargando datos...</td></tr>
                  ) : filteredResults.slice(0, 5).map((row) => (
                    <tr key={row._id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(row.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                          <span className={`w-2 h-2 rounded-full ${row.sex === 'man' ? 'bg-blue-500' : 'bg-pink-500'}`}></span>
                          {row.sex === 'man' ? 'Hombre' : 'Mujer'}
                          <span className="text-xs text-slate-400 ml-1 font-mono">#{row.patientId.substring(0, 4)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-foreground">
                        {row.totalScore}
                      </td>
                      <td className="px-6 py-4">
                        <RiskBadge level={row.levelResult} />
                      </td>
                    </tr>
                  ))}
                  {filteredResults.length === 0 && !loading && (
                    <tr><td colSpan={4} className="p-8 text-center text-slate-400">No hay registros.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function KPICard({ title, value, icon: Icon, trend, isWarning = false }: any) {
  return (
    <div className="bg-card p-6 rounded-3xl border border-border shadow-lg shadow-primary/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${isWarning ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${isWarning ? 'bg-destructive/10 text-destructive border-destructive/20' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'}`}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
      <h4 className="text-3xl font-black text-foreground">{value}</h4>
    </div>
  );
}