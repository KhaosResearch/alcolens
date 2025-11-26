'use client';

import { useState, useEffect } from 'react';

// Tipado rápido para los datos que vienen de la API
interface PatientResult {
  _id: string;
  patientId: string;
  sex: string;
  totalScore: number;
  levelResult: string; // 'green', 'amber', etc.
  createdAt: string;
}

export default function DoctorDashboard() {
  const [results, setResults] = useState<PatientResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSmsModal, setShowSmsModal] = useState(false);

  // 1. Cargar datos al entrar
  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await fetch('/api/doctor/results');
      const data = await res.json();
      if (data.success) {
        setResults(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Simulación de envío de SMS
  const handleSendSMS = (phone: string) => {
    // Aquí llamarías a una API real (Twilio/AWS SNS)
    alert(`📨 Simulando envío de SMS a: ${phone}\n\nLink: https://tu-app.com/patient`);
    setShowSmsModal(false);
  };

  // Función auxiliar para traducir colores de BD a clases CSS
  const getBadgeColor = (risk: string) => {
    switch (risk) {
      case 'green': return 'bg-green-100 text-green-800';
      case 'yellow': return 'bg-yellow-100 text-yellow-800';
      case 'amber': return 'bg-orange-100 text-orange-800';
      case 'red': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Panel Médico</h1>
          <p className="text-gray-500">Monitorización de pacientes AUDIT-C</p>
        </div>
        
        <button 
          onClick={() => setShowSmsModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm"
        >
          📱 Enviar Invitación SMS
        </button>
      </div>

      {/* TABLA DE RESULTADOS */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-semibold text-gray-700">Últimos Resultados Recibidos</h3>
          <button onClick={fetchResults} className="text-sm text-blue-600 hover:underline">Refrescar</button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Cargando datos...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-3">Fecha</th>
                <th className="px-6 py-3">ID Paciente (Hash)</th>
                <th className="px-6 py-3">Sexo</th>
                <th className="px-6 py-3">Puntuación</th>
                <th className="px-6 py-3">Nivel Riesgo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {results.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-500">
                    {item.patientId.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 text-sm capitalize">
                    {item.sex === 'man' ? '👨 Hombre' : '👩 Mujer'}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-800">
                    {item.totalScore}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getBadgeColor(item.levelResult)}`}>
                      {item.levelResult.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
              
              {results.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No hay resultados todavía. Envía invitaciones o espera a que usen el QR.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL SIMULADO PARA ENVIAR SMS */}
      {showSmsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4">Nueva Invitación por SMS</h3>
            <label className="block text-sm text-gray-600 mb-2">Número de teléfono:</label>
            <input 
              type="tel" 
              placeholder="+34 600 000 000" 
              className="w-full border p-2 rounded-lg mb-4"
              id="phoneInput"
            />
            <div className="flex gap-3">
              <button 
                onClick={() => setShowSmsModal(false)}
                className="flex-1 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  const input = document.getElementById('phoneInput') as HTMLInputElement;
                  handleSendSMS(input.value);
                }}
                className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}