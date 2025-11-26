// src/app/patient/page.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PatientWelcomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-6">
      
      {/* --- CABECERA --- */}
      <div className="max-w-md w-full text-center space-y-6">
        <div className="bg-white p-4 rounded-full shadow-md inline-block mb-4">
          🏥 {/* Aquí podrías poner el logo del hospital */}
          <span className="text-2xl">Salud Hepática</span>
        </div>

        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Evaluación de Riesgo de Alcohol
        </h1>
        
        <p className="text-lg text-gray-600 leading-relaxed">
          Bienvenido. Esta herramienta le ayudará a conocer cómo el consumo de alcohol podría estar afectando su salud.
        </p>

        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-left text-sm text-blue-800 space-y-2">
          <p>✅ <strong>Totalmente anónimo:</strong> No guardaremos su nombre.</p>
          <p>⏱️ <strong>Rápido:</strong> Solo le tomará 2 minutos.</p>
          <p>🩺 <strong>Clínico:</strong> Basado en el estándar AUDIT-C.</p>
        </div>

        {/* --- BOTÓN DE ACCIÓN --- */}
        <div className="pt-4">
          <Link 
            href="/patient/audit" 
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform transition hover:scale-105 text-lg"
          >
            Comenzar Evaluación
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-8">
          Servicio de Medicina Interna y Digestivo
        </p>
      </div>
    </div>
  );
}