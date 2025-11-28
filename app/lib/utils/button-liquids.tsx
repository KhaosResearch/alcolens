'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { useRouter } from 'next/navigation'; // 1. Importamos el router

// Definimos los props extendiendo los de un botón HTML normal + los de Motion
interface LiquidButtonProps extends HTMLMotionProps<"button"> {
    children: React.ReactNode;
    className?: string;
    href?: string; // 2. Nueva propiedad opcional para redirección
}

export default function LiquidButton({ children, className, href, onClick, ...props }: LiquidButtonProps) {
    const router = useRouter(); // 3. Inicializamos el router

    // 4. Función inteligente de clic
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        // Si hay un evento onClick original (pasado desde fuera), lo ejecutamos primero
        if (onClick) {
            onClick(e);
        }

        // Si le hemos pasado una ruta (href), redirigimos
        if (href) {
            router.push(href);
        }
    };

    return (
        <motion.button
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            onClick={handleClick} // 5. Conectamos nuestro handler
            className={`
        group relative overflow-hidden rounded-xl border border-primary 
        bg-white px-6 py-3 font-bold text-primary 
        /* Pequeño delay en el color del texto para que espere al líquido */
        transition-colors duration-200 ease-in-out delay-75
        hover:text-white
        ${className || ''}
      `}
            {...props}
        >
            {/* 1. EL LÍQUIDO (Fondo animado) */}
            <motion.div
                className="absolute inset-0 z-0 bg-primary"
                variants={{
                    initial: { y: "100%" }, // Escondido abajo
                    hover: { y: "0%" },     // Sube cubriendo todo
                    tap: { scale: 0.95 }    // Efecto sutil al pulsar
                }}
                // Configuración de física para que parezca líquido
                transition={{
                    type: "spring",
                    stiffness: 120, // Tensión del muelle
                    damping: 20,    // Fricción (para que no rebote eternamente)
                    mass: 0.5       // Ligereza
                }}
            />

            {/* 2. EL CONTENIDO */}
            {/* z-10 para que flote encima del líquido rojo */}
            <span className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </span>
        </motion.button>
    );
}