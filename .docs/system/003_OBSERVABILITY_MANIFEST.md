// .docs/system/003_OBSERVABILITY_MANIFEST.md
/**
 * @file .docs/system/003_OBSERVABILITY_MANIFEST.md
 * @description Manifiesto Canónico de Observabilidad v2.0.
 *              Esta es la SSoT Maestra que define la estrategia holística y
 *              de extremo a extremo para el logging, monitoreo de errores,
 *              auditoría y telemetría en los entornos de SERVIDOR y CLIENTE.
 *              Establece el Estándar de Élite para todas las refactorizaciones.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 2.0.0
 */
# Manifiesto Canónico de Observabilidad v2.0

## 1. Filosofía y Visión

*   **Filosofía:** "Visibilidad Total, Cero Puntos Ciegos".
*   **Propósito:** Implementar una arquitectura de observabilidad soberana y desacoplada que capture cada evento significativo, desde una interacción de UI en el navegador hasta una transacción en la base de datos. El objetivo es permitir el diagnóstico proactivo, la optimización basada en datos y una comprensión completa del ciclo de vida del usuario.

---

## 2. Arquitectura de Observabilidad de Servidor (Backend)

La estrategia del servidor se basa en la emisión de logs estructurados que son recolectados y procesados por la infraestructura.

### Pilar 1.1: Logging Estructurado (El Pulso del Sistema)

*   **SSoT Técnica:** `src/lib/logging.ts` (aparato `logger`).
*   **Tecnología:** `pino` para logging de alto rendimiento.
*   **Flujo de Ejecución (Log Shipping):**
    1.  **Emisión:** `logger` formatea eventos como JSON y los emite a `stdout`.
    2.  **Colección y Agregación:** Vercel Log Drains reenvían el stream de `stdout` a nuestra plataforma de observabilidad externa (Datadog, Sentry, etc.). **La aplicación NO gestiona la persistencia de sus propios logs.**

### Pilar 1.2: El Banco de Errores Soberano

*   **SSoT Técnica:** La tabla `public.system_errors` y el helper `createPersistentErrorLog`.
*   **Propósito:** Actuar como nuestra **base de datos interna e inmutable de fallos críticos**. Es un registro de "caja negra" que garantiza la persistencia de errores independientemente de servicios externos.
*   **Regla Mandatoria:** Cada bloque `catch` de alto nivel en las Server Actions **DEBE** invocar `createPersistentErrorLog`.

### Pilar 1.3: Auditoría de Acciones (El Registro Inmutable)

*   **SSoT Técnica:** La tabla `public.audit_logs` y el helper `createAuditLog`.
*   **Regla Mandatoria:** Toda Server Action que ejecute una mutación de datos significativa **DEBE** registrar un evento de auditoría.

---

## 3. Arquitectura de Observabilidad de Cliente (Frontend)

La estrategia del cliente se basa en la recolección de eventos en el navegador y su envío asíncrono al backend para su persistencia y análisis.

### Pilar 2.1: El Logger de Cliente (`clientLogger`)

*   **SSoT Técnica:** `src/lib/logging.ts` (aparato `clientLogger`).
*   **¿Qué es un "Wrapper"?** Es una abstracción. En lugar de que cada componente llame a `console.info()`, llaman a `clientLogger.info()`. Esto nos da un **punto de control centralizado**.
*   **Propósito Actual:** Durante el desarrollo, añade un prefijo `[INFO]` a los mensajes en la consola del navegador para una mejor legibilidad.
*   **Propósito Futuro (Evolución):** Si necesitamos enviar logs de cliente al servidor, solo modificaremos el `clientLogger` para que, además de imprimir en la consola, envíe los logs a un endpoint de API. **Ningún otro componente necesitará ser cambiado**.

### Pilar 2.2: Telemetría de Comportamiento (El Radar del Usuario)

Este es el sistema para registrar la **actividad del usuario**.

*   **SSoT Técnica:** La tabla `public.visitor_logs` y el ecosistema de telemetría.
*   **Flujo de Ejecución:**
    1.  **Captura Inicial (Middleware):** En la primera visita, el `Telemetry Handler` crea un `session_id`, captura datos del servidor (IP, GeoIP) e invoca `logVisitorAction` para crear un registro inicial en `visitor_logs`.
    2.  **Enriquecimiento (Cliente):** El componente `TelemetryClientLogger` se ejecuta de forma diferida en el navegador. Genera una huella digital (`fingerprint`) y captura datos del cliente (resolución de pantalla). Luego, invoca `enrichVisitorLogAction` para **actualizar** el registro existente en `visitor_logs` con esta nueva información.
*   **Resultado:** Un registro único por sesión en `visitor_logs` que contiene una visión 360° del entorno del usuario (servidor + cliente).

### Pilar 2.3: Captura de Errores Graves del Cliente

Este es el sistema para registrar **errores de JavaScript en el navegador**.

*   **SSoT Técnica:** El `ErrorBoundary` global (`src/app/global-error.tsx`) y la integración con Sentry Client (`sentry.client.config.ts`).
*   **Flujo de Ejecución:**
    1.  **Captura Automática:** El SDK de Sentry captura automáticamente errores no manejados en el cliente.
    2.  **Captura de Renderizado:** El `global-error.tsx` actúa como una red de seguridad final. Si un error de renderizado ocurre, este componente lo captura y lo envía a Sentry.
*   **¿Cómo se guardan?** Actualmente, se delega a Sentry. Sin embargo, para nuestra solución soberana, implementaremos la siguiente mejora:
    *   **Mejora Futura Mandatoria:** El `global-error.tsx` y cualquier `ErrorBoundary` local **DEBERÁN** invocar una nueva Server Action `logClientErrorAction(error, context)`. Esta acción recibirá el objeto de error serializado y lo persistirá en nuestra tabla `system_errors`, marcando `source` como `"client-runtime"`. Esto crea paridad con nuestro "Banco de Errores" del servidor.

---

## 4. Estándar de Logging de Élite (Directiva Mandatoria de Refactorización)

*   **`logger.trace({ ...contexto }, mensaje)`:** Rastrear el flujo de control.
*   **`logger.info({ ...contexto }, mensaje)`:** Registrar eventos de negocio exitosos.
*   **`logger.warn({ ...contexto }, mensaje)`:** Registrar anomalías manejadas.
*   **`logger.error({ err, ...contexto }, mensaje)`:** Registrar fallos críticos (el `err` es mandatorio).
*   **`clientLogger`:** Utilizar libremente para depuración en el navegador. Toda interacción de usuario clave (clics en botones, cambios de estado importantes) **DEBE** tener al menos un `clientLogger.trace` o `clientLogger.info`.
