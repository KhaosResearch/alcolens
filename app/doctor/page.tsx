'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
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
  Activity,
  Copy, // Importamos icono para copiar
  Check // Importamos icono para feedback visual
} from 'lucide-react';
import { useSession } from 'next-auth/react';
// Tus rutas de fuentes originales
import { primaryFontBold, primaryFontRegular } from '@/app/lib/utils/fonts';
// Tus componentes originales
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/animate-ui/components/radix/dialog';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import LiquidButton from '@/app/lib/utils/button-liquids';
import QRCodeUtil from 'qrcode';

// Interfaces
interface PatientResult {
  _id: string;
  patientId: string;
  sex: string;
  totalScore: number;
  levelResult: string;
  createdAt: string;
}


const QRCode = ({ value }: { value: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCodeUtil.toCanvas(canvasRef.current, value, {
        width: 240,
        margin: 1,
        color: {
          dark: '#334155', // Slate-700
          light: '#ffffff',
        },
      }, (error) => {
        if (error) console.error(error);
      });
    }
  }, [value]);

  return (
    <div className="relative group mx-auto w-fit">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-red-600 rounded-3xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 blur"></div>
      <div className="relative bg-white p-4 rounded-3xl shadow-xl flex flex-col items-center gap-2">
        <canvas ref={canvasRef} className="rounded-xl" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Escanear</p>
      </div>
    </div>
  );
};

