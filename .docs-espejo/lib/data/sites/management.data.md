// .docs-espejo/lib/data/sites/management.data.ts.md
/**
 * @file .docs-espejo/lib/data/sites/management.data.ts.md
 * @description Documento Espejo y SSoT conceptual para el aparato de datos `sites.management`.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
# Manifiesto Conceptual: Aparato de Datos `sites.management`

## 1. Propósito y Responsabilidad Única (PRU)

El propósito de este aparato de datos es ser la **Única Fuente de Verdad para todas las operaciones de LECTURA relacionadas con la gestión de sitios** para usuarios autenticados dentro del contexto del Dashboard. Sus responsabilidades atómicas son:
1.  Obtener una lista paginada, filtrada y ordenada de sitios pertenecientes a un workspace (`getSitesByWorkspaceId`).
2.  Obtener los datos básicos de un sitio específico por su ID (`getSiteById`).
3.  Obtener un conteo de los sitios activos (no archivados) para un workspace (`getActiveSitesCount`).

Este aparato implementa una estrategia de cacheo de alto rendimiento con `unstable_cache` para minimizar las consultas a la base de datos.

## 2. Arquitectura y Lógica de Operación

### 2.1. `buildSiteSearchQuery` (Helper Privado)
-   **Propósito:** Encapsula la lógica de construcción de la consulta Supabase, adhiriéndose al SRP.
-   **Lógica:** Construye una consulta sobre la vista `sites_with_campaign_counts`. Aplica dinámicamente filtros para búsqueda de texto (`ilike`), estado (`status_id`), y ordenamiento (`order`).

### 2.2. `getSitesByWorkspaceId`
-   **Propósito:** Orquesta la obtención de la lista de sitios.
-   **Lógica:** Calcula la paginación (`from`, `to`) y delega la construcción de la consulta a `buildSiteSearchQuery`. No está cacheada directamente para permitir la máxima flexibilidad de filtros.

### 2.3. `getSiteById`
-   **Propósito:** Obtiene un único sitio por su ID.
-   **Arquitectura de Cacheo de Élite:** Implementa un patrón de **cacheo dinámico**. La función principal no está cacheada, pero invoca a `cache` internamente. Esto permite construir los `keyParts` y `tags` de forma dinámica utilizando el `siteId` proporcionado (ej. `tags: ['sites', \`site:${siteId}\`]`). Este patrón es la SSoT para el cacheo de recursos individuales, ya que permite una invalidación granular y precisa.

### 2.4. `getActiveSitesCount`
-   **Propósito:** Proporciona una consulta optimizada para obtener solo un conteo.
-   **Lógica:** Utiliza `{ count: "exact", head: true }` para instruir a PostgREST que solo devuelva el conteo total sin los datos de las filas, resultando en una consulta extremadamente rápida y eficiente.

## Zona de Melhorias Futuras

1.  **Validación con Zod**: Implementar schemas de Zod para los tipos de retorno y usar `.parse()` en los datos de Supabase para garantizar la seguridad de tipos en tiempo de ejecución.
2.  **RPC para Consultas Complejas**: Convertir `getSitesByWorkspaceId` a una función RPC de PostgreSQL para centralizar la lógica de negocio en la base de datos y potencialmente mejorar el rendimiento.
3.  **Inyección de Dependencias**: Permitir la inyección de un cliente Supabase para facilitar las pruebas unitarias aisladas.
4.  **Seguridad en Ordenamiento**: Validar el parámetro de ordenamiento contra una lista de columnas permitidas para prevenir cualquier vector de ataque.
5.  **Cacheo para `getActiveSitesCount`**: Envolver la función `getActiveSitesCount` con `cache` y un tag dinámico (`sites-count:${workspaceId}`) para optimizar su rendimiento.
6.  **Internacionalización de la Documentación**: Traducir este documento espejo.
7.  **Pruebas de Integración para el Caché**: Escribir pruebas específicas que validen que el cacheo y la invalidación por tags funcionan como se espera.
8.  **Full Text Search**: Implementar la búsqueda de texto completo de PostgreSQL en `buildSiteSearchQuery` para una búsqueda más performante y relevante.
9.  **Abstracción de `buildQuery`**: El helper `buildSiteSearchQuery` podría ser generalizado para ser reutilizado por otros módulos de datos que requieran filtros similares.
10. **Tipos de Retorno Dedicados**: Crear tipos específicos en `sites/types.ts` para los retornos de cada función en lugar de usar `Pick` o tipos anónimos, mejorando la legibilidad.
// .docs-espejo/lib/data/sites/management.data.ts.md