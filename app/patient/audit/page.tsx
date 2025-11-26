'use client';

import { useState, useEffect } from 'react';
import { auditQuestionsData, studyLevel } from '@/app/api/audit'; 
import AuditQuestionCard from '@/app/lib/auditquestioncard'; 
import { riskEvaluation, Sex, auditResult } from '@/app/lib/utils/auditLogic'; 

// Definimos las fases posibles de la pantalla
type Fase = 'estudios' | 'sexo' | 'test' | 'resultados';

export default function AuditPage() {
  // --- ESTADOS DE LA APP ---
  const [fase, setFase] = useState<Fase>('estudios'); // 👈 AHORA EMPEZAMOS AQUÍ
  const [isSaving, setIsSaving] = useState(false);
  const [dataSaved, setDataSaved] = useState(false); // Para saber si ya guardamos
  const [patientId, setPatientId] = useState('');

  // Datos del paciente
  const [sexo, setSexo] = useState<Sex>('man');
  // Quitamos el valor por defecto, ahora se rellena dinámicamente
  const [nivelUsuario, setNivelUsuario] = useState<studyLevel>('secundariabach'); 
  
  // Datos del test
  const [currentIndex, setCurrentIndex] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<string, number>>({});
  const [resultadoFinal, setResultadoFinal] = useState<auditResult | null>(null);

  // Generar ID anónimo al cargar
  useEffect(() => {
    const idAleatorio = Math.random().toString(36).substring(2, 15);
    setPatientId(idAleatorio);
  }, []);

  // --- LÓGICA DE NAVEGACIÓN ---

  // PASO 1: Seleccionar Estudios
  const seleccionarEstudios = (nivel: studyLevel) => {
    setNivelUsuario(nivel);
    setFase('sexo'); // Pasamos al siguiente paso
  };

  // PASO 2: Seleccionar Sexo
  const seleccionarSexo = (sexoSeleccionado: Sex) => {
    setSexo(sexoSeleccionado);
    setFase('test'); // Pasamos al siguiente paso
  };

  // PASO 3: Responder Preguntas
  const handleAnswer = (valor: number) => {
    const preguntaActual = auditQuestionsData[currentIndex];
    const nuevasRespuestas = { ...respuestas, [preguntaActual.id]: valor };
    setRespuestas(nuevasRespuestas);

    if (currentIndex < auditQuestionsData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      terminarTest(nuevasRespuestas);
    }
  };

  // CÁLCULO DE RESULTADOS (PERO NO GUARDADO)
  const terminarTest = (finalRespuestas: Record<string, number>) => {
    const suma = Object.values(finalRespuestas).reduce((a, b) => a + b, 0);
    const resultado = riskEvaluation(suma, sexo);
    setResultadoFinal(resultado);
    setFase('resultados'); // Mostramos resultados y PEDIMOS CONSENTIMIENTO
  };

  // PASO 4: Lógica de Consentimiento y Guardado
// PASO 4: Lógica de Consentimiento y Guardado
  const manejarConsentimiento = async (acepta: boolean) => {
    if (!acepta) {
      alert("Entendido. No guardaremos sus datos. Gracias por hacer el test.");
      return;
    }

    setIsSaving(true);

    // 1. DICCIONARIO DE TRADUCCIÓN (Seguridad Total)
    // Mapeamos lo que devuelve tu lógica (keys) a lo que espera la BD (values)
    const riskMap: Record<string, string> = {
      'verde': 'green',
      'amarillo': 'yellow',
      'ambar': 'amber',
      'rojo': 'red',
      // Por si acaso tu lógica ya devuelve inglés, lo dejamos pasar
      'green': 'green',
      'yellow': 'yellow',
      'amber': 'amber',
      'red': 'red'
    };

    try {
      const response = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: patientId,
          // Como en tu UI ya usas 'man'/'woman', lo enviamos directo
          sex: sexo, 
          studyLevel: nivelUsuario,
          answers: respuestas,
          totalScore: Object.values(respuestas).reduce((a, b) => a + b, 0),
          
          // ✅ AQUI USAMOS EL MAPA
          // Si por error riskLevel es undefined, ponemos 'green' por defecto para no romper la app
          levelResult: resultadoFinal ? (riskMap[resultadoFinal.riskLevel] || 'green') : 'green'
        })
      });

      if (response.ok) {
        setDataSaved(true);
        console.log("✅ Datos guardados con éxito.");
      } else {
        const error = await response.json();
        console.error("❌ Error API:", error);
        alert("Hubo un problema guardando los datos.");
      }
    } catch (error) {
      console.error("❌ Error Red:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // --- RENDERIZADO (VISTAS) ---

  // VISTA 1: ¿Qué estudios tiene?
  if (fase === 'estudios') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">Bienvenido</h1>
        <p className="mb-8 text-gray-600 text-center max-w-md">
          Para adaptar las preguntas a su perfil, por favor seleccione su nivel de estudios:
        </p>
        <div className="space-y-3 w-full max-w-md">
          <button onClick={() => seleccionarEstudios('sinoprimaria')} className="btn-option">
            🎓 Primaria / Sin estudios
          </button>
          <button onClick={() => seleccionarEstudios('secundariabach')} className="btn-option">
            📚 Secundaria / Bachillerato
          </button>
          <button onClick={() => seleccionarEstudios('universitariosup')} className="btn-option">
            🏛️ Universidad / Superior
          </button>
        </div>
      </div>
    );
  }

  // VISTA 2: ¿Sexo biológico?
  if (fase === 'sexo') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Datos Fisiológicos</h1>
        <p className="mb-6 text-gray-600">Seleccione su sexo biológico (necesario para el cálculo médico):</p>
        <div className="space-y-4 w-full max-w-md">
          <button onClick={() => seleccionarSexo('man')} className="btn-option border-blue-200 hover:bg-blue-50">
            👨 Hombre
          </button>
          <button onClick={() => seleccionarSexo('woman')} className="btn-option border-pink-200 hover:bg-pink-50">
            👩 Mujer
          </button>
        </div>
      </div>
    );
  }

  // VISTA 3: El Test (Igual que antes)
  if (fase === 'test') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-2xl mb-8">
          <div className="flex justify-between text-xs text-gray-500 mb-2 font-semibold tracking-wide uppercase">
            <span>Progreso</span>
            <span>{currentIndex + 1} / {auditQuestionsData.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${((currentIndex + 1) / auditQuestionsData.length) * 100}%` }}
            ></div>
          </div>
        </div>
        <AuditQuestionCard 
          question={auditQuestionsData[currentIndex]}
          studyLevel={nivelUsuario}
          onAnswer={handleAnswer}
        />
      </div>
    );
  }

  // VISTA 4: Resultados y Consentimiento
  if (fase === 'resultados' && resultadoFinal) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className={`w-full max-w-lg p-8 rounded-2xl shadow-xl border-2 ${resultadoFinal.color} mb-6`}>
          <h2 className="text-3xl font-bold mb-4">{resultadoFinal.title}</h2>
          <p className="text-lg font-medium mb-6 opacity-90">{resultadoFinal.message}</p>
          <div className="bg-white/60 p-4 rounded-lg text-sm font-medium">
            ℹ️ Recuerde: El único consumo sin riesgo es 0.
          </div>
        </div>

        {/* --- SECCIÓN DE CONSENTIMIENTO --- */}
        {!dataSaved ? (
          <div className="w-full max-w-lg bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-2">🤝 Colabore con la ciencia</h3>
            <p className="text-sm text-gray-600 mb-4">
              ¿Nos permite guardar sus respuestas de forma <strong>totalmente anónima</strong> para estudios estadísticos sobre salud hepática? No guardaremos su nombre ni teléfono.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => manejarConsentimiento(false)}
                className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 font-medium"
              >
                No, gracias
              </button>
              <button 
                onClick={() => manejarConsentimiento(true)}
                disabled={isSaving}
                className="flex-1 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-bold shadow-lg disabled:opacity-50"
              >
                {isSaving ? 'Guardando...' : 'Sí, contribuir'}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-green-600 font-medium bg-green-50 px-6 py-3 rounded-full border border-green-200">
            ✅ ¡Gracias! Sus datos anónimos han sido registrados.
          </div>
        )}
      </div>
    );
  }

  return null;
}