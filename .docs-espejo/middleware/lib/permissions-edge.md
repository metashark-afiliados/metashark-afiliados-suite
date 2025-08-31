// .docs-espejo/middleware/lib/permissions-edge.md
/**
 * @file permissions-edge.md
 * @description Documento Espejo y SSoT para el aparato de permisos del Edge.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 3.0.0
 */
# Manifiesto Conceptual: Aparato de Permisos del Edge Runtime v3.0

## 1. Rol Estratégico y Propósito
Este aparato es un **guardián de seguridad especializado y de alto rendimiento**, diseñado exclusivamente para operar dentro del **Edge Runtime**. Su única responsabilidad es obtener el contexto de autenticación de un usuario de la forma más eficiente y resiliente posible.

## 2. Arquitectura del Contenido
1.  **Propagación de Respuesta Inmutable:** La función principal `getAuthDataForMiddleware` ahora acepta `request` y `response`, y devuelve una `response` actualizada. Esto se alinea con el patrón de "respuesta encadenada", asegurando que las modificaciones de cookies se propaguen a través del pipeline.
2.  **Manejo de Errores Resiliente:** Mantiene la lógica de observar `AuthSessionMissingError` como un evento de traza y no como un error del sistema.
3.  **Cacheo de Roles en el Edge (Vercel KV):** Mantiene la estrategia de cacheo para los roles de aplicación.
4.  **Helpers Atómicos:** La lógica se descompone en helpers puros y atómicos.

## 3. Contrato de API
- **Entrada:** Un objeto `NextRequest` y `NextResponse`.
- **Salida:** Una promesa que resuelve a un objeto `{ authData: UserAuthData | null, response: NextResponse }`.

/**
 * =====================================================================
 *                           ZONA DE MEJORAS
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Invalidación Activa de Caché:** La `updateUserRoleAction` debería invocar `kv.del(\`user-role:${userId}\`)`.
 * 2.  **Helper `withRetry` Genérico:** La lógica de reintentos podría ser abstraída a un helper `withRetry(asyncFn)`.
 * 3.  **Tipado de `app_metadata` en `User`:** Modificar el trigger `handle_new_user_setup` para poblar `raw_app_meta_data`.
 * 4.  **Helper Genérico de Cacheo Edge:** La lógica de cacheo podría ser abstraída a un helper `cacheInEdge(key, ttl, fetchDataFn)`.
 * 5.  **Logging de Latencia de Caché:** Medir y registrar la latencia de las operaciones de caché.
 * =====================================================================
 */
// .docs-espejo/middleware/lib/permissions-edge.md