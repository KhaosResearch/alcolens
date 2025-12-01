'use client';

import { primaryFontBold, primaryFontRegular } from '@/app/lib/utils/fonts';
import { motion } from 'motion/react';
import LiquidButton from '@/app/lib/utils/button-liquids';
import { ShieldCheck, Activity, Brain, Users } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className={`${primaryFontRegular.className} min-h-screen flex flex-col bg-background relative overflow-hidden`}>
            {/* Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />
            </div>

            <main className="flex-1 flex flex-col items-center p-6 sm:p-12 z-10 max-w-6xl mx-auto w-full">

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center space-y-6 mb-20 mt-10"
                >
                    <div className="inline-block p-2 px-4 rounded-full bg-primary/10 text-primary font-bold text-sm mb-4 tracking-wider uppercase">
                        Sobre Nosotros
                    </div>
                    <h1 className={`${primaryFontBold.className} text-4xl sm:text-6xl text-primary leading-tight`}>
                        Tecnología para la<br />Salud Preventiva
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Transformando la detección temprana del consumo de alcohol mediante herramientas digitales accesibles, privadas y validadas clínicamente.
                    </p>
                </motion.div>

                {/* Content Grid */}
                <div className="grid md:grid-cols-2 gap-8 w-full mb-20">
                    {/* Card 1: What is Alcolens */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-card border border-border p-8 sm:p-10 rounded-[2rem] shadow-xl shadow-primary/5 backdrop-blur-sm hover:shadow-primary/10 transition-shadow"
                    >
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <h2 className={`${primaryFontBold.className} text-3xl text-primary mb-4`}>
                            ¿Qué es Alcolens?
                        </h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Alcolens es una plataforma digital diseñada para facilitar el cribado y la intervención breve en el consumo de alcohol. Utilizamos el cuestionario <strong>AUDIT-C</strong>, el estándar de oro recomendado por la OMS, para proporcionar evaluaciones rápidas y precisas en entornos clínicos y personales.
                        </p>
                    </motion.div>

                    {/* Card 2: Science */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-card border border-border p-8 sm:p-10 rounded-[2rem] shadow-xl shadow-secondary/5 backdrop-blur-sm hover:shadow-secondary/10 transition-shadow"
                    >
                        <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 text-secondary">
                            <Brain className="w-8 h-8" />
                        </div>
                        <h2 className={`${primaryFontBold.className} text-3xl text-primary mb-4`}>
                            Ciencia y Tecnología
                        </h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Combinamos la evidencia científica con una experiencia de usuario moderna. Nuestro algoritmo no solo calcula una puntuación, sino que estratifica el riesgo basándose en variables clínicas como el sexo biológico, ofreciendo recomendaciones personalizadas e inmediatas.
                        </p>
                    </motion.div>
                </div>

                {/* Values Section */}
                <div className="w-full mb-20">
                    <h3 className={`${primaryFontBold.className} text-3xl text-center text-primary mb-12`}>
                        Nuestros Valores
                    </h3>
                    <div className="grid sm:grid-cols-3 gap-6">
                        {[
                            { icon: Users, title: "Accesibilidad", desc: "Herramientas fáciles de usar para todos, sin barreras técnicas." },
                            { icon: ShieldCheck, title: "Privacidad", desc: "Compromiso total con la protección de datos y el anonimato." },
                            { icon: Activity, title: "Impacto", desc: "Resultados medibles en la mejora de la salud pública." }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center p-6 rounded-2xl bg-muted/20 border border-muted/50"
                            >
                                <div className="w-12 h-12 mx-auto bg-background rounded-full flex items-center justify-center mb-4 shadow-sm text-primary">
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <h4 className="font-bold text-lg mb-2 text-primary">{item.title}</h4>
                                <p className="text-muted-foreground">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="w-full bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 rounded-[2.5rem] p-10 sm:p-16 text-center relative overflow-hidden"
                >
                    <div className="relative z-10">
                        <h3 className={`${primaryFontBold.className} text-3xl sm:text-4xl text-primary mb-6`}>
                            Comience su evaluación hoy
                        </h3>
                        <p className="text-xl text-muted-foreground max-w-xl mx-auto mb-10">
                            Es rápido, anónimo y gratuito. Conozca su nivel de riesgo en menos de 2 minutos.
                        </p>
                        <div className="flex justify-center">
                            <LiquidButton href="/patient/audit" className="bg-primary text-primary-foreground px-10 py-4 rounded-full text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30">
                                Realizar Test AUDIT-C
                            </LiquidButton>
                        </div>
                    </div>
                </motion.div>

            </main>
        </div>
    );
}
