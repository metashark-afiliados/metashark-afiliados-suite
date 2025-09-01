// .docs-espejo/lib/auth/user-permissions.md
/**
 * @file user-permissions.md
 * @description Documento Espejo y SSoT para el guardián de seguridad de la aplicación (Node.js).
 *              Este aparato es ahora la Única Fuente de Verdad para la obtención de
 *              datos de sesión en el servidor, reemplazando a `auth.helper.ts`.
 * @author @author RaZ Podestá - MetaShark Tech
 * @version 4.0.0
 */
# Manifiesto Conceptual: Guardián de Permisos de Usuario (Node.js) v4.0

## 1. Rol Estratégico y Propósito
Este aparato es el **guardián de seguridad de alto nivel** para el **runtime de servidor Node.js**. Su única responsabilidad es orquestar la obtención de datos de sesión y la verificación de permisos, proveyendo una API de "guardianes" (`getRequiredAuthData`, `requireAppRole`, etc.) que abstraen la complejidad de la lógica de autorización.

## 2. Arquitectura y Lógica de Operación
1.  **Cacheo de Sesión de Élite:** Utiliza `unstable_cache` de Next.js para cachear los datos de sesión (usuario y perfil) por petición. Esto previene consultas duplicadas a la base de datos y optimiza drásticamente el rendimiento en Server Components y Actions que necesitan datos de sesión múltiples veces.
2.  **Patrón de Guardián (`Guard Pattern`):** Las funciones `require...` y `getRequired...` siguen un patrón consistente: obtienen el contexto de sesión, verifican permisos y devuelven un objeto `AuthResult` de tipo seguro o lanzan un error controlado.
3.  **Contrato de Retorno Robusto:** El tipo `AuthResult` es una unión discriminada que permite a los consumidores manejar los diferentes resultados de la autorización de forma tipo-segura, eliminando la necesidad de `try/catch` en la capa de acciones para los flujos de autorización.
4.  **Flujo de Datos Seguro (Estático vs. Dinámico):** La lógica de obtención de datos está correctamente separada. `getCachedUserAndProfile` cachea datos que solo dependen del token de sesión. `getAuthenticatedUserAuthData` lee las cookies dinámicas (`active_workspace_id`) y las fusiona con los datos cacheados, cumpliendo con las reglas de cacheo de Next.js.

## 3. Zona de Melhorias Futuras
1.  **Permisos a Nivel de Recurso Más Granulares:** Extender el patrón para incluir guardianes como `requireCampaignPermission(campaignId, requiredRoles)`.
2.  **Invalidación de Caché por Etiqueta:** Las Server Actions que modifican roles (`updateUserRoleAction`) deben invocar `revalidateTag('auth-data')` para invalidar activamente el caché de permisos.
3.  **Abstracción del Tipo `AuthResult`:** El tipo `AuthResult` podría ser abstraído a un tipo `Result<TSuccess, TError>` más genérico para ser reutilizado en toda la aplicación.
4.  **Logging de Auditoría:** Integrar `createAuditLog` en los casos de `PERMISSION_DENIED` para registrar intentos de acceso no autorizado.
5.  **Inyección de Dependencias para Pruebas:** Refactorizar los guardianes para que acepten dependencias opcionales (como `supabaseClient`) para facilitar las pruebas unitarias aisladas.
6.  **Soporte para Múltiples Workspaces Activos:** Si la aplicación soportara múltiples contextos de workspace, el `AuthResult` podría devolver un array de `activeWorkspaces`.
7.  **Manejo de "Suplantación" (Impersonation):** Integrar la lógica para que, si un administrador está suplantando a un usuario, los guardianes devuelvan los datos del usuario suplantado.
8.  **Tipos de Error de Permiso Granulares:** En lugar de un solo `PERMISSION_DENIED`, el tipo `AuthResultError` podría incluir `ROLE_MISMATCH`, `OWNERSHIP_REQUIRED`, etc.
9.  **Integración con Feature Flags:** El `AuthResult` podría ser enriquecido con los feature flags activos para el usuario.
10. **Documentación Multilingüe:** Traducir este documento espejo.

// .docs-espejo/lib/auth/user-permissions.md```

### **2. Aparato de Código (`user-permissions.ts`)**

Esta es la versión refactorizada del SSoT de permisos, ahora con una API de obtención de datos más simple y robusta.

```typescript
