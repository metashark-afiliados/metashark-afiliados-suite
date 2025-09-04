// .docs-espejo/middleware/handlers/auth/index.md
/**
 * @file index.md
 * @description Documento Espejo y SSoT para el manejador de autenticación del middleware.
 * @version 4.0.0
 */
# Manifiesto Conceptual: Manejador de Autenticación del Middleware v4.0

## 1. Rol Estratégico y Propósito
Este aparato es el **guardián de seguridad principal** en el pipeline del middleware. Su única responsabilidad es interceptar cada petición, determinar el estado de autenticación del usuario, y aplicar las reglas de seguridad definidas en el `ROUTE_MANIFEST`. Actúa como el portero que protege las rutas y gestiona los flujos de redirección de autenticación.

## 2. Arquitectura y Lógica de Operación
1.  **Patrón de Respuesta Encadenada:** El manejador adhiere estrictamente a la arquitectura del pipeline inmutable. Acepta una `NextRequest` y una `NextResponse` del manejador anterior. Orquesta la lógica de autenticación y **siempre** devuelve una `NextResponse` para el siguiente manejador en la cadena, ya sea una nueva respuesta de redirección o la respuesta recibida, potencialmente enriquecida con cookies de sesión por el cliente Supabase.
2.  **Consumo de SSoT del Edge:** Consume exclusivamente los aparatos diseñados para el Edge Runtime (`permissions-edge.ts`, `routing-manifest-edge.ts`) para un rendimiento y compatibilidad óptimos.
3.  **Lógica Atómica y Pura:** La lógica compleja se descompone en helpers puros y atómicos (`findMatchingRouteRule`, `handleUnauthenticated`, `handleAuthenticated`), mejorando la legibilidad, el SRP y la testeabilidad.
4.  **Seguridad por Defecto:** Si una ruta no tiene una regla explícita en el manifiesto, se asume que es protegida por defecto, adhiriéndose al principio de seguridad por defecto.
5.  **Full Observabilidad:** Cada decisión lógica (redirección, permiso denegado, paso) se registra con contexto, proporcionando una trazabilidad completa del flujo de seguridad.

## Zona de Melhorias Futuras
1.  **Factoría de Reglas Dinámicas**: La función `findMatchingRouteRule` podría ser mejorada para usar una librería de coincidencia de patrones de ruta (ej. `path-to-regexp`) para manejar reglas más complejas, como parámetros opcionales.
2.  **Cacheo de Reglas de Ruta**: Si el `ROUTE_MANIFEST` fuera cargado desde una base de datos, `findMatchingRouteRule` sería un candidato ideal para ser envuelto en un caché de alta velocidad (Vercel KV).
3.  **Lógica de Roles Compleja**: `handleAuthenticated` podría ser extendido para soportar lógicas de roles más complejas, como permisos basados en la combinación de múltiples roles.
4.  **Helper `withRetry`**: La llamada a `getAuthDataForMiddleware` podría ser envuelta en un helper `withRetry` para aumentar la resiliencia contra fallos transitorios de la red.
5.  **Internacionalización de la Documentación**: Traducir este documento espejo.
6.  **Página `/unauthorized` Personalizada**: La redirección por `PERMISSION_DENIED` podría incluir un `searchParam` con un código de error, permitiendo a la página `/unauthorized` mostrar un mensaje más específico.
7.  **Registro de Auditoría de Seguridad**: Los eventos de `PERMISSION_DENIED` podrían invocar una Server Action `fire-and-forget` para crear un `audit_log` de alta prioridad.
8.  **Pruebas de Integración**: Escribir pruebas de integración que simulen diferentes rutas y estados de sesión para validar cada rama lógica del manejador.
9.  **Manejo de Redirección Post-Login**: Leer el `searchParam` `next` en `handleUnauthenticated` y añadirlo a la URL de redirección a `/login`.
10. **Bypass de Rutas Específicas**: Añadir un array `bypassPaths` al `ROUTE_MANIFEST` para excluir explícitamente ciertas sub-rutas de la lógica de autenticación (ej. `/dashboard/public-report`).
// .docs-espejo/middleware/handlers/auth/index.md