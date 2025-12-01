# 🔐 Guía de Autenticación con NextAuth.js

## 📋 Instalación de Dependencias

```bash
npm install next-auth bcryptjs
```

## 🔧 Configuración

### 1. Variables de Entorno (`.env.local`)

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/alcolens

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production
```

**Generar una clave segura para NEXTAUTH_SECRET:**

```bash
openssl rand -base64 32
```

### 2. Estructura de Archivos Creada

```
app/
├── api/
│   └── auth/
│       ├── [...nextauth]/
│       │   └── route.ts          # Manejo de rutas de NextAuth
│       ├── login/
│       ├── logout/
│       └── register/
│           └── route.ts           # API de registro
├── lib/
│   ├── auth.config.ts            # Configuración de NextAuth
│   ├── db.ts                      # Conexión a MongoDB
│   ├── models/
│   │   └── User.ts               # Modelo de Usuario
│   └── providers.tsx             # SessionProvider
├── login/
│   └── page.tsx                  # Página de login
├── register/
│   └── page.tsx                  # Página de registro
├── doctor/
│   ├── dashboard/
│   │   └── page.tsx
│   └── layout.tsx
├── patient/
│   ├── audit/
│   │   └── page.tsx
│   ├── check_in/
│   │   └── page.tsx
│   └── layout.tsx
├── layout.tsx                    # Layout con AuthProvider
├── middleware.ts                 # Protección de rutas
└── page.tsx                      # Dashboard Home
```

## 🚀 Cómo Funciona

### Flujo de Autenticación

1. **Registro** (`/register`)
   - Usuario se registra como Doctor o Patient
   - Contraseña se encripta con bcryptjs
   - Datos se guardan en MongoDB

2. **Login** (`/login`)
   - Usuario ingresa email y contraseña
   - NextAuth valida las credenciales
   - Se genera un JWT token
   - Sesión se guarda en cliente

3. **Sesión**
   - NextAuth mantiene la sesión en el cliente
   - Middleware protege rutas según autenticación y rol

4. **Logout**
   - Usuario hace clic en "Sign Out"
   - Sesión se elimina
   - Redirige a `/login`

### Protección de Rutas

El middleware (`middleware.ts`) protege:

- **Rutas públicas**: `/login`, `/register`
- **Rutas privadas**: Todo excepto públicas requiere autenticación
- **Rutas por rol**: 
  - `/doctor/*` solo para usuarios con rol "doctor"
  - `/patient/*` solo para usuarios con rol "patient"

## 📱 Uso en Componentes

### Acceder a la Sesión (Client Component)

```typescript
'use client';

import { useSession, signOut } from 'next-auth/react';

export default function Component() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <p>Loading...</p>;
  if (!session) return <p>Not authenticated</p>;

  return (
    <div>
      <p>Welcome, {session.user?.name}!</p>
      <p>Email: {session.user?.email}</p>
      <p>Role: {(session.user as any)?.role}</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
```

### Verificar Rol de Usuario

```typescript
const userRole = (session.user as any)?.role;

if (userRole === 'doctor') {
  // Mostrar contenido para doctores
} else if (userRole === 'patient') {
  // Mostrar contenido para pacientes
}
```

### Acceder a la Sesión (Server Component)

```typescript
import { auth } from '@/app/lib/auth.config';

export default async function ServerComponent() {
  const session = await auth();
  
  if (!session?.user) return <p>Not authenticated</p>;
  
  return <p>Welcome, {session.user.name}!</p>;
}
```

## 🧪 Pruebas

### Test de Registro

1. Ir a `http://localhost:3000/register`
2. Crear cuenta como Patient
3. Verificar en MongoDB que el usuario se guardó

### Test de Login

1. Ir a `http://localhost:3000/login`
2. Ingresar credenciales de usuario registrado
3. Debería redirigir a `/`

### Test de Protección de Rutas

1. Intentar acceder a `/doctor/dashboard` como patient
2. Debería redirigir a `/`

## 🔒 Seguridad

### Consideraciones Importantes

1. **NEXTAUTH_SECRET**: Cambiar en producción (generar con `openssl rand -base64 32`)
2. **NEXTAUTH_URL**: Cambiar a dominio real en producción
3. **MongoDB**: Usar conexión segura (MongoDB Atlas con contraseña)
4. **HTTPS**: Requerido en producción
5. **CSRF Protection**: NextAuth.js lo maneja automáticamente

## 📚 Recursos

- [NextAuth.js Docs](https://next-auth.js.org/)
- [Mongoose Docs](https://mongoosejs.com/)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)

## ⚠️ Troubleshooting

### Error: "Cannot find module 'next-auth'"
```bash
npm install next-auth
```

### Error: "MONGODB_URI is not defined"
Verificar que `.env.local` tiene la variable correcta

### Error: "NEXTAUTH_SECRET is not defined"
```bash
# Generar
openssl rand -base64 32
# Copiar a .env.local
```

## 🎯 Próximos Pasos

1. ✅ Autenticación básica (HECHO)
2. ⏭️ Protección de APIs con roles
3. ⏭️ Recuperación de contraseña
4. ⏭️ Autenticación de 2 factores
5. ⏭️ OAuth con proveedores (Google, GitHub)
