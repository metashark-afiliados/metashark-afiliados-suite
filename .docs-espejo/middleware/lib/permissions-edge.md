// .docs-espejo/middleware/lib/permissions-edge.md
/**
 * @file permissions-edge.md
 * @description Documento Espejo y SSoT para el aparato de permisos del Edge.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Conceptual: Aparato de Permisos del Edge Runtime

## 1. Rol Estratégico y Propósito
Este aparato es un **guardián de seguridad especializado y de alto rendimiento**, diseñado exclusivamente para operar dentro de las estrictas restricciones del **Edge Runtime de Next.js**. Su única responsabilidad es obtener el contexto de autenticación de un usuario (`User`, `appRole`, `activeWorkspaceId`) de la forma más eficiente posible, sin utilizar APIs que solo están disponibles en el entorno Node.js, como `unstable_cache`.

Este aislamiento es una decisión arquitectónica crítica que previene la contaminación de runtimes y resuelve la causa raíz de los fallos de compilación del middleware.

## 2. Arquitectura del Contenido
1.  **Cacheo de Roles en el Edge (Vercel KV):** La función `getUserAppRole` implementa una estrategia de caché de élite. Primero intenta obtener el rol del usuario desde Vercel KV, un almacenamiento de clave-valor de latencia ultrabaja. Si hay un `cache miss`, consulta la base de datos y luego escribe el resultado en el caché con un TTL (Time To Live), optimizando drásticamente las peticiones subsecuentes.
2.  **Lógica Atómica:** La lógica se descompone en helpers puros y atómicos (`getActiveWorkspaceIdFromCookie`, `getUserAppRole`), mejorando la legibilidad y el SRP.
3.  **Contrato de Datos Ligero:** Expone un tipo `UserAuthData` optimizado que contiene solo la información esencial requerida por los manejadores del middleware para tomar decisiones de enrutamiento y seguridad.
4.  **Cliente Supabase Edge-Safe:** Utiliza exclusivamente el cliente Supabase construido para el middleware, que maneja correctamente las cookies en un entorno inmutable.

## 3. Contrato de API
- **Entrada:** Un objeto `NextRequest` y `NextResponse`.
- **Salida:** Una promesa que resuelve a un objeto `{ authData: UserAuthData | null, response: NextResponse }`. Esta estructura permite que el cliente Supabase del middleware actualice las cookies de sesión y las propague por el pipeline.

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Invalidación Activa de Caché**: La `updateUserRoleAction` debería invocar `kv.del(\`user-role:${userId}\`)` para invalidar el caché inmediatamente después de un cambio de rol.
 * 2.  **Helper `withRetry` Genérico**: La lógica de reintentos podría ser abstraída a un helper `withRetry(asyncFn)` para envolver llamadas a KV o Supabase y aumentar la resiliencia.
 * 3.  **Tipado de `app_metadata` en `User`**: Modificar el trigger `handle_new_user_setup` en `schema.sql` para que popule `raw_app_meta_data`. Esto permitiría extender el tipo `User` para incluir el rol, eliminando la consulta a `profiles`.
 * 4.  **Helper Genérico de Cacheo Edge**: La lógica de cacheo en `getUserAppRole` podría ser abstraída a un helper `cacheInEdge(key, ttl, fetchDataFn)` para ser reutilizada.
 * 5.  **Logging de Latencia de Caché**: Medir y registrar la latencia de las operaciones de caché (get/set) para monitorear el rendimiento de Vercel KV.
 * 6.  **Fallback de Caché**: Si Vercel KV falla, la lógica podría tener un fallback para proceder sin cacheo, en lugar de potencialmente fallar.
 * 7.  **Configuración de TTL Centralizada**: El `CACHE_TTL_SECONDS` debería ser definido en una variable de entorno para una configuración flexible por entorno.
 * 8.  **Benchmarking**: Añadir benchmarks con `vitest.bench` para medir la diferencia de rendimiento entre un `cache hit` y un `cache miss`.
 * 9.  **Guardia de Tipo `isUserAuthData`**: Exportar un guardián de tipo para validar la forma del objeto `authData`.
 * 10. **Documentación de Estrategia de Caché**: Expandir el TSDoc para explicar la estrategia de invalidación de caché y por qué se eligió un TTL.
 * =====================================================================
 */
// .docs-espejo/middleware/lib/permissions-edge.md