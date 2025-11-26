'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 1. Redirección si no está logueado
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login'); // O la ruta de tu login
    }
  }, [status, router]);

  // 2. Estado de Carga
  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Si no hay sesión (y el useEffect aún no redirigió), no renderizamos nada
  if (!session) return null;

  const userRole = (session.user as any)?.role || 'doctor'; // Fallback a doctor para probar si no tienes roles configurados

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* --- NAVBAR SUPERIOR --- */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                🏥
              </div>
              <span className="text-xl font-bold text-gray-800 tracking-tight">
                AlcoLens <span className="text-blue-600">Pro</span>
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{userRole}</p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Cerrar Sesión"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        
        {/* VISTA DEL MÉDICO */}
        {userRole === 'doctor' && (
          <div className="space-y-8">
            
            {/* 1. Header de Bienvenida */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Buenos días, Dr/a. {session.user?.name?.split(' ')[0]} 👋
              </h1>
              <p className="mt-2 text-gray-600">
                Aquí tiene un resumen de la actividad de sus pacientes hoy.
              </p>
            </div>

            {/* 2. Tarjetas de KPIs (Indicadores Clave) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-sm font-medium text-gray-500">Pacientes Hoy</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
                <div className="mt-2 text-xs text-green-600 font-medium">↑ 2 nuevos vs ayer</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-red-500">
                <p className="text-sm font-medium text-gray-500">Alertas de Riesgo Alto</p>
                <p className="text-3xl font-bold text-red-600 mt-2">3</p>
                <div className="mt-2 text-xs text-gray-500">Requieren revisión inmediata</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-sm font-medium text-gray-500">Tests Completados</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">85%</p>
                <div className="mt-2 text-xs text-gray-500">Tasa de respuesta</div>
              </div>
            </div>

            {/* 3. Accesos Directos (Menú Principal) */}
            <h2 className="text-lg font-bold text-gray-900 mt-8 mb-4">Herramientas Clínicas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Tarjeta: Ir al Dashboard Completo */}
              <Link href="/doctor/dashboard" className="group block p-6 bg-white rounded-2xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all">
                <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  📊
                </div>
                <h3 className="text-lg font-bold text-gray-900">Monitorización de Pacientes</h3>
                <p className="text-sm text-gray-500 mt-2">Acceda a la tabla completa de resultados, filtre por riesgo y exporte datos.</p>
              </Link>

              {/* Tarjeta: QR para Sala de Espera */}
              <Link href="/patient" target="_blank" className="group block p-6 bg-white rounded-2xl border border-gray-200 hover:border-purple-500 hover:shadow-md transition-all">
                <div className="h-12 w-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  📱
                </div>
                <h3 className="text-lg font-bold text-gray-900">Modo Kiosko / QR</h3>
                <p className="text-sm text-gray-500 mt-2">Abrir la vista de paciente en una pestaña nueva para usar en tablet o generar QR.</p>
              </Link>

              {/* Tarjeta: Configuración (Placeholder) */}
              <div className="group block p-6 bg-gray-50 rounded-2xl border border-gray-200 opacity-60 cursor-not-allowed">
                <div className="h-12 w-12 bg-gray-200 text-gray-500 rounded-xl flex items-center justify-center mb-4">
                  ⚙️
                </div>
                <h3 className="text-lg font-bold text-gray-500">Configuración</h3>
                <p className="text-sm text-gray-400 mt-2">Gestión de cuenta y ajustes de hospital. (Próximamente)</p>
              </div>

            </div>
          </div>
        )}

        {/* VISTA DEL PACIENTE (Por si un paciente se loguea en el futuro) */}
        {userRole === 'patient' && (
          <div className="max-w-2xl mx-auto text-center py-12">
             <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                  🌿
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Espacio del Paciente</h2>
                <p className="text-gray-600 mb-8">
                  Gracias por registrarse. Desde aquí podrá consultar sus resultados históricos.
                </p>
                <div className="grid gap-4">
                  <Link href="/patient/audit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg transition-transform hover:scale-[1.02]">
                    Realizar Nuevo Test AUDIT-C
                  </Link>
                  <button className="w-full py-4 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50">
                    Ver Historial de Resultados
                  </button>
                </div>
             </div>
          </div>
        )}

      </main>
    </div>
  );
}