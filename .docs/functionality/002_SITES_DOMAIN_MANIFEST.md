// .docs/functionality/002_SITES_DOMAIN_MANIFEST.md
/**
 * @file .docs/functionality/002_SITES_DOMAIN_MANIFEST.md
 * @description Manifiesto Funcional y Arquitectónico del Dominio "Sites" v1.0.
 *              Esta es la SSoT que define el propósito, la arquitectura y la
 *              lógica de negocio para la funcionalidad de Sitios. Reemplaza a la
 *              versión anterior.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Funcional y Arquitectónico: Dominio "Sites"

## 1. Rol Estratégico y Propósito de Negocio
*   **Referencia a la Constitución:** AD-005.
*   El dominio `Sites` representa el **lienzo de publicación** para los activos de marketing de un usuario. Un `Site` es una entidad que posee un subdominio único y actúa como el contenedor para un conjunto de `Campaigns` relacionadas.
*   **Filosofía:** "Publicación Desacoplada y Flexible".

## 2. Funcionalidades Implementadas
*   **CRUD de Sitios:** Creación, lectura, actualización (nombre) y eliminación de sitios.
*   **Validación de Subdominio en Tiempo Real:** La UI utiliza el hook `useSubdomainAvailability` para consultar una `Server Action` (`checkSubdomainAvailabilityAction`) de forma `debounced`.
*   **Gestión de Vistas:** La página "Mis Sitios" permite alternar entre vista de cuadrícula (`SitesGrid`) y tabla (`SitesTable`), persistiendo la preferencia en `localStorage`.
*   **Filtros y Búsqueda:** La interfaz permite filtrar sitios por estado y ordenarlos, sincronizando el estado con los `searchParams` de la URL.

## 3. Arquitectura Técnica y de Datos

### 3.1. Modelo de Entidad-Relación (Base de Datos)
*   **SSoT de Datos:** Tabla `sites`.
*   **Diagrama (Mermaid):**
    ```mermaid
    erDiagram
        workspaces ||--|{ sites : "contiene"
        sites      ||--|{ campaigns : "aloja"
        profiles   ||--o{ sites : "es propietario de"
    ```

### 3.2. Arquitectura de Componentes (Frontend)
*   **SSoT de Lógica de UI:** Hook orquestador `useSitesPage`.
*   **Componentes Principales:**
    *   `sites-client.tsx`: Orquestador de UI que ensambla la vista.
    *   `SitesHeader`: Encabezado con filtros, switcher de vista y búsqueda.
    *   `PaginatedResourceView`: Componente genérico que gestiona el renderizado y la paginación.
    *   `SiteCard` / `SitesTable`: Componentes de presentación para las vistas.

## 4. Flujos de Lógica de Negocio (Server Actions)
*   **SSoT de Lógica de Negocio:** `src/lib/actions/sites.actions.ts`.
*   **Flujos Críticos:**
    1.  **Creación de Sitio (`createSiteAction`):** Valida el payload y permisos, inserta en `sites`, maneja errores de unicidad y revalida el path.
    2.  **Edición en Línea de Nombre (`updateSiteNameAction`):** Valida el payload y permisos, actualiza el campo `name` en `sites` y revalida paths.

## 5. Roadmap de Evolución del Dominio
*   **Completado:** CRUD, validación de subdominio, vistas, filtros, búsqueda, edición en línea.
*   **Próximos Pasos (Vigente):**
    1.  Implementar el flujo para **Dominios Personalizados**.
    2.  Crear `Server Action` para generar **Previsualizaciones de Sitios**.
    3.  Implementar `Server Action` para **Transferir Sitios** entre workspaces.
// .docs/functionality/002_SITES_DOMAIN_MANIFEST.md