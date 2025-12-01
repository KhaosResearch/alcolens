# 🏥 AlcoLens Pro - Plataforma de Evaluación de Salud Hepática

Sistema inteligente de cribado y monitorización de riesgo hepático mediante el test AUDIT-C. > Una solución "Mobile First" diseñada para conectar médicos y pacientes de forma segura, rápida y anónima.

## 📋 Descripción del Proyecto

AlcoLens Pro es una aplicación web progresiva (PWA) desarrollada para facilitar la detección temprana de problemas relacionados con el consumo de alcohol. La plataforma permite a los profesionales sanitarios invitar a pacientes a realizar autoevaluaciones digitales, obteniendo resultados en tiempo real y estratificando el riesgo automáticamente.

## Objetivos Clave

- Digitalización del Cribado: Sustituir el papel por un flujo digital seguro.

- Accesibilidad Universal: Interfaz adaptativa que ajusta el lenguaje según el nivel educativo del paciente.

- Privacidad por Diseño: Recogida de datos anonimizada con identificadores hash.

- Eficiencia Clínica: Dashboard para médicos con KPIs epidemiológicos en tiempo real.

## 🚀 Funcionalidades Principales

### 👨‍⚕️ Para el Profesional Sanitario (Zona Privada)

- Panel de Control (Dashboard): Visualización de estadísticas en tiempo real (Pacientes evaluados, alertas de alto riesgo, distribución epidemiológica).

- Gestión de Invitaciones: Generación de enlaces únicos y seguros (tokens) para enviar por SMS o WhatsApp sin coste (Deep Linking).

- Seguridad: Autenticación robusta con roles y protección de rutas mediante Middleware.

- Visualización de Datos: Tablas filtrables por nivel de riesgo y gráficos de distribución.

### 👤 Para el Paciente (Zona Pública)

- Acceso Simplificado: Entrada vía enlace directo (Invitación) o Código QR (Sala de espera).

- UX Adaptativa: El test cambia la redacción de las preguntas según el nivel de estudios seleccionado (Primaria / Secundaria / Universidad) para asegurar la comprensión.

- Feedback Inmediato: Sistema de semáforo (Verde/Ámbar/Rojo) con recomendaciones personalizadas al finalizar.

- Consentimiento Granular: Control explícito sobre el almacenamiento de datos para investigación.

## 🛠️ Stack Tecnológico

- El proyecto utiliza una arquitectura moderna basada en Next.js App Router:

- Core: Next.js 14+ (React Server Components).

Estilos: Tailwind CSS v4 (Motor Oxide, Variables CSS nativas oklch).

- Base de Datos: MongoDB + Mongoose (Esquemas tipados).

- Autenticación: NextAuth.js (Credenciales, JWT, Middleware edge-compatible).

## UI/UX:

- Iconos: lucide-react.

- Animaciones: framer-motion (Micro-interacciones líquidas).

- Componentes: Radix UI / Shadcn (Dialogs accesibles).

- Fuentes: next/font (Google Fonts: Montserrat + Fuentes Locales).

## 📂 Estructura del Proyecto

La arquitectura sigue el patrón de separación de responsabilidades de Next.js App Router:

``` 
src/
├── app/
│   ├── api/                 # Endpoints Backend (Next.js API Routes)
│   │   ├── auth/            # Endpoints de NextAuth
│   │   ├── doctor/          # API privada para el dashboard
│   │   └── responses/       # Recepción de tests de pacientes
│   ├── auth/                # Páginas Públicas de Autenticación
│   │   ├── login/           # Login estilo "Enterprise"
│   │   └── register/        # Registro de facultativos
│   ├── doctor/              # ZONA PROTEGIDA (Middleware)
│   │   └── dashboard/       # Panel de control médico
│   ├── patient/             # ZONA PÚBLICA (Test)
│   │   ├── audit/           # El cuestionario interactivo
│   │   └── page.tsx         # Landing page del paciente
│   ├── fonts.ts             # Configuración de tipografías
│   └── layout.tsx           # Layout global (Header, Footer, Contextos)
├── components/              # Componentes Reutilizables (Atomos/Moleculas)
│   ├── Header.tsx           # Barra de navegación inteligente
│   ├── MouseFollower.tsx    # Efecto visual de cursor
│   └── ui/                  # Componentes base (LiquidButton, Dialog, etc.)
├── lib/                     # Utilidades y Lógica de Negocio
│   ├── db.ts                # Conexión a MongoDB (Singleton)
│   ├── models/              # Modelos Mongoose (User, Response, Invitation)
│   └── utils/               # Helpers (Cálculo de AUDIT-C, etc.)
└── middleware.ts            # Guardián de rutas (Seguridad Edge)
```

## 🚦 Instalación y Despliegue

### Requisitos Previos

- Node.js 18+

- MongoDB (Local o Atlas)

### Pasos

- Clonar el repositorio:

``
git clone [https://github.com/tu-usuario/alcolens-pro.git](https://github.com/tu-usuario/alcolens-pro.git)
cd alcolens-pro
``

### Instalar dependencias:

``
npm install
```

### Configurar Variables de Entorno:
Crea un archivo .env en la raíz con lo siguiente:

```
# Base de Datos
MONGODB_URI="mongodb+srv://..."

# Seguridad (Generar con: openssl rand -base64 32)
NEXTAUTH_SECRET="tu_secreto_super_seguro"
NEXTAUTH_URL="http://localhost:3000"

# Configuración App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Ejecutar en Desarrollo:

```
npm run dev
```
