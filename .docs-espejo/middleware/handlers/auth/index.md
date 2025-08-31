// .docs-espejo/middleware/handlers/auth/index.md
/**
 * @file index.md
 * @description Documento Espejo y SSoT para el manejador de autenticación del middleware.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 3.0.0
 */
# Manifiesto Conceptual: Manejador de Autenticación del Middleware v3.0

## 1. Rol Estratégico y Propósito
Este aparato es el **guardián de seguridad principal** en el pipeline del middleware. Su única responsabilidad es interceptar cada petición, determinar el estado de autenticación del usuario y aplicar las reglas de seguridad definidas en el `ROUTE_MANIFEST`.

## 2. Arquitectura del Contenido
1.  **Patrón de Respuesta Encadenada:** El manejador ahora acepta `request` y `response`. Invoca a `getAuthDataForMiddleware` pasándole ambos y utiliza la `response` devuelta por este como base para sus propias operaciones. Devuelve la `NextResponse` final, ya sea la modificada por Supabase, una nueva de redirección, o la que se le pasó originalmente.
2.  **Consumo de SSoT del Edge:** Consume exclusivamente los aparatos diseñados para el Edge Runtime (`permissions-edge.ts`, `routing-manifest-edge.ts`).
3.  **Lógica Atómica y Pura:** La lógica compleja se descompone en helpers puros y atómicos, mejorando la legibilidad, el SRP y la testeabilidad.
4.  **Seguridad por Defecto:** Si una ruta no tiene una regla explícita en el manifiesto, se asume que es protegida por defecto.

## 3. Contrato de API
- **Entrada:** `NextRequest`, `NextResponse`.
- **Salida:** Una `NextResponse` que puede ser la original (modificada con cookies de sesión), o una nueva respuesta de redirección.

/**
 * =====================================================================
 *                           ZONA DE MEJORAS
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Factoría de Reglas Dinámicas:** La función `findMatchingRouteRule` podría ser mejorada para usar una librería de coincidencia de patrones de ruta para manejar reglas más complejas.
 * 2.  **Cacheo de Reglas de Ruta:** Si el `ROUTE_MANIFEST` fuera cargado desde una base de datos, `findMatchingRouteRule` sería un candidato ideal para ser envuelta en un caché de alta velocidad (Vercel KV).
 * 3.  **Lógica de Roles Compleja:** `handleAuthenticated` podría ser extendido para soportar lógicas de roles más complejas.
 * 4.  **Helper `withRetry`:** La llamada a `getAuthDataForMiddleware` podría ser envuelta en un helper `withRetry` para aumentar la resiliencia.
 * 5.  **Internacionalización de la Documentación:** Traducir este documento espejo.
 * =====================================================================
 */
// .docs-espejo/middleware/handlers/auth/index.md