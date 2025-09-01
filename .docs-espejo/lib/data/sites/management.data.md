// .docs-espejo/lib/data/sites/management.data.md
/**
 * @file management.data.md
 * @description Documento Espejo para el aparato de datos de gestión de sitios.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 3.0.0
 */
# Manifiesto Conceptual: Aparato de Datos - Gestión de Sitios

## 1. Rol Estratégico y Propósito
Este aparato es el **módulo de acceso a datos (DAO)** atómico y soberano para las operaciones de gestión de la entidad `sites`. Su responsabilidad es encapsular las consultas a la base de datos relacionadas con la gestión de sitios, aplicando lógica de negocio como paginación, filtrado, ordenamiento y conteo.

## 2. Arquitectura del Contenido
- **Factoría de Consultas Pura:** La lógica para construir la consulta de búsqueda de sitios se aísla en una función pura `buildSiteSearchQuery`.
- **Cacheo de Datos de Élite:** Las funciones de lectura (`getSiteById`) utilizan `unstable_cache` de `next/cache`.
- **API de Datos Clara:** Expone funciones con contratos de datos explícitos.
- **Funciones de Agregación Atómicas:** La nueva función `getActiveSitesCount` encapsula la lógica de negocio para contar sitios que no están archivados, proveyendo una API semántica para métricas del dashboard.

## 3. Zona de Mejoras Futuras
1. **Cacheo para `getSitesByWorkspaceId`**: La función principal de paginación es candidata para `unstable_cache`.
2. **Inyección de Dependencias para Pruebas**: Aceptar una instancia de Supabase para facilitar las pruebas.
3. **Tipado de Retorno con Zod**: Usar `.parse()` para garantizar la forma de los datos.
4. **Revalidación por Etiqueta**: Las Server Actions que modifican sitios deben invocar `revalidateTag('sites')`.
5. **Manejo de Errores Granular**: Devolver un objeto `Result` (`{ data, error }`).
6. **Internacionalización de la Documentación:** Traducir este documento espejo.
// .docs-espejo/lib/data/sites/management.data.md