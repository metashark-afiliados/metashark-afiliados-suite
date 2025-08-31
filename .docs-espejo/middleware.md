// .docs-espejo/lib/supabase/middleware.md
/**
 * @file middleware.md
 * @description Documento Espejo y SSoT para la factoría del cliente Supabase del Middleware.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 2.0.0
 */
# Manifiesto Conceptual: Factoría de Cliente Supabase para Middleware v2.0

## 1. Rol Estratégico y Propósito
Este aparato es una **factoría de infraestructura crítica y especializada**, diseñada para construir una instancia del cliente Supabase que sea **100% segura y compatible con el Edge Runtime de Next.js**.

Abstrae la compleja lógica de gestión de cookies en un entorno inmutable, proveyendo una API simple y robusta para ser consumida exclusivamente por el pipeline del middleware.

## 2. Arquitectura del Contenido
1.  **Patrón de Respuesta Encadenada:** Implementa la lógica de "respuesta encadenada" canónica. Cada vez que el cliente Supabase necesita modificar una cookie (`set` o `remove`), se crea una nueva `NextResponse` a partir de la petición actual, se aplica la modificación y se actualiza una referencia a esta respuesta. Esto asegura que todas las modificaciones de cookies se acumulen correctamente y se pasen al siguiente manejador en el pipeline.
2.  **Helpers Atómicos (`getEdgeCookieHandlers`, `createChainedResponse`):** La lógica se descompone en funciones puras y atómicas para máxima claridad, cohesión y cumplimiento del SRP.
3.  **Observabilidad de Cookies:** Cada operación de cookie (`get`, `set`, `remove`) es registrada con `logger.trace`, proporcionando una visibilidad completa del flujo de la sesión.
4.  **Tipado Estricto de Cookies:** Introduce un tipo `CanonicalCookieName` para promover el manejo de cookies tipo-seguro dentro del middleware.

## 3. Contrato de API
- **Entrada:** `NextRequest` y `NextResponse` (opcional).
- **Salida:** Un objeto `{ supabase, response }`, donde `supabase` es el cliente listo para usar y `response` es la `NextResponse` actualizada con cualquier cambio de cookie.

/**
 * =====================================================================
 *                           ZONA DE MEJORAS
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Centralización de Regex:** La expresión regular para validar la URL podría definirse en un manifiesto `src/config/regex.config.ts`.
 * 2.  **Tipado de Errores de Cookie:** Los bloques `catch` podrían usar un guardián de tipo para verificar si el error es una `TypeError` y registrar un log más específico.
 * 3.  **Gestión de Múltiples Sesiones:** Si la app soportara múltiples sesiones, el `CanonicalCookieName` podría ser extendido.
 * 4.  **Internacionalización de la Documentación:** Traducir este documento espejo.
 * =====================================================================
 */
// .docs-espejo/lib/supabase/middleware.md