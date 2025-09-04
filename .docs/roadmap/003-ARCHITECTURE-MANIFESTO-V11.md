// .docs/roadmap/003-ARCHITECTURE-MANIFESTO-V11.md
/**
 * @file .docs/roadmap/003-ARCHITECTURE-MANIFESTO-V11.md
 * @description Manifiesto de Arquitectura v11.0: El Ecosistema de Datos, Estado
 *              y Observabilidad de Élite.
 *              Esta es la SSoT que define la estrategia holística para
 *              ConvertiKit, incorporando un sistema de errores codificados y
 *              una observabilidad de sesión completa.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 11.0.0
 */
# Manifiesto de Arquitectura v11.0: Ecosistema de Datos, Estado y Observabilidad de Élite

#### **[Filosofía de Diseño y Propósito]**
La misión es el **desacoplamiento radical** entre las capas y una **observabilidad total** del sistema. El propósito es cuádruple:
1.  **Reducir Costos y Carga (Lean Database):** Minimizar el espacio de almacenamiento y las consultas.
2.  **Mejorar la Resiliencia y UX (Hyper-Resilient Smart Client):** Crear una experiencia offline-first que nunca pierde el trabajo del usuario.
3.  **Blindar el Sistema (Zero-Trust Security):** Validar y autorizar cada operación en cada capa.
4.  **Maximizar la Observabilidad (Full Observability):** Implementar un sistema de logging de sesión y errores codificados que permita un diagnóstico rápido y preciso.

#### **[Arquitectura Propuesta (El Estado de Élite)]**

**Pilar 1: La Base de Datos "Lean" (Codificación y Normalización)**

*   **Lógica:** Implementar `lookup tables` para valores repetitivos (`status`, `role`).
*   **Beneficios:** Reducción de espacio, integridad de datos y rendimiento de índices.

**Pilar 2: El Cliente Inteligente e Hiper-Resiliente (Estado Soberano con Sincronización Automática)**

*   **Lógica:** Utilizar `zustand` con `persist` (localStorage) y un hook `useAutoSync` que gestiona el `debounce` y la sincronización con el servidor basada en eventos (`online`, `beforeunload`).
*   **Beneficios:** Experiencia multi-dispositivo fluida, minimización de la interacción manual y resiliencia.

**Pilar 3: Seguridad de Élite (Zero-Trust)**

*   **Lógica:** Autenticación con JWT de Supabase, validación y autorización explícita en cada `Server Action` mediante guardianes de seguridad, con RLS como última línea de defensa.
*   **Beneficios:** Arquitectura de defensa en profundidad.

**Pilar 4: Observabilidad Total y Banco de Errores (NUEVO PILAR)**

Esta es la evolución de nuestro sistema de manejo de errores.

*   **Pilar 4A: Banco de Errores Codificados y Matriz de Conversión (SSoT de Errores)**
    *   **Lógica:**
        1.  **Crear Tabla `error_codes`:** Se creará una nueva tabla en la base de datos con la estructura: `error_code (TEXT, PRIMARY KEY)`, `http_status (INTEGER)`, `message_key (TEXT)`, `description (TEXT)`.
        2.  **Poblar la Tabla:** Esta tabla se poblará con todos los posibles errores de la aplicación.
            *   Ejemplo de Fila: `('AUTH_001', 401, 'ValidationErrors.auth.login_invalid_credentials', 'Fallo de autenticación debido a email o contraseña incorrectos.')`
        3.  **Refactorizar `ActionResult`:** El tipo `ActionResult` será modificado para que en caso de error, devuelva `error_code: string` en lugar de `error: string`.
        4.  **Refactorizar Server Actions:** Todas las `Server Action`s serán refactorizadas para que, en caso de fallo, consulten el `error_code` apropiado y lo devuelvan.
    *   **Beneficios:**
        *   **Desacoplamiento Total:** El código de la aplicación ya no contiene strings de mensajes, solo códigos de error inmutables.
        *   **Mantenibilidad Centralizada:** Todos los textos de error se gestionan en un único lugar: la tabla `error_codes` y los archivos de `i18n`.
        *   **Consistencia:** El `http_status` asociado garantiza respuestas de API consistentes.

*   **Pilar 4B: Full Logging de Sesión y Usuario**
    *   **Lógica:**
        1.  **Middleware de Sesión:** El `Telemetry Handler` en el middleware ya crea un `session_id` único para cada visitante.
        2.  **Enriquecimiento de Sesión:** Al iniciar sesión un usuario, se creará una `Server Action` `associateUserWithSession(userId, sessionId)` que se invocará desde el `Auth Callback`. Esta acción actualizará los registros en `visitor_logs`, vinculando el `user_id` a todos los eventos de esa `session_id`.
        3.  **Contexto en Sentry y Logs:** Todas las llamadas a `logger.error` y `Sentry.captureException` **DEBEN** incluir el `userId` y `sessionId` en su contexto.
    *   **Beneficios:**
        *   **Trazabilidad Completa:** Permite reconstruir la sesión completa de un usuario, desde su visita anónima hasta sus acciones autenticadas, para una depuración de élite.

---