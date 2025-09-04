// .docs-espejo/lib/data/permissions.md
/**
 * @file permissions.md
 * @description Documento Espejo y SSoT conceptual para el aparato de datos de lógica de permisos.
 *              Sincronizado con la arquitectura "Lean Database" y optimizado con
 *              predicados de tipo de alta fidelidad.
 * @author @author RaZ Podestá - MetaShark Tech
 * @version 2.1.0
 */
# Manifiesto Conceptual: Aparato de Datos - Lógica de Permisos v2.1

## 1. Rol Estratégico y Propósito

Este aparato es el **módulo de acceso a datos (DAO) atómico y soberano para la lógica de autorización**. Su única responsabilidad es encapsular las consultas a la base de datos que verifican si un usuario posee un rol específico dentro de un contexto de workspace. Es una pieza de infraestructura de seguridad crítica, consumida por los guardianes de seguridad de más alto nivel (`user-permissions.ts`).

Esta versión se alinea completamente con la arquitectura "Lean Database" (AD-002), operando con `role_id`s numéricos y consumiendo el manifiesto de roles SSoT.

## 2. Arquitectura y Lógica de Operación

1.  **Cacheo de Datos de Élite (`unstable_cache`):** La función de lectura `hasWorkspacePermission` utiliza `unstable_cache` de `next/cache`. Se utilizan etiquetas (`tags: ["permissions"]`) para permitir la invalidación de caché granular y proactiva.
2.  **Consumo de SSoT de Roles:** La función acepta un array de nombres de roles semánticos (`WorkspaceRoleName[]`). Internamente, utiliza el manifiesto `roles.config.ts` para convertir estos nombres a sus IDs numéricos correspondientes.
3.  **Seguridad de Tipos de Alta Fidelidad:** El filtrado de IDs de rol utiliza un predicado de tipo explícito (`id is WorkspaceRoleId`). Esto garantiza que la lógica de comparación opere exclusivamente con los IDs de rol canónicos, eliminando la ambigüedad y satisfaciendo al compilador de TypeScript.
4.  **Consulta por ID:** La consulta a la base de datos selecciona y compara el `role_id` del miembro del workspace, adhiriéndose estrictamente al esquema "Lean Database".

## 3. Contrato de API

-   **Entrada:** `userId`, `workspaceId`, `requiredRoles` (como `WorkspaceRoleName[]`).
-   **Salida:** Una promesa que resuelve a `boolean`.

/**
 * =====================================================================
 *                           ZONA DE MEJORAS
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Función `hasAppPermission`**: Crear una función `hasAppPermission(userId, requiredRoles)` que verifique el `app_role` del usuario en la tabla `profiles` para gestionar permisos globales.
 * 2.  **Permisos a Nivel de Recurso**: Extender la lógica para manejar permisos más granulares, como `hasSitePermission`.
 * 3.  **Revalidación Activa de Caché**: Las Server Actions que modifican `workspace_members` deben invocar `revalidateTag('permissions')`.
 * 4.  **Logging de Auditoría de Permisos**: Para sistemas de alta seguridad, cada fallo de permiso (`return false`) podría registrar un evento de auditoría.
 * 5.  **Internacionalización de la Documentación:** Traducir este documento espejo.
 * =====================================================================
 */
// .docs-espejo/lib/data/permissions.md