'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Activity, Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { primaryFontBold } from '@/app/lib/utils/fonts';
import { primaryFontRegular } from '@/app/lib/utils/fonts';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        router.push('/');
        router.refresh();
      } else {
        setError('Credenciales no válidas. Verifique sus datos.');
      }
    } catch (err) {
      setError('Error de conexión. Inténtelo más tarde.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`${primaryFontRegular.className} min-h-screen flex flex-col justify-center items-center bg-[#CD4242] p-4 sm:p-6 font-sans`}>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-red-900/20 overflow-hidden animate-in zoom-in-95 duration-500">
        
        {/* Barra decorativa superior */}
        <div className="h-2 bg-gradient-to-r from-slate-100 via-[#CD4242] to-slate-100 opacity-80" />

        <div className="p-8 sm:p-10">
          <div className="mb-8 text-center">
            <h2 className={`${primaryFontBold.className} text-[#CD4242] text-2xl`}>Bienvenido</h2>
            <p className={`${primaryFontRegular.className} text-slate-500 text-sm mt-1`}>Inicie sesión para acceder al panel médico</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* Mensaje de Error (Estilo alerta suave) */}
            {error && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm animate-in shake">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            {/* Input Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Correo Profesional
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#CD4242] transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="doctor@hospital.com"
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#CD4242]/20 focus:border-[#CD4242] transition-all font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label htmlFor="password" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Contraseña
                </label>
                <a href="/password" className={`${primaryFontRegular.className} text-xs font-bold text-[#CD4242] hover:text-red-700 transition-colors`}>
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#CD4242] transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#CD4242]/20 focus:border-[#CD4242] transition-all font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Botón Submit (Grande y Rojo) */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-4 px-4 bg-[#CD4242] hover:bg-[#b03030] text-white font-bold rounded-xl shadow-lg shadow-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#CD4242] disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    <span>Verificando...</span>
                  </>
                ) : (
                  <>
                    <span>Iniciar Sesión</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer de la tarjeta */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              ¿No tiene cuenta autorizada?{' '}
              <Link href="/auth/register" className="font-bold text-[#CD4242] hover:underline transition-colors">
                Solicitar Acceso
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}