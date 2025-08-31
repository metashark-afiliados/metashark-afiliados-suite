// .docs-espejo/middleware/handlers/telemetry/index.md
/**
 * @file index.md
 * @description Documento Espejo y SSoT conceptual para el manejador de Telemetría.
 * @author L.I.A. Legacy
 * @copilot RaZ WriTe
 * @version 2.0.0
 */
# Manifiesto Conceptual: Manejador de Telemetría

## 1. Propósito y Responsabilidad Única (PRU)

Este aparato es el **punto de origen para la observabilidad del visitante**. Su única y exclusiva responsabilidad es ejecutarse en la **primera petición de una nueva sesión de navegador**, recolectar todos los datos disponibles en el Edge Runtime (IP, GeoIP, User-Agent, etc.), invocar la Server Action `logVisitorAction` para crear un registro inicial en la tabla `visitor_logs`, y establecer una cookie de sesión (`metashark_session_id`) para prevenir ejecuciones repetidas.

## 2. Arquitectura y Lógica de Operación

1.  **Detección de Primera Visita:** El manejador utiliza la ausencia de la cookie `metashark_session_id` como el gatillo para su ejecución. Si la cookie existe, el manejador se salta su lógica inmediatamente, minimizando la latencia en peticiones subsecuentes.
2.  **Recolección de Datos del Servidor:** Ensambla un `logPayload` que contiene exclusivamente datos veraces y disponibles en el servidor, como `request.ip`, `request.geo`, y cabeceras. No intenta adivinar datos del cliente.
3.  **Ejecución "Fire-and-Forget":** Invoca la `logVisitorAction` de forma asíncrona y sin `await`, con un bloque `.catch()` explícito. Este patrón es una optimización de rendimiento crítica que asegura que el registro de telemetría no añada latencia perceptible al pipeline del middleware. Cualquier fallo en la acción de logging se registra, pero no interrumpe el flujo de la petición principal del usuario.
4.  **Establecimiento de Sesión:** Tras invocar la acción, establece la cookie `metashark_session_id` en la `response`, marcando la sesión como "logueada" para este manejador y garantizando que solo se ejecute una vez por sesión de navegador.

## 3. Zona de Mejoras Futuras

1.  **Manejo de `userId` en Middleware:** El `logPayload` actual no incluye `userId`. Para asociar la sesión con un usuario desde la primera visita (si ya está logueado), este handler necesitaría acceso a `authData`, lo que requeriría reordenarlo después del `handleAuth` en el pipeline de `middleware.ts`.
2.  **Exclusión de Rutas de Assets:** El manejador podría ser optimizado para excluir rutas de assets (`_next/`, `favicon.ico`) añadiendo una guarda al principio, reduciendo ejecuciones innecesarias.
3.  **Configuración de `maxAge` de Cookie:** La duración de la cookie (1 año) podría ser externalizada a una variable de entorno para una configuración más flexible.
4.  **Tipado Estricto de `logPayload`:** El tipo del payload podría ser importado desde `VisitorLogSchema` para garantizar la consistencia.
5.  **Servicio de Detección de Bots Avanzado:** La detección actual basada en User-Agent es básica. Podría integrarse con un servicio de terceros para una detección de bots más sofisticada.
6.  **Internacionalización de la Documentación:** Traducir este documento espejo.
// .docs-espejo/middleware/handlers/telemetry/index.md