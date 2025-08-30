// .docs-espejo/lib/data/permissions.md
/**
 * @file permissions.md
 * @description Documento Espejo para el aparato de datos de lógica de permisos.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 2.0.0
 */
# Manifiesto Conceptual: Aparato de Datos - Lógica de Permisos

## 1. Rol Estratégico y Propósito
Este aparato es el **módulo de acceso a datos (DAO)** atómico y soberano para la lógica de autorización. Su única responsabilidad es encapsular las consultas a la base de datos que verifican si un usuario posee un rol específico dentro de un contexto (ej. un workspace). Es una pieza de infraestructura de seguridad crítica, consumida por guardianes de seguridad de más alto nivel.

## 2. Arquitectura del Contenido
1.  **Cacheo de Datos de Élite:** La función de lectura `hasWorkspacePermission` utiliza `unstable_cache` de `next/cache`, la SSoT canónica para el cacheo de datos en Next.js. Esto previene consultas de permisos duplicadas dentro de la misma petición y asegura la compatibilidad con todos los runtimes. Se utilizan etiquetas (`tags: ["permissions"]`) para permitir la invalidación de caché granular y proactiva.
2.  **API de Lógica Pura:** Expone una función (`hasWorkspacePermission`) con un contrato de API claro y booleano, abstraendo la complejidad de la consulta a la base de datos.

## 3. Contrato de API
- **Entrada:** `userId`, `workspaceId`, `requiredRoles`.
- **Salida:** Una promesa que resuelve a `boolean`.

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Función `hasAppPermission`**: Crear una función `hasAppPermission(userId, requiredRoles)` que verifique el `app_role` del usuario en la tabla `profiles` para gestionar permisos globales (ej. 'admin', 'developer').
 * 2.  **Permisos a Nivel de Recurso**: Extender la lógica para manejar permisos más granulares, como `hasSitePermission` o `hasCampaignPermission`, si el modelo de roles se vuelve más complejo.
 * 3.  **Revalidación Activa de Caché**: Las Server Actions que modifican `workspace_members` deben invocar `revalidateTag('permissions')` para invalidar este caché.
 * 4.  **Tipado de `requiredRoles`**: El tipo `WorkspaceRole[]` podría ser mejorado para asegurar que no sea un array vacío, previniendo llamadas sin sentido.
 * 5.  **Logging de Auditoría de Permisos**: Para sistemas de alta seguridad, cada fallo de permiso (`return false`) podría registrar un evento de auditoría.
 * =====================================================================
 */
// .docs-espejo/lib/data/permissions.md