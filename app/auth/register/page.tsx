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
// Asegúrate de que esta ruta apunta a donde guardaste tu componente LiquidButton
import LiquidButton from '@/app/lib/utils/button-liquids';

// Componente auxiliar para Inputs con Icono (Adaptado al Tema)
const FormInput = ({
  label, id, type = "text", icon: Icon, placeholder, value, onChange, colSpan = "col-span-1"
}: any) => (
  <div className={`space-y-1.5 ${colSpan}`}>
    <label htmlFor={id} className="block text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
        <Icon className="h-5 w-5" />
      </div>
      <input
        id={id}
        name={id}
        type={type}
        required
        placeholder={placeholder}
        className="block w-full pl-12 pr-4 py-3 bg-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
        value={value}
        onChange={onChange}
      />
    </div>
  </div>
);

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    specialization: '',
    medicalLicense: '',
    hospitalCode: '',
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

  return (
    // FONDO: Usamos bg-primary (Tu rojo corporativo)
    <div className="min-h-screen flex flex-col justify-center items-center bg-background p-4 sm:p-6 font-sans">

      {/* TARJETA DE REGISTRO */}
      <div className="w-full max-w-2xl bg-card text-card-foreground rounded-3xl shadow-2xl shadow-black/20 overflow-hidden animate-in zoom-in-95 duration-500 border border-border">
        
        <div className="p-8 sm:p-10">
          <div className="mb-8 text-center sm:text-left border-b border-border pb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Crear Cuenta</h2>
              <p className="text-muted-foreground text-sm mt-1">Únase a nuestra red de especialistas médicos</p>
            </div>
            <div className="hidden sm:block p-2 bg-primary/10 rounded-full">
              <Stethoscope className="w-6 h-6 text-primary" />
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>

            {/* Mensaje de Error */}
            {error && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm animate-in shake">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            <div className="col-span-1 sm:col-span-2">
              <label htmlFor="hospitalCode" className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Código de Acceso del Centro
              </label>
              <div className="relative group mt-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#CD4242]">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="hospitalCode"
                  name="hospitalCode"
                  type="password"
                  required
                  placeholder="Código proporcionado por administración"
                  className="block w-full pl-12 pr-4 py-3 bg-background border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#CD4242]/20 focus:border-[#CD4242] transition-all font-medium text-foreground"
                  // Asegúrate de añadir 'hospitalCode' a tu estado 'formData' y 'handleChange'
                  value={formData.hospitalCode} 
                  onChange={handleChange}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1 ml-1">Requerido para validar su identidad profesional.</p>
            </div>


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
            <div className="bg-muted/30 p-4 rounded-xl border border-border">
              <div className="flex gap-3">
                <input 
                  type="checkbox" 
                  required 
                  className="mt-1 w-4 h-4 text-primary border-input rounded focus:ring-primary" 
                />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Certifico que soy un profesional sanitario autorizado y acepto los <a href="#" className="text-primary hover:underline font-medium">Términos de Servicio</a> y la <a href="#" className="text-primary hover:underline font-medium">Política de Privacidad</a> de AlcoLens Pro.
                </p>
              </div>
            </div>

            

            {/* Botón de Acción con LiquidButton */}
            <LiquidButton
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center font-bold text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <span className="mr-2">Registrar Cuenta</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </LiquidButton>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              ¿Ya tiene credenciales?{' '}
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