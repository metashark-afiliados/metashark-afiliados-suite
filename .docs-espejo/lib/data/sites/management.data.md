// .docs/espejo/lib/data/sites/management.data.md
/**
 * @file management.data.md
 * @description Documento Espejo para el aparato de datos de gestión de sitios.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 2.0.0
 */
# Manifiesto Conceptual: Aparato de Datos - Gestión de Sitios

## 1. Rol Estratégico y Propósito
Este aparato es el **módulo de acceso a datos (DAO)** atómico y soberano para las operaciones de gestión de la entidad `sites` (ej. las que ocurren en el Dashboard). Su única responsabilidad es encapsular las consultas a la base de datos relacionadas con la obtención de listas de sitios y detalles de sitios específicos para un usuario autenticado, aplicando la lógica de negocio como paginación, filtrado y ordenamiento.

## 2. Arquitectura del Contenido
1.  **Factoría de Consultas Pura:** La lógica compleja para construir la consulta de búsqueda de sitios se aísla en una función pura `buildSiteSearchQuery`, mejorando la legibilidad y el SRP.
2.  **Cacheo de Datos de Élite:** Las funciones de lectura (`getSiteById`) utilizan `unstable_cache` de `next/cache`, que es la SSoT canónica para el cacheo de datos en Next.js. Esto previene consultas duplicadas a la base de datos dentro del mismo ciclo de petición-respuesta.
3.  **API de Datos Clara:** Expone funciones (`getSitesByWorkspaceId`, `getSiteById`) con contratos de datos explícitos (`SiteWithCampaignCount`, `SiteBasicInfo`) definidos en la SSoT de tipos del módulo (`./types.ts`).

## 3. Contrato de API
- **Entrada:** IDs de entidad (ej. `workspaceId`), opciones de paginación y filtro.
- **Salida:** Promesas que resuelven a los contratos de datos definidos, o `null` si no se encuentran resultados.

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Cacheo para `getSitesByWorkspaceId`**: La función principal de paginación también es candidata para `unstable_cache`, pero requiere una clave de caché dinámica más compleja para ser efectiva. Se propondrá esta optimización avanzada en una futura épica de rendimiento.
 * 2.  **Inyección de Dependencias para Pruebas**: Para una testeabilidad de élite, las funciones podrían aceptar una instancia del cliente Supabase como parámetro opcional, facilitando la inyección de mocks en pruebas unitarias.
 * 3.  **Tipado de Retorno con Zod**: En lugar de aserciones `as`, se podrían crear schemas Zod para los tipos de retorno y usar `.parse()` para garantizar la forma de los datos en tiempo de ejecución.
 * 4.  **Revalidación por Etiqueta**: Las Server Actions que modifican sitios deben invocar `revalidateTag('sites')` para invalidar activamente los cachés.
 * 5.  **Manejo de Errores Granular**: Las funciones podrían devolver un objeto `Result` (ej. `{ data, error }`) en lugar de lanzar una excepción, para dar más contexto a la capa superior.
 * =====================================================================
 */
// .docs/espejo/lib/data/sites/management.data.md