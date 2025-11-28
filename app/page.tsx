'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  Activity,
  ShieldCheck,
  Zap,
  ArrowRight,
  Stethoscope,
  CheckCircle2,
  ArrowBigDown,
  ArrowBigUp
} from 'lucide-react';
import { primaryFontBold, primaryFontRegular } from '@/app/lib/utils/fonts';
import LiquidButton from '@/app/lib/utils/button-liquids';

export default function LandingPage() {
  const { data: session } = useSession();

  return (
    <div className={`${primaryFontRegular.className} min-h-screen flex flex-col bg-background`}>

      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center text-primary">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-xs font-bold tracking-wider uppercase">Sistema Clínico Validado</span>
        </div>

        <h1 className={`${primaryFontBold.className} text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl drop-shadow-sm animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100`}>
          Precisión Médica en <br className="hidden sm:block" />
          <span className="text-primary">Detección de Alcohol</span>
        </h1>

        <p className="text-lg sm:text-xl text-primary max-w-2xl mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          AlcoLens Pro ofrece herramientas avanzadas para profesionales de la salud.
          Gestión de pacientes, evaluaciones AUDIT-C y seguimiento en tiempo real.
        </p>

        <LiquidButton
          href="/patient/audit"
          className="w-full"
        >
          <span>Comenzar Cuestionario</span>
          <ArrowRight className="w-5 h-5" />
        </LiquidButton>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-20">
        <div className="bg-primary rounded-[2.5rem] shadow-2xl shadow-red-900/20 p-8 sm:p-12 lg:p-16 animate-in fade-in zoom-in-95 duration-700 delay-500">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

            <div className="space-y-4">
              <div className="w-14 h-14 bg-secondary  rounded-2xl flex items-center justify-center text-primary">
                <Stethoscope className="w-7 h-7" />
              </div>
              <h3 className={`${primaryFontBold.className} text-xl text-secondary`}>Uso Clínico</h3>
              <p className="text-secondary leading-relaxed">
                Diseñado específicamente para entornos médicos, cumpliendo con los estándares de privacidad y seguridad de datos.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="space-y-4">
              <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center text-primary">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className={`${primaryFontBold.className} text-xl text-secondary`}>Seguridad Total</h3>
              <p className="text-secondary leading-relaxed">
                Protección de extremo a extremo. Sus datos y los de sus pacientes están encriptados y seguros.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="space-y-4">
              <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center text-primary  ">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className={`${primaryFontBold.className} text-xl text-secondary`}>Análisis Rápido</h3>
              <p className="text-secondary leading-relaxed">
                Obtenga resultados instantáneos de las evaluaciones y tome decisiones informadas al momento.
              </p>
            </div>

          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-10 border-t border-slate-100 flex flex-wrap justify-center gap-8 sm:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 font-bold text-secondary">
              <CheckCircle2 className="w-5 h-5" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-secondary">
              <CheckCircle2 className="w-5 h-5" />
              <span>ISO 27001</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-secondary">
              <CheckCircle2 className="w-5 h-5" />
              <span>GDPR Ready</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
