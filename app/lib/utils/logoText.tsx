import React from "react";

export default function LogoText({ className = "w-48" }: { className?: string }) {
  const textShadow = "[text-shadow:_0_1px_3px_rgb(0_0_0_/_40%)]";
  return (
    <svg
      viewBox="0 0 300 80" 
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <text
        x="0"
        y="45"
        fill="white"
        fontFamily="/public/fonts/Azonix.otf"
        fontWeight="900"
        fontSize="48"
        letterSpacing="-1"
        className={`${textShadow}`}
      >
        AlcoLens
      </text>

      <text
        x="2"
        y="70"
        fill="white"
        fontFamily="/public/fonts/Azonix.otf"
        fontWeight="400"
        fontSize="16"
        letterSpacing="0.5"
        className={`${textShadow}`}
      >
        CUIDA TU HÍGADO EN 2 MINUTOS
      </text>
    </svg>
  );
}