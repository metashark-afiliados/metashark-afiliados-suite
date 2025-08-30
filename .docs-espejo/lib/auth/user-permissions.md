// .docs-espejo/lib/auth/user-permissions.md
/**
 * @file user-permissions.md
 * @description Documento Espejo y SSoT para el guardián de seguridad de la aplicación.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 2.0.0
 */
# Manifiesto Conceptual: Guardián de Permisos de Usuario

## 1. Rol Estratégico y Propósito
Este aparato es el **guardián de seguridad de alto nivel** para el **runtime de servidor Node.js** (Server Components, Server Actions). Su única responsabilidad es orquestar la obtención de datos de sesión y la verificación de permisos, proveyendo una API de "guardianes" (`requireAppRole`, `requireWorkspacePermission`) que abstraen la complejidad de la lógica de autorización.

Este aparato construye sobre la lógica de bajo nivel de `src/lib/data/permissions.ts`, añadiendo la capa de obtención de contexto de usuario.

## 2. Arquitectura del Contenido
1.  **Cacheo de Sesión de Élite:** La función `getAuthenticatedUserAuthData` utiliza `unstable_cache` de `next/cache`. Esto es una optimización crítica que garantiza que los datos de sesión (usuario, perfil, workspace activo) se obtengan de la base de datos **una sola vez** por cada ciclo de petición-respuesta, sin importar cuántos guardianes de seguridad se invoquen.
2.  **Patrón de Guardián (`Guard Pattern`):** Las funciones `require...` siguen un patrón consistente: obtienen el contexto de sesión, verifican los permisos y devuelven un objeto `AuthResult` que indica éxito o un tipo de fallo específico (`SESSION_NOT_FOUND`, `PERMISSION_DENIED`).
3.  **Contrato de Retorno Robusto:** El tipo `AuthResult` es una unión discriminada que permite a los consumidores manejar los diferentes resultados de la autorización de forma tipo-segura.

## 3. Contrato de API
- **Entrada:** Un array de roles requeridos y, opcionalmente, un ID de recurso (ej. `workspaceId`).
- **Salida:** Una promesa que resuelve a un objeto `AuthResult`, conteniendo los datos de sesión en caso de éxito o un código de error específico en caso de fallo.

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Permisos a Nivel de Recurso Más Granulares**: Extender el patrón para incluir guardianes como `requireCampaignPermission(campaignId, requiredRoles)` que verifiquen la propiedad o membresía a través de múltiples niveles de relaciones.
 * 2.  **Invalidación de Caché por Etiqueta**: Las Server Actions que modifican roles (`updateUserRole`, `updateWorkspaceMemberRole`) deben invocar `revalidateTag('auth-data')` para invalidar activamente el caché de `getAuthenticatedUserAuthData`.
 * 3.  **Abstracción del Tipo `AuthResult`**: El tipo `AuthResult` podría ser abstraído a un tipo `Result<TSuccess, TError>` más genérico para ser reutilizado en otras partes de la aplicación que no estén relacionadas con la autenticación.
 * 4.  **Logging de Auditoría**: Integrar `createAuditLog` en los casos de `PERMISSION_DENIED` para registrar intentos de acceso no autorizado, una capacidad de seguridad de nivel empresarial.
 * 5.  **Inyección de Dependencias para Pruebas**: Refactorizar los guardianes para que acepten opcionalmente las funciones de datos como parámetros, facilitando la inyección de mocks y las pruebas unitarias aisladas.
 * 6.  **Manejo de "Magic Strings" de Error**: Reemplazar los strings de error como "SESSION_NOT_FOUND" por claves de i18n del `ValidationErrorsSchema` para una consistencia total.
 * 7.  **Soporte para Lógica de Permisos Compleja**: Extender los guardianes para que acepten un callback de validación (`(authData) => boolean`) para reglas de autorización más complejas que no se basan solo en roles.
 * 8.  **Benchmarking de Rendimiento**: Añadir benchmarks con `vitest.bench` para medir la latencia de los guardianes de seguridad y el impacto del cacheo.
 * 9.  **Guardia de Tipo para `AuthResult`**: Exportar guardianes de tipo `isAuthSuccess(result)` y `isAuthError(result)` para un `type narrowing` más limpio en los consumidores.
 * 10. **Documentación de Casos de Uso**: Añadir ejemplos de código en el TSDoc que muestren cómo consumir cada guardián en una Server Action.
 * =====================================================================
 */
// .docs-espejo/lib/auth/user-permissions.md