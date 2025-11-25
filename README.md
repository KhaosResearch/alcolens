<<<<<<< HEAD
## 🚀 Roadmap de Desarrollo & Nuevas Funcionalidades (Rama Dev)

A continuación se detallan las implementaciones técnicas planificadas para mejorar la seguridad, la experiencia del paciente y la integración clínica de la App AUDIT-C.

### 1. 🔐 Seguridad y Control de Acceso
El objetivo es blindar el sistema contra spam y asegurar que solo pacientes citados y médicos autorizados accedan.

- [ ] **Autenticación de Personal (SSO):**
  - Implementación de *Single Sign-On* para evitar la creación de nuevas credenciales.
  - El médico se loguea con credenciales corporativas del hospital.
  - *Restricción:* Solo usuarios autenticados pueden activar el envío de SMS.
- [ ] **Acceso Híbrido (QR en Sala de Espera):**
  - Despliegue de QR genérico en cartelería ("Evalúe su salud hepática").
  - **Lógica de Validación:** `QR Scan` -> `Input (NHC/DNI + Fecha Nac.)` -> `Validación API (Cita activa hoy)` -> `Acceso Test`.
  - *Beneficio:* Optimización de tiempos (paciente entra con test realizado).
- [ ] **Seguridad de Enlaces (OTP):**
  - Los enlaces vía SMS deben contener un *One-Time Token*.
  - Configurar caducidad (ej. 24h o tras finalizar el test) para bloquear accesos futuros al historial.

### 2. 🧠 Adaptabilidad del Contenido (UX Dinámica)
Uso de la variable "Nivel de Estudios" para mejorar la alfabetización en salud y la comprensión del feedback.

- [ ] **Motor de Lenguaje Adaptativo:**
  - **Nivel Bajo/Primarios:** Priorizar iconografía, vídeos cortos y lenguaje claro (evitar porcentajes complejos).
  - **Nivel Universitario:** Mostrar información técnica basada en evidencia (fisiopatología del daño hepático por alcohol).
- [ ] **Accesibilidad (A11y):**
  - Integración de API *Text-to-Speech* (botón "Leer preguntas") para pacientes con dificultades visuales o de lectura.

### 3. 💡 Mejoras en la Intervención Breve (Feedback)
Estrategias de gamificación y psicología conductual para motivar el "Consumo Cero".

- [ ] **Visualización de Impacto ("Body Map"):**
  - Renderizado de silueta humana interactiva.
  - En resultados de riesgo (Rojo/Ámbar), resaltar órganos afectados (Hígado, Cerebro, Corazón) para tangibilizar el daño.
- [ ] **Calculadora de Ahorro Económico:**
  - Nuevo input condicional: "¿Gasto semanal aproximado?".
  - *Output:* Proyección de ahorro anual si se reduce el consumo a 0.
- [ ] **Contrato de Salud Digital:**
  - Pantalla de cierre con compromiso simbólico ("Me comprometo a cuidar mi hígado...").
  - Captura de firma digital o checkbox de compromiso solemne.

### 4. 🏥 Integración y Flujo Clínico (Backend)
Evitar que la app sea un silo de información desconectado.

- [ ] **Interoperabilidad (HL7 / FHIR):**
  - Desarrollo de conectores para inyección automática de resultados en la HCE (Historia Clínica Electrónica).
  - Destino: Notas evolutivas o sección de antecedentes.
- [ ] **Dashboard del Facultativo:**
  - Vista de "Pacientes del Día".
  - Indicadores de estado en tiempo real (Semáforo de riesgo) junto al paciente que ya completó el test vía SMS o QR.

### 5. 🛡️ Privacidad y Gestión de Datos (GDPR/LOPD)
- [ ] **Anonimización para Investigación:**
  - Lógica de separación de datos (Data Dissociation).
  - Si `Consentimiento == True`: Generar Hash anónimo vinculando Score/Edad/Sexo y separándolo de PII (Teléfono/NHC) para exportación científica segura.

---
=======
# 🔐 Feature Branch: Authentication & Access Control (`feature/login`)

Esta rama implementa la capa de seguridad y autenticación de la aplicación AUDIT-C. Gestiona el control de acceso tanto para el personal sanitario (Web Dashboard) como para los pacientes (Acceso a Encuesta).

## 🎯 Objetivos de la Rama
1. **Proteger el Dashboard Médico:** Implementar autenticación robusta para facultativos.
2. **Validación de Pacientes:** Asegurar que solo los pacientes con cita o enlace válido accedan al test.
3. **Gestión de Sesiones:** Manejo seguro de JWT (JSON Web Tokens) y expiración de sesiones.

---

## 🛠️ Especificaciones Técnicas

### 1. Autenticación de Personal Sanitario (Médicos)
Se ha implementado un sistema preparado para **SSO (Single Sign-On)**, simulando la conexión con el directorio activo del hospital.

* **Protocolo:** OAuth2 / OIDC (Simulado para Dev).
* **Flujo:**
    1. Usuario accede a `/admin/login`.
    2. Introduce credenciales corporativas.
    3. Backend valida contra servicio de identidad.
    4. Se genera **JWT (Access Token)** con rol `ROLE_DOCTOR`.
    5. Redirección al Dashboard.

### 2. Autenticación de Pacientes (Dual)
Los pacientes no tienen "cuentas", tienen **sesiones temporales** basadas en dos métodos de entrada:

#### A. Vía SMS (Token de un solo uso)
* **Endpoint:** `/auth/validate-token?t={uuid}`
* **Lógica:** El enlace contiene un UUID único vinculado a un `patient_id` y una fecha de caducidad (24h).
* **Seguridad:** Una vez completado el test, el token se marca como `consumed` en la BBDD y no puede reutilizarse.

#### B. Vía QR (Sala de Espera)
* **Endpoint:** `/auth/verify-appointment`
* **Input:** NHC (Historia Clínica) + Fecha Nacimiento.
* **Lógica:**
    1. Se verifica si existe una cita activa para HOY (`appointment_date == today`).
    2. Si es válido, se genera una sesión temporal (`ROLE_PATIENT`) que expira en 30 min.

---

## 🛡️ Seguridad Implementada

* **Middleware de Protección:**
    * `verifyAdmin`: Requerido para rutas `/api/dashboard/*`.
    * `verifyPatient`: Requerido para rutas `/api/audit/*`.
* **Manejo de JWT:**
    * Los tokens se almacenan en Cookies `HttpOnly` para prevenir ataques XSS.
    * Tiempo de vida del token médico: 8 horas (turno laboral).
* **Rate Limiting:** Se ha añadido limitación de intentos en el login y validación de NHC para evitar fuerza bruta.

---

## ⚙️ Configuración de Entorno (.env)

Para probar esta rama, asegúrate de tener las siguientes variables en tu `.env` local:

```bash
# Autenticación
JWT_SECRET=tu_secreto_super_seguro_dev
JWT_EXPIRATION_MD=28800 # 8 horas en segundos
JWT_EXPIRATION_PT=1800  # 30 min en segundos

# Simulación SSO (Mock)
MOCK_SSO_ENABLED=true
TEST_DOCTOR_USER=admin
TEST_DOCTOR_PASS=hospital123
>>>>>>> feature/login
