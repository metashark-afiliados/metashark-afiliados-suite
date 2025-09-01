// .docs-espejo/lib/data/workspaces/management.data.md
/**
 * @file management.data.md
 * @description Documento Espejo para el aparato de datos de gestión de workspaces.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 3.0.0
 */
# Manifiesto Conceptual: Aparato de Datos - Gestión de Workspaces

## 1. Rol Estratégico y Propósito
Este aparato es el **módulo de acceso a datos (DAO)** atómico y soberano para la entidad `workspaces`. Su única responsabilidad es encapsular las consultas a la base de datos para la gestión de workspaces, incluyendo la obtención de miembros y sus roles.

## 2. Arquitectura del Contenido
- **Sincronización con "Lean Database" (AD-002):** La función `getWorkspaceMembers` ha sido actualizada para realizar un `JOIN` con la `lookup table` `workspace_roles`, enriqueciendo los datos de los miembros con el nombre de su rol.
- **Cacheo de Datos de Élite:** Utiliza `unstable_cache` para optimizar lecturas.
- **API de Datos Clara:** Expone funciones con contratos de datos explícitos.
- **Inyección de Dependencias:** Acepta una instancia de Supabase opcional para facilitar las pruebas.

## 3. Zona de Mejoras Futuras
1. **Cacheo de `getWorkspaceMembers`**: La función es candidata para `unstable_cache`.
2. **Tipado con Zod:** Usar `.parse()` para garantizar la forma de los datos.
3. **Revalidación por Etiqueta:** Invocar `revalidateTag('workspaces')` en las Server Actions.
4. **Función `getWorkspaceOwner`**: Añadir una función específica para obtener solo el propietario.
5. **Manejo de Errores Granular:** Devolver un objeto `Result` (`{ data, error }`).
6. **Internacionalización de la Documentación:** Traducir este documento espejo.
// .docs-espejo/lib/data/workspaces/management.data.md