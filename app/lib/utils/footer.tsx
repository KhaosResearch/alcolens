import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    // 'mt-auto': Empuja el footer al final si el contenido es corto
    // 'backdrop-blur-md': Mantiene el efecto cristal
    <footer className="mt-auto bg-background/95 backdrop-blur-md border-white/10">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">

          {/* Copyright y Marca */}
          <div className="text-center md:text-left">
            <p className="text-xs text-white/60 mt-1">
              Registro seguro encriptado SSL
            </p>
            <p className="text-xs text-white/60 mt-1">
              &copy; {new Date().getFullYear()} Servicio de Medicina Interna. Todos los derechos reservados.
            </p>
          </div>

          <div className="text-center md:text-center">
            <p className="text-sm text-white">
              AlcoLens v2.0<span className="opacity-70 font-normal"></span>
            </p>
          </div>

          {/* Enlaces Legales (Estilo sutil) */}
          <div className="flex flex-wrap justify-center gap-6 text-xs font-medium text-white/70">
            <Link href="#" className="hover:text-white transition-colors hover:underline">
              Política de Privacidad
            </Link>
            <Link href="#" className="hover:text-white transition-colors hover:underline">
              Términos de Uso
            </Link>
            <Link href="#" className="hover:text-white transition-colors hover:underline">
              Soporte Técnico
            </Link>
          </div>

        </div>

        {/* Pequeño disclaimer médico */}
        <div className="mt-8 pt-4 border-t border-white/10 text-center">
          <p className="text-[10px] text-white/40 uppercase tracking-widest">
            Uso exclusivo para personal sanitario autorizado
          </p>
        </div>

      </div>
    </footer>
  );
}