'use client';

import { primaryFontBold, primaryFontRegular } from '@/app/lib/utils/fonts';
import { motion } from 'motion/react';
import LiquidButton from '@/app/lib/utils/button-liquids';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
    const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus('submitting');

        // Recoger datos del formulario
        const form = e.target as HTMLFormElement;
        const formData = {
            name: (form.elements.namedItem('name') as HTMLInputElement).value,
            email: (form.elements.namedItem('email') as HTMLInputElement).value,
            subject: (form.elements.namedItem('subject') as HTMLSelectElement).value,
            message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
        };

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setFormStatus('success');
                form.reset();
            } else {
                alert('Error al enviar el mensaje. Inténtelo de nuevo.');
                setFormStatus('idle');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión.');
            setFormStatus('idle');
        }
    };

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
                    className="text-center space-y-6 mb-16 mt-10"
                >
                    <div className="inline-block p-2 px-4 rounded-full bg-card text-foreground shadow-2xl border font-bold text-sm mb-4 tracking-wider uppercase">
                        Contacto
                    </div>
                    <h1 className={`${primaryFontBold.className} text-4xl sm:text-6xl text-primary leading-tight`}>
                        Estamos aquí para<br />ayudarte
                    </h1>
                    <p className="text-xl text-foreground max-w-2xl mx-auto leading-relaxed">
                        ¿Tienes preguntas sobre Alcolens o quieres saber más sobre nuestra metodología? Escríbenos.
                    </p>
                </motion.div>

                <div className="max-w-2xl mx-auto w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-card border border-border p-8 sm:p-10 rounded-[2rem] shadow-xl shadow-primary/5 backdrop-blur-sm"
                    >
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full text-primary mb-4">
                                <Mail className="w-6 h-6" />
                            </div>
                            <h3 className={`${primaryFontBold.className} text-2xl text-primary mb-2`}>Envíanos un mensaje</h3>
                            <p className="text-muted-foreground">
                                O escríbenos directamente a <a href="mailto:info@alcolens.com" className="text-primary font-bold hover:underline">alcolenscontact@gmail.com</a>
                            </p>
                        </div>

                        {formStatus === 'success' ? (
                            <div className="text-center py-12 space-y-4 animate-in fade-in zoom-in">
                                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Send className="w-8 h-8" />
                                </div>
                                <h4 className="text-xl font-bold text-foreground">¡Mensaje Enviado!</h4>
                                <p className="text-muted-foreground">Gracias por contactarnos. Nos pondremos en contacto contigo pronto.</p>
                                <button
                                    onClick={() => setFormStatus('idle')}
                                    className="text-primary font-bold hover:underline mt-4"
                                >
                                    Enviar otro mensaje
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-bold text-foreground ml-1">Nombre</label>
                                        <input
                                            type="text"
                                            id="name"
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            placeholder="Tu nombre"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-bold text-foreground ml-1">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            placeholder="tu@email.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="subject" className="text-sm font-bold text-foreground ml-1">Asunto</label>
                                    <select
                                        id="subject"
                                        className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                                    >
                                        <option>Información General</option>
                                        <option>Soporte Técnico</option>
                                        <option>Colaboraciones</option>
                                        <option>Otro</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-bold text-foreground ml-1">Mensaje</label>
                                    <textarea
                                        id="message"
                                        required
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                                        placeholder="¿En qué podemos ayudarte?"
                                    />
                                </div>

                                <LiquidButton
                                    type="submit"
                                    disabled={formStatus === 'submitting'}
                                    className="w-full font-bold"
                                >
                                    {formStatus === 'submitting' ? 'Enviando...' : 'Enviar Mensaje'}
                                </LiquidButton>
                            </form>
                        )}
                    </motion.div>
                </div>

            </main>
        </div>
    );
}
