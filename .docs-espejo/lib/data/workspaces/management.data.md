// .docs-espejo/lib/data/workspaces/management.data.md
/**
 * @file management.data.md
 * @description Documento Espejo para el aparato de datos de gestión de workspaces.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 2.0.0
 */
# Manifiesto Conceptual: Aparato de Datos - Gestión de Workspaces

## 1. Rol Estratégico y Propósito
Este aparato es el **módulo de acceso a datos (DAO)** atómico y soberano para las operaciones de gestión de la entidad `workspaces`. Su única responsabilidad es encapsular las consultas a la base de datos para obtener los workspaces de un usuario, los detalles de un workspace específico y la lista de sus miembros. Es una pieza fundamental de la arquitectura multi-tenant.

## 2. Arquitectura del Contenido
1.  **Cacheo de Datos de Élite:** Todas las funciones de lectura (`getWorkspacesByUserId`, `getWorkspaceById`) utilizan `unstable_cache` de `next/cache`, que es la SSoT canónica para el cacheo de datos en Next.js. Esto previene consultas duplicadas a la base de datos dentro del mismo ciclo de petición-respuesta y asegura la compatibilidad con todos los runtimes.
2.  **API de Datos Clara:** Expone funciones con contratos de datos explícitos (`Workspace`, `WorkspaceMember`), definidos en la SSoT de tipos del módulo (`./types.ts`).
3.  **Inyección de Dependencias:** Las funciones aceptan una instancia opcional del cliente Supabase, lo que permite la inyección de mocks para pruebas unitarias y de integración aisladas.

## 3. Contrato de API
- **Entrada:** IDs de entidad (ej. `userId`, `workspaceId`).
- **Salida:** Promesas que resuelven a los contratos de datos definidos, o `null`/array vacío si no se encuentran resultados.

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Cacheo de `getWorkspaceMembers`**: La función `getWorkspaceMembers` es candidata para `unstable_cache` para optimizar el rendimiento, ya que la lista de miembros no cambia con alta frecuencia.
 * 2.  **Tipado de Retorno con Zod**: En lugar de aserciones de tipo, se podrían crear schemas Zod para los tipos de retorno y usar `.parse()` para garantizar la forma de los datos en tiempo de ejecución.
 * 3.  **Revalidación por Etiqueta**: Las Server Actions que modifican workspaces o sus miembros deben invocar `revalidateTag('workspaces')` o `revalidateTag('workspace-members')` para invalidar activamente los cachés.
 * 4.  **Función `getWorkspaceOwner`**: Añadir una función específica y optimizada para obtener solo el propietario de un workspace.
 * 5.  **Manejo de Errores Granular**: Las funciones podrían devolver un objeto `Result` (ej. `{ data, error }`) en lugar de un array vacío o `null` en caso de error, para dar más contexto a la capa superior.
 * =====================================================================
 */
// .docs-espejo/lib/data/workspaces/management.data.md