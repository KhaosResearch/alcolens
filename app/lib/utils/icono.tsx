import React from "react";

export default function LogoIcon({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 1. La Burbuja Blanca */}
      <path
        d="M50 5 C25.147 5 5 22.9 5 45 C5 59.5 14.5 72.1 29 79 L20 95 L40 84 C43.2 84.6 46.6 85 50 85 C74.853 85 95 67.1 95 45 C95 22.9 74.853 5 50 5Z"
        fill="var(--secondary)"
      />

      {/* 2. La Letra A (Color Rojo Corporativo) */}
      {/* Usamos un texto SVG para que sea perfecto */}
      <text
        x="50%"
        y="55%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill= "var(--primary)"// El rojo de tu marca
        fontSize="60"
        fontFamily="Arial, sans-serif"
        fontWeight="900"
        fontStyle="italic"
        dy=".1em" // Pequeño ajuste vertical
      >
        A
      </text>
    </svg>
  );
}