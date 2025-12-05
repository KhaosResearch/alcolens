'use client';

import { studyLevel, auditQuestionsData } from '@/app/api/audit';
import { Sex, calculateAuditScore, riskEvaluation, saveAuditResult } from '@/app/lib/utils/auditLogic';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { primaryFontBold, primaryFontRegular } from '@/app/lib/utils/fonts';
import LiquidButton from '@/app/lib/utils/button-liquids';
import { AuditStep, OptionCard } from './components/audit-step';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/app/lib/utils';
import { Loader2, Download, CheckCircle2 } from 'lucide-react';
import { jsPDF } from 'jspdf';


type Fase = 'estudios' | 'sexo' | 'test' | 'consentimiento' | 'resultados';

function AuditLoading() {
  return (
    <div className={`${primaryFontRegular.className} min-h-screen flex flex-col items-center justify-center bg-background`}>
      <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-lg text-muted-foreground font-medium">Cargando...</p>
      </div>
    </div>
  );
}

function AuditContent() {

  const searchParams = useSearchParams();
  const [fase, setFase] = useState<Fase>('estudios');

  const [saving, setIsSaving] = useState(false);
  const [dataSaved, setDataSaved] = useState(false);

  const [patientId, setPatientId] = useState('');
  const [isGuest, setIsGuest] = useState(true);

  const [sexo, setSexo] = useState<Sex>('man');
  const [estudios, setEstudios] = useState<studyLevel>('sinoprimaria');

  const [test, setTest] = useState(0);
  const [resultados, setResultados] = useState<Record<string, number>>({});
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    const idInvitation = searchParams.get('id');
    if (idInvitation) {
      setPatientId(idInvitation);
      setIsGuest(false);
    } else {
      setPatientId(Math.random().toString(36).substring(2, 9));
      setIsGuest(true);
    }
  }, [searchParams]);

  const handleFinish = async () => {
    setIsSaving(true);
    const score = calculateAuditScore(resultados);
    const risk = riskEvaluation(score, sexo).riskLevel;

    await saveAuditResult(patientId, score, risk, resultados, sexo, estudios, consent);

    setIsSaving(false);
    setDataSaved(true);
    setFase('resultados');
  };

  // Función para renderizar el contenido según la fase actual
  // Esto es el "Cerebro" de nuestra UI: decide qué mostrar basándose en el estado.
  const renderStep = () => {
    switch (fase) {
      case 'estudios':
        return (
          <AuditStep
            title="Nivel de Estudios"
            description="Para adaptar la información a usted, seleccione su nivel de estudios más alto."
            onNext={() => setFase('sexo')}
            canNext={!!estudios}
          >
            <div className="grid gap-3">
              <OptionCard
                label="Sin estudios / Primaria"
                selected={estudios === 'sinoprimaria'}
                onClick={() => setEstudios('sinoprimaria')}
              />
              <OptionCard
                label="Secundaria / Bachillerato"
                selected={estudios === 'secundariabach'}
                onClick={() => setEstudios('secundariabach')}
              />
              <OptionCard
                label="Universitarios / Postgrado"
                selected={estudios === 'universitariosup'}
                onClick={() => setEstudios('universitariosup')}
              />
            </div>
          </AuditStep>
        );
      case 'sexo':
        return (
          <AuditStep
            title="Sexo Biológico"
            description="El metabolismo del alcohol varía según el sexo biológico."
            onNext={() => setFase('test')}
            canNext={!!sexo}
          >
            <div className="grid gap-3">
              <OptionCard
                label="Hombre"
                selected={sexo === 'man'}
                onClick={() => setSexo('man')}
              />
              <OptionCard
                label="Mujer"
                selected={sexo === 'woman'}
                onClick={() => setSexo('woman')}
              />
            </div>
          </AuditStep>
        );
      case 'test':
        const currentQuestion = auditQuestionsData[test];
        const progress = ((test + 1) / auditQuestionsData.length) * 100;

        return (
          <AuditStep
            title={`Pregunta ${test + 1} de ${auditQuestionsData.length}`}
            description={currentQuestion.question[estudios]}
          // No "Next" button here, we advance on selection
          >
            <div className="grid gap-3">
              {currentQuestion.answerOptions.map((option) => (
                <OptionCard
                  key={option.valor}
                  label={option.texto[estudios]}
                  selected={resultados[currentQuestion.id] === option.valor}
                  onClick={() => {
                    // Guardamos la respuesta
                    const newResultados = { ...resultados, [currentQuestion.id]: option.valor };
                    setResultados(newResultados);

                    // Avanzamos o terminamos
                    if (test < auditQuestionsData.length - 1) {
                      setTimeout(() => setTest(test + 1), 250); // Pequeño delay para feedback visual
                    } else {
                      // Trigger save logic
                      setTimeout(() => setFase('consentimiento'), 250);
                    }
                  }}
                />
              ))}
            </div>

            {/* Barra de progreso simple */}
            <div className="mt-8 h-1 w-full bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </AuditStep>
        );
      case 'consentimiento':
        return (
          <AuditStep
            title="Consentimiento de Datos"
            description="Para guardar sus resultados y generar su informe, necesitamos su consentimiento."
            onNext={handleFinish}
            canNext={consent}
            nextLabel="Finalizar y Ver Resultados"
          >
            <div className="bg-muted/30 p-6 rounded-xl border border-border space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <input
                    type="checkbox"
                    id="consent-check"
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                  />
                </div>
                <label htmlFor="consent-check" className="text-sm text-foreground leading-relaxed cursor-pointer">
                  Acepto que mis datos anonimizados (respuestas, puntuación y nivel de riesgo) sean almacenados para fines estadísticos y de seguimiento médico. Entiendo que mi identidad está protegida mediante un ID único.
                </label>
              </div>
            </div>
          </AuditStep>
        );
      case 'resultados':
        const score = calculateAuditScore(resultados);
        const result = riskEvaluation(score, sexo);

        const generatePDF = () => {
          const doc = new jsPDF();

          // Header
          doc.setFontSize(32);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(40, 40, 40);
          doc.text("Informe de Evaluación AUDIT-C", 20, 20);

          doc.setFontSize(12);
          doc.setTextColor(100, 100, 100);
          doc.text(`ID Paciente: ${patientId}`, 20, 30);
          doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 36);

          // Resultado Principal
          doc.setDrawColor(200, 200, 200);
          doc.line(20, 45, 190, 45);

          doc.setFontSize(16);
          doc.setTextColor(0, 0, 0);
          doc.text("Resultado:", 20, 60);

          doc.setFontSize(14);
          if (result.color === 'green') doc.setTextColor(34, 197, 94);
          else if (result.color === 'yellow') doc.setTextColor(234, 179, 8);
          else if (result.color === 'amber') doc.setTextColor(249, 115, 22);
          else doc.setTextColor(239, 68, 68);

          doc.text(`${result.title} (${score} puntos)`, 50, 60);

          doc.setFontSize(12);
          doc.setTextColor(60, 60, 60);
          doc.text(result.message, 20, 75);

          // Detalles
          doc.line(20, 85, 190, 85);
          doc.text("Respuestas:", 20, 95);

          let y = 105;
          auditQuestionsData.forEach((q, index) => {
            const answerVal = resultados[q.id];
            const answerText = q.answerOptions.find(opt => opt.valor === answerVal)?.texto[estudios] || "N/A";

            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            const questionTitle = doc.splitTextToSize(`${index + 1}. ${q.question[estudios]}`, 170);
            doc.text(questionTitle, 20, y);
            y += (questionTitle.length * 5) + 2;

            doc.setTextColor(0, 0, 0);
            doc.text(answerText, 25, y);
            y += 10;
          });

          // Footer
          doc.setFontSize(7);
          doc.text("Este documento es informativo y no sustituye un diagnóstico médico profesional.", 20, 280);
          doc.text("Generado por Alcolens", 20, 285);

          doc.save(`Alcolens_Report_${patientId}.pdf`);
        };

        return (
          <AuditStep
            title="Resultados del Test"
            description="Basado en sus respuestas, este es su nivel de riesgo estimado."
          >
            <div className="space-y-8 animate-in zoom-in-95 duration-500">

              {/* Score Circle */}
              <div className="flex justify-center">
                <div className={cn(
                  "w-32 h-32 rounded-full flex flex-col items-center justify-center border-4 shadow-xl transition-colors duration-500",
                  result.color === 'green' ? "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400" :
                    result.color === 'yellow' ? "border-yellow-500 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400" :
                      result.color === 'amber' ? "border-orange-500 bg-orange-500/10 text-orange-700 dark:text-orange-400" :
                        "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400"
                )}>
                  <span className="text-4xl font-bold">{score}</span>
                  <span className="text-xs font-medium uppercase tracking-wider">Puntos</span>
                </div>
              </div>

              {/* Risk Text */}
              <div className="text-center space-y-2">
                <h3 className={cn("text-2xl font-bold",
                  result.color === 'green' ? "text-green-600 dark:text-green-400" :
                    result.color === 'yellow' ? "text-yellow-600 dark:text-yellow-400" :
                      result.color === 'amber' ? "text-orange-600 dark:text-orange-400" :
                        "text-red-600 dark:text-red-400"
                )}>
                  {result.title}
                </h3>
                <p className="text-muted-foreground text-lg">
                  {result.message}
                </p>
              </div>

              <div className="flex flex-col gap-3 justify-center pt-4 items-center">
                <LiquidButton
                  onClick={generatePDF}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-primary rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <Download className="w-5 h-5" />
                  <span>Descargar Informe PDF</span>
                </LiquidButton>

                <LiquidButton
                  href="/"
                  className="w-fit"
                >Volver al inicio
                </LiquidButton>
              </div>
            </div>
          </AuditStep>
        );
      default:
        return null;
    }
  };

  if (saving) {
    return (
      <div className={`${primaryFontRegular.className} min-h-screen flex flex-col items-center justify-center bg-background`}>
        <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-lg text-muted-foreground font-medium">Guardando resultados...</p>
        </div>
      </div>
    );
  }

  return (
    // 1. Container Principal (The Wrapper)
    // min-h-screen: Ocupa al menos toda la altura de la pantalla.
    // flex flex-col: Organiza los hijos en columna (útil para footer sticky si lo hubiera).
    // bg-background: Usa el color de fondo definido en globals.css (oklch).
    <div className={`${primaryFontRegular.className} min-h-screen flex flex-col bg-background relative overflow-hidden`}>

      {/* 2. Elementos Decorativos de Fondo (Background Blobs) */}
      {/* Estos divs absolutos crean el efecto de "luz" o "mancha" en el fondo */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />
      </div>

      {/* 3. Contenido Principal (The Stage) */}
      {/* z-10: Asegura que el contenido esté por encima del fondo decorativo. */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 z-10">

        {/* 4. La Tarjeta (The Card) */}
        {/* max-w-2xl: Limita el ancho para que no se estire demasiado en pantallas grandes. */}
        {/* w-full: Ocupa todo el ancho disponible hasta el máximo. */}
        <div className="w-full max-w-2xl">

          {/* Header de la sección */}
          <div className="text-center mb-8 space-y-2">
            <h1 className={`${primaryFontBold.className} text-3xl sm:text-4xl text-primary`}>
              Evaluación AUDIT-C
            </h1>
            <p className="text-muted-foreground text-lg">
              Cuestionario clínico validado para la detección de consumo de alcohol.
            </p>
          </div>

          {/* Área del Formulario */}
          <div className="bg-card border border-border rounded-3xl shadow-xl shadow-primary/5 p-6 sm:p-10 backdrop-blur-sm transition-all duration-500 overflow-hidden">
            {/* Aquí llamamos a nuestra función "cerebro" */}
            <div className="min-h-[300px] flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={fase}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="w-full"
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default function AuditPage() {
  return (
    <Suspense fallback={<AuditLoading />}>
      <AuditContent />
    </Suspense>
  );
}
