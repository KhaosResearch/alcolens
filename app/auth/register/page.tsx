'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Activity, 
  User, 
  Mail, 
  Lock, 
  Stethoscope, 
  FileBadge, 
  ArrowRight, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    specialization: '',
    medicalLicense: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña es demasiado corta (mínimo 6 caracteres).');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          role: 'doctor',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error en el registro.');
        setLoading(false);
        return;
      }

      router.push('/auth/login?registered=true');
    } catch (err) {
      setError('Error de conexión. Inténtelo más tarde.');
      setLoading(false);
    }
  }

  // Componente auxiliar para Inputs con Icono
  const FormInput = ({ 
    label, id, type = "text", icon: Icon, placeholder, value, onChange, colSpan = "col-span-1" 
  }: any) => (
    <div className={`space-y-1.5 ${colSpan}`}>
      <label htmlFor={id} className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#CD4242] transition-colors">
          <Icon className="h-5 w-5" />
        </div>
        <input
          id={id}
          name={id}
          type={type}
          required
          placeholder={placeholder}
          className="block w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#CD4242]/20 focus:border-[#CD4242] transition-all font-medium"
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#CD4242] p-4 sm:p-6 font-sans">

      {/* TARJETA DE REGISTRO (Más ancha para el grid) */}
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl shadow-red-900/20 overflow-hidden animate-in zoom-in-95 duration-500">
        
        {/* Barra decorativa */}
        <div className="h-2 bg-gradient-to-r from-slate-100 via-[#CD4242] to-slate-100 opacity-80" />

        <div className="p-8 sm:p-10">
          <div className="mb-8 text-center sm:text-left border-b border-slate-100 pb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Crear Cuenta</h2>
              <p className="text-slate-500 text-sm mt-1">Únase a nuestra red de especialistas médicos</p>
            </div>
            <div className="hidden sm:block p-2 bg-red-50 rounded-full">
               <Stethoscope className="w-6 h-6 text-[#CD4242]" />
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Mensaje de Error */}
            {error && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm animate-in shake">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            {/* GRID DE DATOS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Sección Personal */}
              <div className="sm:col-span-2">
                <FormInput 
                  label="Nombre Completo" 
                  id="name" 
                  icon={User} 
                  placeholder="Dr. Antonio Luis Cansino" 
                  value={formData.name} 
                  onChange={handleChange} 
                />
              </div>

              <div className="sm:col-span-2">
                <FormInput 
                  label="Correo Profesional" 
                  id="email" 
                  type="email" 
                  icon={Mail} 
                  placeholder="ejemplo@hospital.com" 
                  value={formData.email} 
                  onChange={handleChange} 
                />
              </div>

              {/* Datos Médicos */}
              <FormInput 
                label="Especialización" 
                id="specialization" 
                icon={Activity} 
                placeholder="Ej: Cardiología" 
                value={formData.specialization} 
                onChange={handleChange} 
              />

              <FormInput 
                label="Nº Colegiado / Licencia" 
                id="medicalLicense" 
                icon={FileBadge} 
                placeholder="Licencia médica" 
                value={formData.medicalLicense} 
                onChange={handleChange} 
              />

              {/* Contraseñas */}
              <FormInput 
                label="Contraseña" 
                id="password" 
                type="password" 
                icon={Lock} 
                placeholder="••••••••" 
                value={formData.password} 
                onChange={handleChange} 
              />

              <FormInput 
                label="Confirmar Contraseña" 
                id="confirmPassword" 
                type="password" 
                icon={Lock} 
                placeholder="••••••••" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
              />
            </div>

            {/* Disclaimer Legal */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
               <div className="flex gap-3">
                  <input type="checkbox" required className="mt-1 w-4 h-4 text-[#CD4242] rounded focus:ring-[#CD4242]" />
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Certifico que soy un profesional sanitario autorizado y acepto los <a href="#" className="text-[#CD4242] underline">Términos de Servicio</a> y la <a href="#" className="text-[#CD4242] underline">Política de Privacidad</a> de AlcoLens Pro.
                  </p>
               </div>
            </div>

            {/* Botón de Acción */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-4 px-4 bg-[#CD4242] hover:bg-[#b03030] text-white font-bold rounded-xl shadow-lg shadow-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#CD4242] disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  <span>Procesando solicitud...</span>
                </>
              ) : (
                <>
                  <span>Registrar Cuenta</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              ¿Ya tiene credenciales?{' '}
              <Link href="/auth/login" className="font-bold text-[#CD4242] hover:underline transition-colors">
                Iniciar Sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}