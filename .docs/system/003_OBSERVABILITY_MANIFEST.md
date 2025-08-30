// .docs/system/003_OBSERVABILITY_MANIFEST.md
/**
 * @file .docs/system/003_OBSERVABILITY_MANIFEST.md
 * @description Manifiesto Canónico de Observabilidad v1.0.
 *              Esta es la SSoT que define la estrategia holística de la plataforma
 *              para el logging, monitoreo de errores, auditoría y telemetría.
 *              Expande el Pilar 4 de la Constitución Arquitectónica y reemplaza a
 *              `.docs/002_OBSERVABILITY_LOGGING_TELEMETRY_MANIFEST.md`.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Canónico de Observabilidad v1.0

## 1. Filosofía: "Visibilidad Total, Cero Puntos Ciegos"
*   **Referencia a la Constitución:** AD-004, AD-005.
*   Nuestra arquitectura de observabilidad se basa en el principio de que **todo evento significativo debe ser registrado**. El objetivo es tener una trazabilidad completa del ciclo de vida de cada petición y cada acción del usuario.

## 2. Pilares de la Arquitectura de Observabilidad

### 2.1. Logging de Aplicación (El Pulso del Sistema)
*   **SSoT Técnica:** `src/lib/logging.ts`
*   **Funcionalidad:** Proporciona dos loggers desacoplados:
    *   `logger` (Servidor): Un wrapper de `pino` que en producción envía eventos a **Sentry**.
    *   `clientLogger` (Cliente): Un wrapper ligero de `console` para el navegador.
*   **Propósito:** Registrar el flujo de ejecución y los estados internos de la aplicación para depuración y monitoreo en tiempo real.

### 2.2. Telemetría de Visitantes (El Radar del Usuario)
*   **SSoT Técnica:** `src/middleware/handlers/telemetry/index.ts`, `src/lib/actions/telemetry.actions.ts`, `src/components/telemetry/TelemetryClientLogger.tsx`.
*   **Funcionalidad:**
    1.  **Captura Inicial (Middleware):** El `Telemetry Handler` crea un `session_id` y registra un evento inicial en `visitor_logs` con datos del servidor (IP, GeoIP).
    2.  **Enriquecimiento (Cliente):** El `TelemetryClientLogger` se ejecuta de forma diferida, genera una huella digital y la envía a la `enrichVisitorLogAction`.
*   **Propósito:** Construir un perfil completo del recorrido del usuario, desde visitante anónimo hasta cliente, para análisis de comportamiento y optimización.

### 2.3. Auditoría de Acciones (El Registro Inmutable)
*   **SSoT Técnica:** Tabla `audit_logs` y el helper `createAuditLog`.
*   **Funcionalidad:** Todas las `Server Action` que realizan una mutación de datos significativa **DEBEN** invocar al helper `createAuditLog`. Este registra quién, qué, sobre qué, cuándo y desde dónde.
*   **Propósito:** Seguridad y cumplimiento. Proporciona un registro inmutable para auditorías de seguridad y análisis forense.

### 2.4. Monitoreo de Errores (El Sistema de Alerta Temprana)
*   **SSoT Técnica:** Integración con **Sentry** y el helper `createPersistentErrorLog`.
*   **Funcionalidad:**
    1.  **Errores No Capturados:** Sentry los captura automáticamente.
    2.  **Errores Capturados:** En cada bloque `catch`, se invoca `createPersistentErrorLog`, que envía el error a Sentry y lo guarda en la tabla `system_errors`.
*   **Propósito:** Detección proactiva de problemas, depuración acelerada con contexto y un registro interno persistente de todos los fallos críticos.
// .docs/system/003_OBSERVABILITY_MANIFEST.md