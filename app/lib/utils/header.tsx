"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, LogOut, User } from "lucide-react";
import LogoIcon from "@/app/lib/utils/icono";
import LogoText from "@/app/lib/utils/logoText";
import { primaryFontBold } from "./fonts";
import { ThemeToggle } from "@/app/components/theme-toggle";

export const textShadow = "[text-shadow:_0_1px_3px_rgb(0_0_0_/_40%)]";

export default function Header() {
  const { data: session } = useSession();
  const [showMenu, setShowMenu] = useState(false);


  const linkStyle = "text-sm font-bold text-secondary hover:text-secondary/80 transition-colors uppercase tracking-wide";
  const mobileLinkStyle = "block text-lg font-bold text-foreground py-3 border-b border-secondary/20 hover:text-background hover:bg-foreground px-2 rounded-lg transition-all";

  return (
    <header className={`${primaryFontBold.className} bg-primary backdrop-blur-md border-b border-secondary/10 sticky top-0 z-50 font-sans shadow-lg shadow-red-900/10`}>
      <div className="md:flex max-w-7xl mx-auto px-4 h-16 flex justify-between items-center relative gap-10">
        <div className="flex-shrink-0 flex items-center z-20">
          <Link href="/" className="flex items-center gap-3 group">
            <LogoIcon className="h-10 w-10 sm:h-12 sm:w-12 group-hover:scale-105 transition-transform drop-shadow-sm" />

            <div className="hidden sm:block">
              <LogoText className="h-10 sm:h-12 w-auto" />
            </div>

            <span className="sm:hidden text-secondary font-extrabold text-xl tracking-tight drop-shadow-md">
              ALCOLENS
            </span>
          </Link>
        </div>

        <nav className={`${textShadow} hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 gap-8 items-center`}>
          <Link href="/" className={linkStyle}>Inicio</Link>
          <Link href="/about" className={linkStyle}>Sobre Nosotros</Link>
          <Link href="/contact" className={linkStyle}>Contacto</Link>
          {(session?.user as any)?.role === 'doctor' && (
            <Link href="/doctor" className={linkStyle}>Panel Médico</Link>
          )}
        </nav>

        <div className="flex md:flex items-center gap-2 flex-shrink-0 z-20">
          {session && (
            <div className="hidden lg:flex flex-col items-end border-r border-secondary/20 pr-5 mr-1">
              <p className={` ${textShadow} text-sm font-bold text-secondary leading-none tracking-wide shadow-black/5 drop-shadow-sm`}>
                {session.user?.name}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5 justify-end">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                </span>
                <p className={`${textShadow} text-[10px] uppercase tracking-wider font-bold text-secondary/80 leading-none`}>
                  {(session.user as any)?.role}
                </p>
              </div>
            </div>
          )}

          {session ? (
            <button
              onClick={() => signOut({ callbackUrl: '/auth/login' })}
              className={`
                hidden sm:flex group items-center justify-center gap-2.5
                px-5 py-2.5
                rounded-full
                bg-secondary/10 
                border border-secondary/25
                text-secondary font-bold text-sm tracking-wide
                transition-all duration-300 ease-out
                hover:bg-primary/10 hover:text-background hover:shadow-lg hover:shadow-black/10 hover:-translate-y-0.5
                active:scale-95
                ${textShadow}
                `}
            >
              <LogOut className={` ${textShadow}  text-secondary w-4 h-4 transition-transform group-hover:-translate-x-1`} />
              <span>Salir</span>
            </button>
          ) : (
            <Link
              href="/auth/login"
              className={`hidden sm:flex group items-center justify-center gap-2.5
                px-5 py-2.5
                rounded-full
                bg-secondary/10 
                border border-secondary/25
                text-secondary font-bold text-sm tracking-wide
                transition-all duration-300 ease-out
                hover:bg-primary/10 hover:text-background hover:shadow-lg hover:shadow-black/10 hover:-translate-y-0.5
                active:scale-95
                ${textShadow}
                `}
            >
              Acceso Profesional
            </Link>
          )}

          <ThemeToggle />

          <button
            onClick={() => setShowMenu(!showMenu)}
            className="md:hidden p-2 text-background hover:bg-secondary/20 rounded-xl transition-colors"
            aria-label="Menú"
          >
            {showMenu ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {
        showMenu && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-background shadow-2xl animate-in slide-in-from-top-5 duration-200 z-40 rounded-b-3xl border-t border-slate-100 overflow-hidden">
            <div className="p-5 space-y-4">
              {session && (
                <div className="p-4 bg-background rounded-2xl flex items-center gap-4 border border-foreground/20">
                  <div className="bg-background p-2.5 rounded-full text-foreground shadow-md shadow-red-200">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-foreground">{session.user?.name}</p>
                    <p className="text-xs text-foreground font-bold uppercase tracking-wider">
                      {(session.user as any)?.role || 'Usuario'}
                    </p>
                  </div>
                </div>
              )}

              <nav className="flex flex-col gap-1">
                <Link href="/" onClick={() => setShowMenu(false)} className={mobileLinkStyle}>
                  Inicio
                </Link>
                <Link href="/about" onClick={() => setShowMenu(false)} className={mobileLinkStyle}>
                  Sobre Nosotros
                </Link>
                <Link href="/contact" onClick={() => setShowMenu(false)} className={mobileLinkStyle}>
                  Contacto
                </Link>
                {(session?.user as any)?.role === 'doctor' && (
                  <Link href="/doctor" onClick={() => setShowMenu(false)} className={mobileLinkStyle}>
                    Panel Médico
                  </Link>
                )}

                {session ? (
                  <button
                    onClick={() => signOut({ callbackUrl: '/auth/login' })}
                    className="w-full mt-4 flex items-center justify-center gap-2 bg-card text-foreground py-4 rounded-xl font-bold shadow-lg shadow-red-200 active:scale-95 transition-transform"
                  >
                    <LogOut className="w-5 h-5" />
                    Cerrar Sesión
                  </button>
                ) : (
                  <Link href="/auth/login" onClick={() => setShowMenu(false)} className="mt-4 block w-full text-center bg-background text-foreground py-4 rounded-xl font-bold shadow-lg">
                    Iniciar Sesión
                  </Link>
                )}
                <div className="flex justify-center mt-4">
                  <ThemeToggle />
                </div>
              </nav>
            </div>
          </div>
        )
      }
    </header >
  );
}