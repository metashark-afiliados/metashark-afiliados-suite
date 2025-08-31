// .docs-espejo/middleware/lib/permissions-edge.md
/**
 * @file permissions-edge.md
 * @description Documento Espejo y SSoT para el aparato de permisos del Edge.
 * @author L.I.A. Legacy
 * @copilot RaZ WriTe
 * @version 4.0.0
 */
# Manifiesto Conceptual: Aparato de Permisos del Edge Runtime v4.0

## 1. Rol Estratégico y Propósito
Este aparato es un **guardián de seguridad especializado y de alto rendimiento**, diseñado exclusivamente para operar dentro del **Edge Runtime**. Su única responsabilidad es obtener el contexto de autenticación de un usuario de la forma más eficiente y resiliente posible para ser consumido por el `handleAuth`.

## 2. Arquitectura del Contenido
1.  **Patrón de Respuesta Encadenada:** La función principal `getAuthDataForMiddleware` adhiere estrictamente a la arquitectura del pipeline. Acepta `request` y `response`, y devuelve una `response` actualizada, garantizando la propagación de cookies de sesión.
2.  **Cacheo de Roles en el Edge (Vercel KV):** Para una optimización de rendimiento de élite, el `app_role` del usuario se cachea en Vercel KV. Esto reduce significativamente la latencia al evitar una consulta a la base de datos en cada ejecución del middleware para usuarios conocidos.
3.  **Resiliencia del Caché:** La interacción con Vercel KV está protegida. Si el caché falla, la función degrada su rendimiento de forma elegante, obteniendo el rol directamente de la base de datos sin interrumpir el flujo.
4.  **Helpers Atómicos:** La lógica se descompone en helpers puros y atómicos (`getActiveWorkspaceIdFromCookie`, `getUserAppRole`), mejorando la legibilidad y el SRP.
5.  **Manejo de Errores Resiliente:** Trata la `AuthSessionMissingError` como un evento de traza normal, pero registra errores inesperados de Supabase para una observabilidad completa.

## 3. Zona de Mejoras Futuras
1.  **Invalidación Activa de Caché:** La `updateUserRoleAction` en el backend Node.js debe invocar `kv.del(\`user-role:\${userId}\`)` para invalidar activamente el caché cuando se cambia el rol de un usuario.
2.  **Helper `withRetry` Genérico:** La lógica de reintentos para obtener el perfil podría ser abstraída a un helper `withRetry(asyncFn)`.
3.  **Tipado de `app_metadata` en `User`:** Modificar el trigger `handle_new_user_setup` para poblar `raw_app_meta_data.app_role` y sincronizarlo en el token JWT, lo que podría eliminar la necesidad de consultar la tabla `profiles` aquí.
4.  **Helper Genérico de Cacheo Edge:** La lógica de `try/catch` para el cacheo podría ser abstraída a un helper `cacheInEdge(key, ttl, fetchDataFn)`.
5.  **Logging de Latencia de Caché:** Medir y registrar la latencia de las operaciones de caché para monitorear el rendimiento del KV store.
6.  **Internacionalización de la Documentación:** Traducir este documento espejo.
// .docs-espejo/middleware/lib/permissions-edge.md