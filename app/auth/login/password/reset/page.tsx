'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Loader2, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { primaryFontBold, primaryFontRegular } from '@/app/lib/utils/fonts';
import LiquidButton from '@/app/lib/utils/button-liquids';

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('resetToken');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (!token) {
            setError('Token de restablecimiento no válido o faltante.');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/password/reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al restablecer la contraseña');
            }

            setSuccess('Contraseña restablecida correctamente.');
            setTimeout(() => {
                router.push('/auth/login');
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al restablecer la contraseña');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={`${primaryFontRegular.className} min-h-screen flex flex-col justify-center items-center bg-background p-4 sm:p-6 font-sans`}>
            <div className="w-full max-w-md bg-card rounded-3xl shadow-2xl shadow-primary/20 overflow-hidden animate-in zoom-in-95 duration-500 border border-border">
                <div className="p-8 sm:p-10">
                    <div className="mb-8 text-center">
                        <h2 className={`${primaryFontBold.className} text-primary text-2xl`}>Restablecer Contraseña</h2>
                        <p className={`${primaryFontRegular.className} text-muted-foreground text-sm mt-1`}>
                            Ingrese su nueva contraseña para recuperar el acceso.
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {/* Mensajes de Estado */}
                        {error && (
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm animate-in shake">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <p className="font-medium">{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 text-sm animate-in fade-in">
                                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                                <p className="font-medium">{success}</p>
                            </div>
                        )}

                        {/* Input Password */}
                        <div className="space-y-1.5">
                            <label htmlFor="password" className="block text-xs font-bold text-primary uppercase tracking-wider ml-1">
                                Nueva Contraseña
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="block w-full pl-12 pr-4 py-3.5 bg-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring transition-all font-medium"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Input Confirm Password */}
                        <div className="space-y-1.5">
                            <label htmlFor="confirmPassword" className="block text-xs font-bold text-primary uppercase tracking-wider ml-1">
                                Confirmar Contraseña
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="block w-full pl-12 pr-4 py-3.5 bg-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring transition-all font-medium"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Botón Submit */}
                        <div className="pt-2">
                            <LiquidButton
                                type="submit"
                                disabled={loading || !!success}
                                className="w-full font-bold"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin h-5 w-5" />
                                        <span>Restableciendo...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Cambiar Contraseña</span>
                                        <ArrowRight className="h-5 w-5" />
                                    </>
                                )}
                            </LiquidButton>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-border text-center">
                        <p className="text-sm text-muted-foreground">
                            ¿Recordó su contraseña?{' '}
                            <Link href="/auth/login" className="font-bold text-primary hover:underline transition-colors">
                                Iniciar Sesión
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PasswordResetPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}
