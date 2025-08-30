// .docs/002_OBSERVABILITY_LOGGING_TELEMETRY_MANIFEST.md
/**
 * @file .docs/002_OBSERVABILITY_LOGGING_TELEMETRY_MANIFEST.md
 * @description Manifiesto Canónico de Observabilidad v1.0.
 *              Esta es la Única Fuente de Verdad (SSoT) definitiva que define la
 *              estrategia holística de la plataforma para el logging, el monitoreo
 *              de errores, la auditoría y la recolección de telemetría.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Canónico de Observabilidad v1.0

## 1. Filosofía: "Visibilidad Total, Cero Puntos Ciegos"

Nuestra arquitectura de observabilidad se basa en el principio de que **todo evento significativo debe ser registrado**. El objetivo es tener una trazabilidad completa del ciclo de vida de cada petición y cada acción del usuario, desde su visita anónima hasta sus interacciones autenticadas. Esto es fundamental para la depuración proactiva, la auditoría de seguridad y la toma de decisiones de negocio basadas en datos.

## 2. Pilares de la Arquitectura de Observabilidad

### Pilar 2.1: Logging de Aplicación (El Pulso del Sistema)

*   **SSoT Técnica:** `src/lib/logging.ts`
*   **Funcionalidad:** Proporciona dos loggers desacoplados:
    *   `logger` (Servidor): Un wrapper de `pino` que en producción envía eventos a **Sentry**. En desarrollo, imprime logs formateados en la consola.
    *   `clientLogger` (Cliente): Un wrapper ligero de `console` para el entorno del navegador, asegurando que no se empaqueten dependencias de servidor en el cliente.
*   **Estándar de Implementación:**
    *   `logger.trace()`: Para logs de alta granularidad y bajo nivel (ej. "Renderizando componente X").
    *   `logger.info()`: Para eventos de negocio significativos (ej. "Usuario creado", "Campaña publicada").
    *   `logger.warn()`: Para condiciones anómalas pero no críticas (ej. "Subdominio no encontrado en caché").
    *   `logger.error()`: Para errores capturados que impiden el flujo normal de la aplicación.

### Pilar 2.2: Telemetría de Visitantes (El Radar del Usuario)

*   **SSoT Técnica:** `src/middleware/handlers/telemetry/index.ts`, `src/lib/actions/telemetry.actions.ts`, `src/components/telemetry/TelemetryClientLogger.tsx`.
*   **Funcionalidad:**
    1.  **Captura Inicial (Middleware):** En la primera visita, el `Telemetry Handler` crea un `session_id` (UUID), lo guarda en una cookie `httpOnly`, y registra un evento inicial en `visitor_logs` con datos del servidor (IP, User-Agent, GeoIP).
    2.  **Enriquecimiento (Cliente):** El componente `TelemetryClientLogger` (inyectado en el layout) se ejecuta de forma diferida en el cliente, genera una huella digital única (`fingerprint.js`) y envía estos datos a la `enrichVisitorLogAction` para enriquecer el registro existente.
    3.  **Asociación de Usuario:** Al iniciar sesión, la `associateUserWithSession` (futura acción) vinculará el `user_id` con el `session_id`.
*   **Propósito:** Construir un perfil completo del recorrido del usuario, desde visitante anónimo hasta cliente.

### Pilar 2.3: Auditoría de Acciones (El Registro Inmutable)

*   **SSoT Técnica:** Tabla `audit_logs` y el helper `createAuditLog`.
*   **Funcionalidad:** Todas las `Server Action` que realizan una mutación de datos significativa (crear, actualizar, eliminar, cambiar permisos) **DEBEN** invocar al helper `createAuditLog`. Este registra quién (`actor_id`), qué (`action`), sobre qué (`target_entity_id`), cuándo (`created_at`) y desde dónde (`ip_address`).
*   **Propósito:** Seguridad y cumplimiento. Proporciona un registro inmutable para auditorías de seguridad y análisis forense.

### Pilar 2.4: Monitoreo de Errores (El Sistema de Alerta Temprana)

*   **SSoT Técnica:** Integración con **Sentry** y el helper `createPersistentErrorLog`.
*   **Funcionalidad:**
    1.  **Errores No Capturados:** Sentry captura automáticamente los errores no manejados en el cliente y el servidor.
    2.  **Errores Capturados:** En cada bloque `catch` de las `Server Actions` y hooks, se invoca al helper `createPersistentErrorLog`. Este helper realiza dos acciones:
        *   Envía el error a Sentry con contexto enriquecido.
        *   Guarda una copia del error en la tabla `system_errors` de nuestra base de datos.
*   **Propósito:** Detección proactiva de problemas, depuración acelerada con stack traces y contexto, y un registro interno persistente de todos los fallos críticos de la aplicación.

---
/**
 * @file .docs/002_OBSERVABILITY_LOGGING_TELEMETRY_MANIFEST.md
 * @description Manifiesto Canónico de Observabilidad v1.0.
 *              Esta es la Única Fuente de Verdad (SSoT) definitiva que define la
 *              estrategia holística de la plataforma para el logging, el monitoreo
 *              de errores, la auditoría y la recolección de telemetría.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Canónico de Observabilidad v1.0

## 1. Filosofía: "Visibilidad Total, Cero Puntos Ciegos"

Nuestra arquitectura de observabilidad se basa en el principio de que **todo evento significativo debe ser registrado**. El objetivo es tener una trazabilidad completa del ciclo de vida de cada petición y cada acción del usuario. Esto es fundamental para la depuración proactiva, la auditoría de seguridad y la toma de decisiones de negocio basadas en datos.

## 2. Pilares de la Arquitectura de Observabilidad

### Pilar 2.1: Logging de Aplicación (El Pulso del Sistema)

*   **SSoT Técnica:** `src/lib/logging.ts`
*   **Funcionalidad:** Proporciona dos loggers desacoplados:
    *   `logger` (Servidor): Un wrapper de `pino` que en producción envía eventos a **Sentry**. En desarrollo, imprime logs formateados en la consola.
    *   `clientLogger` (Cliente): Un wrapper ligero de `console` para el entorno del navegador, asegurando que no se empaqueten dependencias de servidor en el cliente.
*   **Estándar de Implementación:**
    *   `logger.trace()`: Para logs de alta granularidad y bajo nivel (ej. "Renderizando componente X").
    *   `logger.info()`: Para eventos de negocio significativos (ej. "Usuario creado", "Campaña publicada").
    *   `logger.warn()`: Para condiciones anómalas pero no críticas (ej. "Subdominio no encontrado en caché").
    *   `logger.error()`: Para errores capturados que impiden el flujo normal de la aplicación.

### Pilar 2.2: Telemetría de Visitantes (El Radar del Usuario)

*   **SSoT Técnica:** `src/middleware/handlers/telemetry/index.ts`, `src/lib/actions/telemetry.actions.ts`, `src/components/telemetry/TelemetryClientLogger.tsx`.
*   **Funcionalidad:**
    1.  **Captura Inicial (Middleware):** En la primera visita de una sesión, el `Telemetry Handler` crea un `session_id` (UUID), lo guarda en una cookie `httpOnly` (`metashark_session_id`), y registra un evento inicial en `visitor_logs` con datos del servidor (IP, User-Agent, GeoIP).
    2.  **Enriquecimiento (Cliente):** El componente `TelemetryClientLogger.tsx` se ejecuta de forma diferida, genera una huella digital única (`fingerprint.js`) y envía estos datos a la `enrichVisitorLogAction` para enriquecer el registro existente.
    3.  **Asociación de Usuario:** Al iniciar sesión, una `Server Action` vinculará el `user_id` con el `session_id` en `visitor_logs`.
*   **Propósito:** Construir un perfil completo del recorrido del usuario, desde visitante anónimo hasta cliente.

### Pilar 2.3: Auditoría de Acciones (El Registro Inmutable)

*   **SSoT Técnica:** Tabla `audit_logs` y el helper `createAuditLog`.
*   **Funcionalidad:** Todas las `Server Action` que realizan una mutación de datos significativa (crear, actualizar, eliminar, cambiar permisos) **DEBEN** invocar al helper `createAuditLog`. Este registra quién (`actor_id`), qué (`action`), sobre qué (`target_entity_id`), cuándo (`created_at`) y desde dónde (`ip_address`).
*   **Propósito:** Seguridad y cumplimiento. Proporciona un registro inmutable para auditorías de seguridad y análisis forense.

### Pilar 2.4: Monitoreo de Errores (El Sistema de Alerta Temprana)

*   **SSoT Técnica:** Integración con **Sentry** y el helper `createPersistentErrorLog`.
*   **Funcionalidad:**
    1.  **Errores No Capturados:** Sentry captura automáticamente los errores no manejados en el cliente y el servidor.
    2.  **Errores Capturados:** En cada bloque `catch` de las `Server Actions` y hooks, se invoca al helper `createPersistentErrorLog`. Este helper realiza dos acciones:
        *   Envía el error a Sentry con contexto enriquecido.
        *   Guarda una copia del error en la tabla `system_errors` de nuestra base de datos.
*   **Propósito:** Detección proactiva de problemas, depuración acelerada con stack traces y contexto, y un registro interno persistente de todos los fallos críticos de la aplicación.

// .docs/002_OBSERVABILITY_LOGGING_TELEMETRY_MANIFEST.md