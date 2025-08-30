// .docs-espejo/middleware/handlers/auth/index.md
/**
 * @file index.md
 * @description Documento Espejo y SSoT para el manejador de autenticación del middleware.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Conceptual: Manejador de Autenticación del Middleware

## 1. Rol Estratégico y Propósito
Este aparato es el **guardián de seguridad principal** en el pipeline del middleware. Su única responsabilidad es interceptar cada petición, determinar el estado de autenticación del usuario y aplicar las reglas de seguridad definidas en el `ROUTE_MANIFEST`. Actúa como el portero de la aplicación, decidiendo si una petición puede continuar, debe ser redirigida a la página de login, o a una página de acceso no autorizado.

## 2. Arquitectura del Contenido
1.  **Consumo de SSoT del Edge:** El manejador consume exclusivamente los aparatos diseñados para el Edge Runtime:
    *   `permissions-edge.ts`: Para obtener el contexto de sesión del usuario de forma segura y compatible.
    *   `routing-manifest-edge.ts`: Para obtener las reglas de clasificación y permisos de cada ruta.
2.  **Lógica Atómica y Pura:** La lógica compleja se descompone en helpers puros y atómicos (`createRedirectResponse`, `findMatchingRouteRule`, `handleUnauthenticated`, `handleAuthenticated`), mejorando la legibilidad, el SRP y la testeabilidad.
3.  **Orquestación de Flujo:** La función principal `handleAuth` orquesta la invocación de estos helpers para tomar una decisión final: redirigir o permitir el paso.

## 3. Contrato de API
- **Entrada:** `NextRequest`, `NextResponse`.
- **Salida:** Una `NextResponse` que puede ser la original (modificada con cookies de sesión), o una nueva respuesta de redirección.

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Factoría de Reglas Dinámicas:** La función `findMatchingRouteRule` podría ser mejorada para usar una librería de coincidencia de patrones de ruta (como `path-to-regexp`) para manejar reglas más complejas en rutas dinámicas.
 * 2.  **Cacheo de Reglas de Ruta:** Si el `ROUTE_MANIFEST` fuera cargado desde una base de datos, la función `findMatchingRouteRule` sería un candidato ideal para ser envuelta en un caché de alta velocidad (como Vercel KV).
 * 3.  **Lógica de Roles Compleja:** `handleAuthenticated` podría ser extendido para soportar lógicas de roles más complejas, como requerir que un usuario tenga *todos* los roles de una lista.
 * 4.  **Helper `withRetry`:** La llamada a `getAuthDataForMiddleware` podría ser envuelta en un helper `withRetry` para aumentar la resiliencia contra fallos transitorios de red.
 * 5.  **Internacionalización de Mensajes de Log:** Para equipos de soporte multilingües, los mensajes de log de alto nivel podrían usar claves de i18n.
 * =====================================================================
 */
// .docs-espejo/middleware/handlers/auth/index.md