'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { primaryFontBold, primaryFontRegular } from '@/app/lib/utils/fonts';
import LiquidButton from '@/app/lib/utils/button-liquids';

export default function PasswordRecoveryPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        try {
            const res = await fetch('/api/auth/password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
            } else {
                setStatus('error');
                setErrorMessage(data.message || 'Error al procesar la solicitud');
            }
        } catch (error) {
            setStatus('error');
            setErrorMessage('Error de conexión. Inténtelo más tarde.');
        }
    };

    return (
        <div className={`${primaryFontRegular.className} min-h-screen flex flex-col justify-center items-center bg-background p-4 sm:p-6 font-sans`}>

            <div className="w-full max-w-md bg-card rounded-3xl shadow-2xl shadow-primary/20 overflow-hidden animate-in zoom-in-95 duration-500 border border-border">

                <div className="p-8 sm:p-10">

                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h2 className={`${primaryFontBold.className} text-primary text-2xl`}>Recuperar Contraseña</h2>
                        <p className="text-muted-foreground text-sm mt-2">
                            Ingrese su correo electrónico y le enviaremos las instrucciones para restablecer su contraseña.
                        </p>
                    </div>

                    {status === 'success' ? (
                        <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-bold text-foreground text-lg">¡Correo Enviado!</h3>
                                <p className="text-muted-foreground text-sm">
                                    Si existe una cuenta asociada a <strong>{email}</strong>, recibirá un enlace de recuperación en unos minutos.
                                </p>
                            </div>
                            <Link
                                href="/auth/login"
                                className="inline-flex items-center gap-2 text-primary font-bold hover:underline mt-4"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Volver al inicio de sesión
                            </Link>
                        </div>
                    ) : (
                        <form className="space-y-6" onSubmit={handleSubmit}>

                            {/* Error Message */}
                            {status === 'error' && (
                                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium animate-in shake">
                                    {errorMessage}
                                </div>
                            )}

                            {/* Email Input */}
                            <div className="space-y-1.5">
                                <label htmlFor="email" className="block text-xs font-bold text-primary uppercase tracking-wider ml-1">
                                    Correo Electrónico
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        placeholder="doctor@hospital.com"
                                        className="block w-full pl-12 pr-4 py-3.5 bg-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring transition-all font-medium"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-4 pt-2">
                                <LiquidButton
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full font-bold"
                                >
                                    {status === 'loading' ? (
                                        <>
                                            <Loader2 className="animate-spin h-5 w-5" />
                                            <span>Enviando...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Enviar Instrucciones</span>
                                            <ArrowRight className="h-5 w-5" />
                                        </>
                                    )}
                                </LiquidButton>

                                <div className="text-center">
                                    <Link
                                        href="/auth/login"
                                        className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        Cancelar y volver
                                    </Link>
                                </div>
                            </div>
                        </form>
                    )}

                </div>
            </div>
        </div>
    );
}
