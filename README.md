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