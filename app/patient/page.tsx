'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { 
  Activity, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Stethoscope,
  Info
} from 'lucide-react';

function PatientWelcomeContent() {
  const searchParams = useSearchParams();
  
  // LOGICA INTELIGENTE:
  // Si la URL ya trae parámetros (ej: ?ref=kiosko), los pasamos al siguiente paso
  // para no perder la trazabilidad.
  const currentParams = searchParams.toString();
  const nextStepHref = `/patient/audit${currentParams ? `?${currentParams}` : ''}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col items-center justify-center p-4 sm:p-6 font-sans text-slate-600">
      
      {/* Tarjeta Principal */}
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl shadow-indigo-100 border border-slate-100 overflow-hidden">
        
        {/* Header Visual */}
        <div className="bg-indigo-600 p-8 text-center relative overflow-hidden">
          {/* Círculos decorativos de fondo */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-x-10 -translate-y-10"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full translate-x-8 translate-y-8"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm mb-4">
               <Activity className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Evaluación Hepática
            </h1>
            <p className="text-indigo-100 text-sm mt-1">
              Servicio de Medicina Interna y Digestivo
            </p>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-8 space-y-8">
          
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-slate-900">
              ¿Conoce su perfil de riesgo?
            </h2>
            <p className="text-slate-500 leading-relaxed text-sm">
              Esta herramienta clínica le ayudará a entender cómo sus hábitos podrían estar afectando a su salud.
            </p>
          </div>

          {/* Grid de Beneficios (Iconos Lucide) */}
          <div className="space-y-4">
            <FeatureRow 
              icon={ShieldCheck} 
              title="100% Anónimo" 
              desc="No guardamos su nombre ni datos personales."
              color="emerald"
            />
            <FeatureRow 
              icon={Clock} 
              title="Muy Rápido" 
              desc="Solo le tomará 2 minutos completar el test."
              color="blue"
            />
            <FeatureRow 
              icon={Stethoscope} 
              title="Estándar Clínico" 
              desc="Basado en el test médico AUDIT-C."
              color="violet"
            />
          </div>

          {/* Botón de Acción */}
          <div className="pt-2">
            <Link 
              href={nextStepHref} 
              className="group w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-slate-200 transition-all hover:-translate-y-0.5"
            >
              <span>Comenzar Evaluación</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <div className="mt-6 flex items-start gap-2 text-xs text-slate-400 bg-slate-50 p-3 rounded-lg">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>
                Este test es informativo y no sustituye el diagnóstico de un profesional médico.
              </p>
            </div>
          </div>

        </div>
      </div>
      
      {/* Footer Branding */}
      <p className="mt-8 text-xs font-semibold text-slate-300 uppercase tracking-widest">
        Powered by AlcoLens Pro
      </p>

    </div>
  );
}

// Componente auxiliar para las filas de características
function FeatureRow({ icon: Icon, title, desc, color }: any) {
  const colors: any = {
    emerald: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600',
    violet: 'bg-violet-50 text-violet-600',
  };

  return (
    <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
      <div className={`p-2.5 rounded-xl flex-shrink-0 ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

// Exportación con Suspense (Necesario para useSearchParams en Next.js 13+)
export default function PatientWelcomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50"></div>}>
      <PatientWelcomeContent />
    </Suspense>
  );
}