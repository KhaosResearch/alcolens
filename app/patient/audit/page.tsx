'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { auditQuestionsData, studyLevel } from '@/app/api/audit'; 
// Asegúrate de que esta ruta es correcta según tu estructura
import AuditQuestionCard from '@/app/lib/auditquestioncard'; 
import { riskEvaluation, Sex, auditResult } from '@/app/lib/utils/auditLogic'; 
import { 
  CheckCircle, 
  ShieldCheck, 
  Activity, 
  GraduationCap, 
  BookOpen, 
  School,
  User,
  ArrowRight
} from 'lucide-react';

// Tipos
type Fase = 'estudios' | 'sexo' | 'test' | 'resultados';

function AuditContent() {
  const searchParams = useSearchParams();

  // --- ESTADOS ---
  const [fase, setFase] = useState<Fase>('estudios');
  const [isSaving, setIsSaving] = useState(false);
  const [dataSaved, setDataSaved] = useState(false);
  const [patientId, setPatientId] = useState('');

  // Datos del paciente
  const [sexo, setSexo] = useState<Sex>('man');
  const [nivelUsuario, setNivelUsuario] = useState<studyLevel>('secundariabach');
  
  // Datos del test
  const [currentIndex, setCurrentIndex] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<string, number>>({});
  const [resultadoFinal, setResultadoFinal] = useState<auditResult | null>(null);

  // 1. GESTIÓN DE ID (Híbrido: Invitación vs Anónimo)
  useEffect(() => {
    const idDeInvitacion = searchParams.get('patientId');
    if (idDeInvitacion) {
      setPatientId(idDeInvitacion);
      console.log("Modo Invitación. ID vinculado:", idDeInvitacion);
    } else {
      const idAleatorio = Math.random().toString(36).substring(2, 15);
      setPatientId(idAleatorio);
      console.log("Modo Anónimo. ID generado:", idAleatorio);
    }
  }, [searchParams]);

  // --- NAVEGACIÓN ---
  const seleccionarEstudios = (nivel: studyLevel) => {
    setNivelUsuario(nivel);
    setFase('sexo');
  };

  const seleccionarSexo = (sexoSeleccionado: Sex) => {
    setSexo(sexoSeleccionado);
    setFase('test');
  };

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

  const terminarTest = (finalRespuestas: Record<string, number>) => {
    const suma = Object.values(finalRespuestas).reduce((a, b) => a + b, 0);
    const resultado = riskEvaluation(suma, sexo);
    setResultadoFinal(resultado);
    setFase('resultados');
  };

  // --- LÓGICA DE GUARDADO (Tu versión robusta) ---
  const manejarConsentimiento = async (acepta: boolean) => {
    if (!acepta) {
      alert("Entendido. No guardaremos sus datos. Gracias por participar.");
      return;
    }

    setIsSaving(true);

    // Diccionario de seguridad (Español/Inglés -> Inglés BD)
    const riskMap: Record<string, string> = {
      'verde': 'green', 'green': 'green',
      'amarillo': 'yellow', 'yellow': 'yellow',
      'ambar': 'amber', 'amber': 'amber',
      'rojo': 'red', 'red': 'red'
    };

    try {
      // Usamos /api/responses como indicaste en tu script
      const response = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: patientId,
          sex: sexo, // Ya usamos 'man'/'woman' en el estado
          studyLevel: nivelUsuario,
          answers: respuestas,
          totalScore: Object.values(respuestas).reduce((a, b) => a + b, 0),
          levelResult: resultadoFinal ? (riskMap[resultadoFinal.riskLevel] || 'green') : 'green'
        })
      });

      if (response.ok) {
        setDataSaved(true);
      } else {
        const error = await response.json();
        console.error("❌ Error API:", error);
        alert("Hubo un problema técnico al guardar.");
      }
    } catch (error) {
      console.error("❌ Error Red:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // --- VISTAS (Diseño Profesional) ---

  // 1. SELECCIÓN DE ESTUDIOS
  if (fase === 'estudios') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
              <BookOpen className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-3">Bienvenido</h1>
            <p className="text-slate-500 text-lg">
              Para personalizar las preguntas, por favor indique su nivel de estudios:
            </p>
          </div>
          
          <div className="grid gap-4">
            <OptionCard 
              icon={School} 
              label="Primaria / Sin estudios" 
              onClick={() => seleccionarEstudios('sinoprimaria')} 
            />
            <OptionCard 
              icon={BookOpen} 
              label="Secundaria / Bachillerato" 
              onClick={() => seleccionarEstudios('secundariabach')} 
            />
            <OptionCard 
              icon={GraduationCap} 
              label="Universidad / Superior" 
              onClick={() => seleccionarEstudios('universitariosup')} 
            />
          </div>
        </div>
      </div>
    );
  }

  // 2. SELECCIÓN DE SEXO
  if (fase === 'sexo') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8">
          <div>
            <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
              <User className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-3">Perfil Biológico</h1>
            <p className="text-slate-500 text-lg">
              Seleccione su sexo biológico para ajustar los baremos médicos de riesgo:
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => seleccionarSexo('man')}
              className="flex flex-col items-center justify-center p-8 bg-white border-2 border-slate-200 rounded-3xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">👨</span>
              <span className="font-bold text-slate-700 group-hover:text-blue-700">Hombre</span>
            </button>
            <button 
              onClick={() => seleccionarSexo('woman')}
              className="flex flex-col items-center justify-center p-8 bg-white border-2 border-slate-200 rounded-3xl hover:border-pink-500 hover:bg-pink-50 transition-all group"
            >
              <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">👩</span>
              <span className="font-bold text-slate-700 group-hover:text-pink-700">Mujer</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. EL TEST
  if (fase === 'test') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl mb-10">
          <div className="flex justify-between items-center mb-4">
             <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Progreso de evaluación</span>
             <span className="text-xs font-bold text-indigo-600">{currentIndex + 1} / {auditQuestionsData.length}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-indigo-600 h-3 rounded-full transition-all duration-500 ease-out" 
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

  // 4. RESULTADOS Y CONSENTIMIENTO
  if (fase === 'resultados' && resultadoFinal) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        
        {/* Tarjeta de Resultado Médico */}
        <div className={`w-full max-w-lg p-8 rounded-3xl shadow-xl border-2 mb-8 bg-white transform transition-all ${resultadoFinal.color}`}>
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-6 h-6 opacity-80" />
            <h2 className="text-2xl font-bold">{resultadoFinal.title}</h2>
          </div>
          <p className="text-lg font-medium opacity-90 leading-relaxed mb-6">
            {resultadoFinal.message}
          </p>
          <div className="bg-slate-900/5 p-4 rounded-xl text-sm font-semibold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Recuerde: El único consumo sin riesgo es 0.
          </div>
        </div>

        {/* Sección de Consentimiento */}
        {!dataSaved ? (
          <div className="w-full max-w-lg bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                 <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Colaboración Científica</h3>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  ¿Autoriza el almacenamiento de estos resultados de forma <strong>anónima</strong> para fines de investigación médica?
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => manejarConsentimiento(false)}
                className="flex-1 py-3.5 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors"
              >
                No guardar
              </button>
              <button 
                onClick={() => manejarConsentimiento(true)}
                disabled={isSaving}
                className="flex-1 py-3.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isSaving ? (
                   <span className="animate-pulse">Guardando...</span>
                ) : (
                   <>
                     <span>Contribuir</span>
                     <ArrowRight className="w-4 h-4" />
                   </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-lg bg-emerald-50 border border-emerald-100 p-6 rounded-3xl flex items-center gap-4 text-emerald-800 animate-in fade-in slide-in-from-bottom-4">
            <div className="p-2 bg-emerald-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="font-bold text-lg">¡Registro Completado!</p>
              <p className="text-sm text-emerald-700/80">Gracias por contribuir a la investigación.</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}

// Componente auxiliar para botones de opciones
function OptionCard({ icon: Icon, label, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center w-full p-5 bg-white border-2 border-slate-100 rounded-2xl hover:border-indigo-500 hover:bg-indigo-50/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all group text-left"
    >
      <div className="p-3 bg-slate-100 rounded-xl text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-colors mr-4">
        <Icon className="w-6 h-6" />
      </div>
      <span className="text-lg font-medium text-slate-700 group-hover:text-indigo-900">{label}</span>
      <ArrowRight className="w-5 h-5 ml-auto text-slate-300 group-hover:text-indigo-500 transition-colors" />
    </button>
  );
}

// Exportación Principal con Suspense para useSearchParams
export default function AuditPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50"></div>}>
      <AuditContent />
    </Suspense>
  );
}