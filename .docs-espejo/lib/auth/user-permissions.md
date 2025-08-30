// .docs-espejo/lib/auth/user-permissions.md
/**
 * @file user-permissions.md
 * @description Documento Espejo y SSoT para el guardián de seguridad de la aplicación (Node.js).
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 4.0.0
 */
# Manifiesto Conceptual: Guardián de Permisos de Usuario (Node.js)

## 1. Rol Estratégico y Propósito
Este aparato es el **guardián de seguridad de alto nivel** para el **runtime de servidor Node.js**. Su única responsabilidad es orquestar la obtención de datos de sesión y la verificación de permisos, proveyendo una API de "guardianes" (`requireAppRole`, `requireWorkspacePermission`) que abstraen la complejidad de la lógica de autorización.

## 2. Arquitectura del Contenido
1.  **Cacheo Aislado y Válido:** La obtención de datos de sesión se divide en dos pasos para cumplir con las reglas de Next.js:
    *   Una función **interna y cacheada** (`getCachedUserAuthData`) obtiene los datos estáticos de la sesión (usuario y perfil), que solo dependen del token de autenticación.
    *   Una función **pública y no cacheada** (`getAuthenticatedUserAuthData`) orquesta el proceso: primero llama a la función cacheada para obtener los datos base, y luego lee los datos dinámicos (`cookies().get(...)`) para obtener el `activeWorkspaceId`, fusionando ambos resultados. Este patrón separa correctamente las fuentes de datos estáticas de las dinámicas.
2.  **Patrón de Guardián (`Guard Pattern`):** Las funciones `require...` siguen un patrón consistente: obtienen el contexto de sesión, verifican los permisos y devuelven un objeto `AuthResult`.
3.  **Contrato de Retorno Robusto:** El tipo `AuthResult` es una unión discriminada que permite a los consumidores manejar los diferentes resultados de la autorización de forma tipo-segura.

## 3. Contrato de API
- **Entrada:** Un array de roles requeridos y, opcionalmente, un ID de recurso (ej. `workspaceId`).
- **Salida:** Una promesa que resuelve a un objeto `AuthResult`.

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Permisos a Nivel de Recurso Más Granulares**: Extender el patrón para incluir guardianes como `requireCampaignPermission(campaignId, requiredRoles)`.
 * 2.  **Invalidación de Caché por Etiqueta**: Las Server Actions que modifican roles deben invocar `revalidateTag('auth-data')` para invalidar activamente el caché.
 * 3.  **Abstracción del Tipo `AuthResult`**: El tipo `AuthResult` podría ser abstraído a un tipo `Result<TSuccess, TError>` más genérico.
 * 4.  **Logging de Auditoría**: Integrar `createAuditLog` en los casos de `PERMISSION_DENIED` para registrar intentos de acceso no autorizado.
 * 5.  **Inyección de Dependencias para Pruebas**: Refactorizar los guardianes para que acepten dependencias opcionales para facilitar las pruebas.
 * =====================================================================
 */
// .docs-espejo/lib/auth/user-permissions.md