export default function DoctorDashboard() {
  const { data: session } = useSession();
  const [results, setResults] = useState<PatientResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'low' | 'ambar' | 'cero'>('all');

  const [targetName, setTargetName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [targetPhone, setTargetPhone] = useState('');
  const [targetNih, setTargetNih] = useState('');
  const [targetEmail, setTargetEmail] = useState('');
  const [targetId, setTargetId] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  // Estado para feedback visual al copiar
  const [isCopied, setIsCopied] = useState(false);
  const [qrRef, setQrRef] = useState<HTMLCanvasElement | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQR = async () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL;
    const id = targetNih || Math.random().toString(36).substring(2, 10).toUpperCase();
    const link = `${baseUrl}/patient/audit?id=${id}`;
    setGeneratedLink(link);
    setTargetId(id);
    return id;
  };

  useEffect(() => {
    generateQR();
  }, []);

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
    const highRiskCount = results.filter(r => ['red', 'ambar', 'amber'].includes(r.levelResult)).length;
    const today = results.filter(r => new Date(r.createdAt).toDateString() === new Date().toDateString()).length;
    const avgScore = total > 0 ? (results.reduce((acc, curr) => acc + curr.totalScore, 0) / total).toFixed(1) : 0;

    const riskData = [
      { name: 'Alto Riesgo', value: results.filter(r => r.levelResult === 'red').length, color: '#f43f5e' },
      { name: 'Riesgo Medio', value: results.filter(r => ['ambar', 'amber'].includes(r.levelResult)).length, color: '#fb923c' },
      { name: 'Bajo Riesgo', value: results.filter(r => r.levelResult === 'yellow').length, color: '#fcd34d' },
      { name: 'Sin Riesgo', value: results.filter(r => r.levelResult === 'green').length, color: '#34d399' },
    ].filter(item => item.value > 0);

    return { total, highRiskCount, today, avgScore, riskData };
  }, [results]);

  // Filtrado
  const filteredResults = results.filter(r => {
    if (riskFilter === 'all') return true;
    if (riskFilter === 'high') return ['red'].includes(r.levelResult);
    if (riskFilter === 'ambar') return ['ambar', 'amber'].includes(r.levelResult);
    if (riskFilter === 'low') return ['yellow'].includes(r.levelResult);
    if (riskFilter === 'cero') return ['green'].includes(r.levelResult);
    return true;
  });


  // Funciones de compartir
  const shareWhatsApp = () => {
    const message = `Hola, le invitamos a realizar su evaluación de salud en Alcolens: ${generatedLink}`;
    const url = `https://wa.me/${targetPhone.replace(/\s+/g, '').replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleGenerateLink = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL;
    const id = targetNih || Math.random().toString(36).substring(2, 10).toUpperCase();
    const link = `${baseUrl}/patient/audit?id=${id}`;
    setGeneratedLink(link);
    setTargetId(id);
    return id;
  };


  const handleSendEmail = async (id?: string) => {
    if (!targetEmail) return;
    const idToSend = id || targetId;

    try {
      const res = await fetch('/api/doctor/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorName: targetName, email: targetEmail, id: idToSend })
      });
      const data = await res.json();
      if (data.success) {
        alert('Invitación enviada correctamente');
      } else {
        alert(data.error || "Error al enviar la invitación");
      }
    } catch (e) { alert("Error de conexión"); }
  };

  // Helper Badge
  const RiskBadge = ({ level }: { level: string }) => {
    const styles: Record<string, string> = {
      'green': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'yellow': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'ambar': 'bg-orange-100 text-orange-700 border-orange-200',
      'amber': 'bg-orange-100 text-orange-700 border-orange-200',
      'red': 'bg-rose-100 text-rose-700 border-rose-200',
    };
    const labels: Record<string, string> = {
      'green': 'Cero Riesgo', 'yellow': 'Bajo Riesgo', 'ambar': 'Riesgo Medio', 'amber': 'Riesgo Medio', 'red': 'Alto Riesgo'
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[level] || styles.green}`}>
        {labels[level] || level}
      </span>
    );
  };

  const filterLabels: Record<string, string> = {
    'all': 'Todos', 'high': 'Alto Riesgo', 'ambar': 'Riesgo Medio', 'low': 'Riesgo Bajo', 'cero': 'Sin Riesgo'
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

            <Dialog open={showModal} onOpenChange={setShowModal}>
              <DialogTrigger asChild>
                <LiquidButton
                  onClick={() => {
                    setGeneratedLink(''); setTargetEmail(''); setTargetName(session?.user?.name || ''); setTargetId('');
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-card shadow-2xl border text-primary font-bold rounded-xl shadow-lg shadow-black/10 transition-all hover:scale-105 hover:shadow-xl"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Invitar Paciente</span>
                </LiquidButton>
              </DialogTrigger>

              {/* MODAL CON TUS ESTILOS */}
              <DialogContent className="bg-secondary p-0 overflow-hidden sm:max-w-md rounded-2xl border border-slate-100 shadow-2xl">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <DialogHeader className="flex flex-row items-center gap-3 space-y-0 text-left">
                    <div className="p-2 bg-primary rounded-lg text-secondary">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <DialogTitle className="font-bold text-lg text-black ">
                      Invitar Paciente
                    </DialogTitle>
                  </DialogHeader>
                </div>

                <div className="p-6 space-y-5">
                  {!generatedLink ? (
                    /* FASE 1: FORMULARIO (Tus estilos originales) */
                    <>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-black mb-2">ID del Paciente (NIH)</label>
                          <input
                            type="text"
                            placeholder="12345678"
                            className="w-full px-4 py-3 bg-white border text-black text-sm border-slate-200 rounded-xl focus:ring-2 focus:ring-background/20 focus:border-background outline-none transition-all font-mono text-lg placeholder:text-black/40 font-medium uppercase"
                            value={targetNih}
                            onChange={e => setTargetNih(e.target.value)}
                          />
                          <p className="text-xs text-black/50 mt-2 ml-1">Opcional. Si se deja vacío, será anónimo.</p>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-black mb-2">Teléfono (para SMS)</label>
                          <div className="relative">
                            <input
                              type="tel"
                              placeholder="666666666"
                              className="w-full px-4 text-black py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 text-sm focus:ring-background/20 focus:border-background outline-none transition-all font-mono text-lg placeholder:text-black/40 font-medium"
                              value={targetPhone}
                              onChange={e => setTargetPhone(e.target.value)}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-black mb-2">Correo Electrónico (para Email)</label>
                          <div className="relative">
                            <input
                              type="email"
                              placeholder="alcolenscontact@gmail.com"
                              className="w-full px-4 text-black py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 text-sm focus:ring-background/20 focus:border-background outline-none transition-all font-mono text-lg placeholder:text-black/40 font-medium"
                              value={targetEmail}
                              onChange={e => setTargetEmail(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button onClick={() => setShowModal(false)} className="flex-1 py-3 text-slate-500 font-bold rounded-xl transition-colors">Cancelar</button>
                        <button
                          onClick={() => { const id = handleGenerateLink(); handleSendEmail(id); }}
                          disabled={!targetPhone && !targetEmail}
                          className="flex-[2] py-3 bg-primary text-secondary hover:bg-primary/80 font-bold rounded-xl  disabled:cursor-not-allowed shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2"
                        >
                          <span>Generar Enlace</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  ) : (
                    /* FASE 2: COMPARTIR (Integrada con tus estilos) */
                    <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
                      <QRCode value={generatedLink} />
                      <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-center">
                        <p className="text-red-800 font-bold mb-1">¡Invitación Creada!</p>
                        <p className="text-xs text-red-600/80 break-all font-mono bg-white/60 p-2 rounded border border-red-100/50">{generatedLink}</p>
                      </div>


                      {targetEmail && (
                        <div className="p-4 bg-red-500 border border-red-100 rounded-xl text-center">
                          <p className="text-white font-bold mb-1">¡Email Enviado!</p>
                        </div>
                      )}


                      <div className="grid grid-cols-1 gap-3">
                        {targetPhone && (
                          <>
                            {/* WhatsApp (Color de marca oficial, excepción permitida) */}
                            <button
                              onClick={shareWhatsApp}
                              className="w-full py-3 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#20bd5a] transition-all flex items-center justify-center gap-2 shadow-sm"
                            >
                              <Smartphone className="w-5 h-5" />
                              <span>Enviar por WhatsApp</span>
                            </button>
                          </>
                        )}

                        <div className="flex gap-3">
                          <button
                            onClick={copyToClipboard}
                            className="flex-1 py-3 bg-white border-2 border-primary text-primary rounded-xl font-bold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                          >
                            {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            <span>{isCopied ? 'Copiado' : 'Copiar'}</span>
                          </button>

                          <button
                            onClick={() => setGeneratedLink('')}
                            className="flex-1 py-3 text-black text-sm font-medium hover:text-black/80 transition-colors border border-black hover:border-slate-200 rounded-xl"
                          >
                            Nueva
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* KPI CARDS (Sin cambios, tus estilos) */}
        <div className={`${primaryFontBold.className} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`}>
          <KPICard title="Total Evaluados" value={stats.total} icon={Users} trend="+12% vs mes pasado" />
          <KPICard title="Riesgo Elevado" value={stats.highRiskCount} icon={AlertOctagon} isWarning trend="Requieren atención" />
          <KPICard title="Tests Hoy" value={stats.today} icon={CalendarCheck} trend="Actividad normal" />
          <KPICard title="Score Medio" value={stats.avgScore} icon={TrendingUp} trend="Estable" />
        </div>

        <div className={`${primaryFontBold.className} grid lg:grid-cols-3 gap-6`}>
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