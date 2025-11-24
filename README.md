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