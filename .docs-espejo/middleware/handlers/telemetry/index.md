// .docs-espejo/middleware/handlers/telemetry/index.md
/**
 * @file index.md
 * @description Documento Espejo y SSoT para el manejador de telemetría del middleware.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 2.0.0
 */
# Manifiesto Conceptual: Manejador de Telemetría

## 1. Rol Estratégico y Propósito
Este aparato es el **punto de origen para la observabilidad del visitante**. Su única responsabilidad es ejecutarse en la **primera petición** de una nueva sesión, recolectar todos los datos disponibles en el Edge Runtime (IP, GeoIP, User-Agent, etc.), y crear un registro inicial en la tabla `visitor_logs`.

Actúa en modo "fire-and-forget", invocando la `logVisitorAction` de forma asíncrona para no añadir latencia al pipeline del middleware.

## 2. Arquitectura del Contenido
1.  **Detección de Primera Visita:** El manejador utiliza la ausencia de la cookie `metashark_session_id` para identificar la primera petición de una sesión.
2.  **Creación de Payload Puro:** Construye un objeto de payload que contiene exclusivamente datos del servidor. **No incluye placeholders** para datos que serán proveídos por el cliente (como el `fingerprint`).
3.  **Invocación Asíncrona:** Llama a la `logVisitorAction` sin `await` y con un `.catch()` para asegurar que cualquier fallo en la telemetría no interrumpa el flujo de la petición principal.
4.  **Establecimiento de Sesión:** Tras invocar la acción, establece la cookie `metashark_session_id` en la respuesta para que las peticiones subsecuentes no disparen este manejador.

## 3. Contrato de API
- **Entrada:** `NextRequest`, `NextResponse`.
- **Salida:** `void`. El manejador muta el objeto `NextResponse` añadiendo una cookie, pero no interrumpe el pipeline.

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Manejo de `userId` en Middleware**: El `logPayload` actual no incluye `userId`. Para asociar la sesión con un usuario desde la primera visita (si ya está logueado), este handler necesitaría acceso a `authData`, lo que requeriría reordenarlo después del `handleAuth` en el pipeline de `middleware.ts`.
 * 2.  **Exclusión de Rutas de Assets**: El handler podría ser optimizado para excluir rutas de assets (`_next/`, `favicon.ico`) añadiendo una guarda al principio, reduciendo ejecuciones innecesarias.
 * 3.  **Configuración de `maxAge` de Cookie**: La duración de la cookie (1 año) podría ser externalizada a una variable de entorno para una configuración más flexible.
 * 4.  **Tipado Estricto de `logPayload`**: El tipo del payload podría ser importado desde `VisitorLogSchema` para garantizar la consistencia.
 * 5.  **Servicio de Detección de Bots Avanzado**: La detección actual basada en User-Agent es básica. Podría integrarse con un servicio de terceros para una detección de bots más sofisticada.
 * =====================================================================
 */
// .docs-espejo/middleware/handlers/telemetry/index.md