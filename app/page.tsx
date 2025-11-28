'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Activity, 
  LogOut, 
  Users, 
  ChevronRight,
  BarChart3, 
  Smartphone, 
  Settings, 
  Stethoscope,
  Clock,
  ShieldCheck
} from 'lucide-react';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [greeting, setGreeting] = useState('Bienvenido');

  // Lógica de redirección
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login');
  }, [status, router]);

  // Saludo dinámico según hora
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Buenos días');
    else if (hour < 20) setGreeting('Buenas tardes');
    else setGreeting('Buenas noches');
  }, []);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-12 w-12 rounded-full border-4 border-slate-200"></div>
            <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-sm font-medium text-slate-500 animate-pulse">Cargando entorno seguro...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;
  const userRole = (session.user as any)?.role || 'doctor';

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-600">
      
      {/* --- NAVBAR PREMIUM --- */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2.5 group cursor-default">
            <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 text-white p-2 rounded-xl shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              AlcoLens<span className="text-indigo-600">Pro</span>
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-sm font-bold text-slate-900">{session.user?.name}</p>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{userRole}</p>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/auth/login' })}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
              title="Cerrar Sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        
        {/* VISTA DEL MÉDICO */}
        {userRole === 'doctor' && (
          <div className="space-y-10">
            
            {/* HERO SECTION */}
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 sm:p-12 text-white shadow-2xl shadow-slate-200">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-violet-500 rounded-full blur-3xl opacity-20"></div>
              
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-medium backdrop-blur-sm border border-white/10 mb-6">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Sesión segura activa</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
                  {greeting}, <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-white">
                    Dr/a. {session.user?.name?.split(' ')[0]}
                  </span>
                </h1>
                <p className="text-slate-300 text-lg mb-8 max-w-lg leading-relaxed">
                  Tiene <strong className="text-white">3 pacientes</strong> pendientes de revisión hoy. 
                  El sistema está operando con normalidad.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/doctor/dashboard" className="px-6 py-3 bg-white text-indigo-900 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg shadow-white/10 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Ir al Dashboard
                  </Link>
                  <Link href="/patient" target="_blank" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-colors border border-indigo-500/50 flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    Modo Kiosko
                  </Link>
                </div>
              </div>
            </div>

            {/* SECCIÓN DE ACCESO RÁPIDO */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-indigo-500" />
                  Herramientas Clínicas
                </h2>
                <span className="text-sm text-slate-400">v2.4.0 Stable</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Card 1: Monitorización */}
                <Link href="/doctor/dashboard" className="group relative p-6 bg-white rounded-2xl border border-slate-200 hover:border-indigo-500/50 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300">
                  <div className="absolute top-6 right-6 p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Pacientes</h3>
                  <p className="text-sm text-slate-500 mb-4 pr-8">
                    Gestione las evaluaciones AUDIT-C, envíe recordatorios y analice riesgos.
                  </p>
                  <div className="flex items-center text-sm font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
                    Acceder <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </Link>

                {/* Card 2: Historial (Placeholder) */}
                <div className="group relative p-6 bg-white rounded-2xl border border-slate-200 hover:border-violet-500/50 shadow-sm hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300 cursor-pointer">
                  <div className="absolute top-6 right-6 p-2 bg-violet-50 text-violet-600 rounded-lg group-hover:bg-violet-600 group-hover:text-white transition-colors">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Historial</h3>
                  <p className="text-sm text-slate-500 mb-4 pr-8">
                    Consulte registros antiguos y exporte datos para investigación.
                  </p>
                  <div className="flex items-center text-sm font-semibold text-violet-600 group-hover:translate-x-1 transition-transform">
                    Consultar <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>

                {/* Card 3: Configuración */}
                <div className="group relative p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300 hover:border-slate-400 transition-all cursor-not-allowed opacity-75">
                  <div className="absolute top-6 right-6 p-2 bg-slate-200 text-slate-500 rounded-lg">
                    <Settings className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-500 mb-2">Ajustes</h3>
                  <p className="text-sm text-slate-400 mb-4 pr-8">
                    Gestión de perfil, notificaciones y preferencias del hospital.
                  </p>
                  <div className="flex items-center text-sm font-medium text-slate-400">
                    Próximamente
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* VISTA DEL PACIENTE (Si fuera necesario) */}
        {userRole === 'patient' && (
           <div className="flex flex-col items-center justify-center py-20">
              <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 max-w-lg text-center">
                 <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Activity className="w-10 h-10 text-emerald-600" />
                 </div>
                 <h2 className="text-2xl font-bold text-slate-900 mb-2">Portal del Paciente</h2>
                 <p className="text-slate-500 mb-8">
                    Su espacio seguro para gestionar su salud y consultar resultados.
                 </p>
                 <Link href="/patient/audit" className="block w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all">
                    Realizar Autoevaluación
                 </Link>
              </div>
           </div>
        )}

      </main>
    </div>
  );
}