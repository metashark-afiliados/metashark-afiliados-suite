// .docs-espejo/lib/auth/user-permissions.ts.md
/**
 * @file .docs-espejo/lib/auth/user-permissions.ts.md
 * @description Documento Espejo y SSoT conceptual para el guardián de seguridad `user-permissions`.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
# Manifiesto Conceptual: Guardián de Seguridad `user-permissions`

## 1. Rol Estratégico y Propósito

Este aparato es el **Guardián de Seguridad** de la capa de servidor. Su única responsabilidad (PRU) es actuar como la SSoT para obtener el contexto de sesión de un usuario y verificar sus permisos de acceso a los recursos. Es la implementación de la **arquitectura de defensa en profundidad** y el principio de **Seguridad por Defecto**.

Estratégicamente, este módulo:
*   **Centraliza la Lógica de Autorización:** Proporciona un conjunto de funciones (`require...Permission`) que las Server Actions DEBEN usar para validar el acceso, garantizando que la lógica de permisos sea consistente y no esté duplicada.
*   **Implementa Cacheo de Sesión:** Utiliza `unstable_cache` de Next.js para cachear los datos de sesión enriquecidos por cada petición, optimizando drásticamente el rendimiento al reducir las consultas a la base de datos.
*   **Provee un Contrato de Respuesta Seguro:** Exporta el tipo `AuthResult`, que es el contrato de comunicación canónico para todas las funciones de validación de permisos.

## 2. Arquitectura y Flujo de Ejecución

El módulo expone una jerarquía de guardianes que consumen una función de datos base cacheada.

```mermaid
sequenceDiagram
    participant Action as Server Action
    participant Guardian as require...Permission
    participant Cache as getCachedEnrichedAuthData
    participant DataLayer as permissionsData
    participant Logger as logger

    Action->>Guardian: Invoca guardián con (resourceId, requiredRoles)
    Guardian->>Cache: Obtiene datos de sesión del usuario
    alt Cache HIT
        Cache-->>Guardian: Retorna datos cacheados
    else Cache MISS
        Cache->>DataLayer: Obtiene perfil y rol de la DB
        DataLayer-->>Cache: Retorna datos
        Cache-->>Guardian: Retorna y cachea datos
    end
    Guardian->>DataLayer: Verifica permisos (`hasWorkspacePermission`)
    alt No Autorizado
        DataLayer-->>Guardian: Retorna `false`
        Guardian->>Logger: logger.warn({context}, "VIOLACIÓN...")
        Guardian-->>Action: Retorna `AuthResult` de error
    else Autorizado
        DataLayer-->>Guardian: Retorna `true`
        Guardian-->>Action: Retorna `AuthResult` de éxito
    end
3. Contrato de API
Salidas Principales
getAuthenticatedUserAuthData(): Promise<UserAuthData | null>
requireAppRole(...): Promise<AuthResult<UserAuthData>>
requireWorkspacePermission(...): Promise<AuthResult<{ user: User }>>
requireSitePermission(...): Promise<AuthResult<{ user: User; site: SiteBasicInfo }>>
4. Zona de Melhorias Futuras
Cacheo Negativo: Implementar una estrategia de cacheo negativo donde los fallos de autorización también se cachean por un corto período para mitigar ataques de fuerza bruta.
Inyección de Dependencias: Refactorizar los guardianes para que sus dependencias (como permissionsData) puedan ser inyectadas, facilitando las pruebas unitarias aisladas.
Permisos Basados en Atributos (ABAC): Evolucionar hacia un modelo ABAC donde los permisos se basan en atributos dinámicos (ej. "el usuario puede editar el sitio si es de día y el sitio está en su mismo país"), en lugar de solo roles estáticos.
Logging de Latencia de Caché: Medir y registrar la latencia de las operaciones de caché (HIT vs MISS) para monitorizar el rendimiento de la capa de autorización.
Revalidación de Caché Basada en Eventos: Utilizar webhooks o Supabase Realtime para invalidar proactivamente el caché de permisos de un usuario cuando sus roles cambian, en lugar de depender únicamente del TTL.
Guardián requireOwnership: Crear un guardián de conveniencia que encapsule la lógica común de verificar si user.id === resource.owner_id.
Soporte para Múltiples Workspaces Activos: En un futuro, si la UI permite operar en múltiples workspaces simultáneamente, la lógica de activeWorkspaceId necesitaría ser expandida.
Contexto de Petición en Logging: Pasar el pathname o actionName a los guardianes para que los logs de denegación de permisos sean más contextuales.
Tipos AuthResult más Específicos: Crear tipos de error más específicos que PERMISSION_DENIED, como ROLE_MISMATCH o OWNERSHIP_REQUIRED, para un manejo de errores más granular.
Internacionalización de Mensajes de Log: Aunque son internos, los mensajes en los logs de advertencia podrían usar claves de i18n para equipos de desarrollo multilingües.
// .docs-espejo/lib/auth/user-permissions.ts.md