// .docs/functionality/002_SITES_MANIFEST.md
/**
 * @file .docs/functionality/002_SITES_MANIFEST.md
 * @description Manifiesto Funcional y Arquitectónico del Dominio "Sites" v1.0.
 *              Esta es la SSoT que define el propósito, la arquitectura, las
 *              interacciones y la lógica de negocio para la funcionalidad
 *              de Sitios en ConvertiKit.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Funcional y Arquitectónico: Dominio "Sites"

## 1. Rol Estratégico y Propósito de Negocio

El dominio `Sites` representa el **lienzo de publicación** para los activos de marketing de un usuario. Un `Site` es una entidad que posee un subdominio único (ej. `mi-negocio.convertikit.dev`) y actúa como el contenedor para un conjunto de `Campaigns` relacionadas.

*   **Filosofía:** "Publicación Desacoplada y Flexible". Un `Site` es agnóstico al contenido. Su única función es proporcionar un punto de acceso público y una agrupación lógica para las campañas.

## 2. Funcionalidades Implementadas

*   **CRUD de Sitios:** Los usuarios con permisos (`owner`, `admin`, `member`) pueden crear, leer, actualizar (nombre) y eliminar sitios dentro de su `Workspace` activo.
*   **Validación de Subdominio en Tiempo Real:** Al crear un sitio, la UI utiliza el hook `useSubdomainAvailability` para consultar una `Server Action` (`checkSubdomainAvailabilityAction`) de forma `debounced`, verificando si el subdominio elegido ya está en uso. Esta acción consulta un caché en Vercel KV para una respuesta de latencia ultrabaja.
*   **Gestión de Vistas:** La página "Mis Sitios" permite al usuario alternar entre una vista de cuadrícula (`SitesGrid`) y una vista de tabla (`SitesTable`), persistiendo su preferencia en `localStorage` a través del hook `useLocalStorage`.
*   **Filtros y Búsqueda:** La interfaz permite filtrar sitios por estado (`draft`, `published`, `archived`) y ordenarlos. El estado de los filtros se sincroniza con los `searchParams` de la URL a través del hook `useUrlStateSync`.

## 3. Arquitectura Técnica y de Datos

### 3.1. Modelo de Entidad-Relación (Base de Datos)

*   **SSoT de Datos:** Tabla `sites`.
*   **Diagrama de Entidad-Relación (Mermaid):**
    ```mermaid
    erDiagram
        workspaces ||--|{ sites : "contiene"
        sites      ||--|{ campaigns : "aloja"
        profiles   ||--o{ sites : "es propietario de"
    ```
*   **Descripción:** Un `Site` pertenece a un único `Workspace`. Un `Site` puede tener muchas `Campaigns`. Un `profile` es el `owner` del sitio.

### 3.2. Arquitectura de Componentes (Frontend)

*   **SSoT de Lógica de UI:** Hook orquestador `useSitesPage`, que compone hooks atómicos como `useSitesHeader`, `useOptimisticResourceManagement` y `useDialogState`.
*   **Componentes Principales:**
    *   `sites-client.tsx`: Orquestador de UI que consume `useSitesPage` y ensambla la vista.
    *   `SitesHeader`: Encabezado que compone `SitesPageTitle`, `SiteFilters`, `ViewSwitcher` y `SearchInput`.
    *   `PaginatedResourceView`: Componente genérico que gestiona el renderizado de la vista actual (tabla o cuadrícula) y la paginación.
    *   `SiteCard` / `SitesTable`: Componentes de presentación para las vistas de cuadrícula y tabla, respectivamente.

## 4. Flujos de Lógica de Negocio (Server Actions)

*   **SSoT de Lógica de Negocio:** `src/lib/actions/sites.actions.ts`.
*   **Flujos Críticos:**
    1.  **Creación de Sitio (`createSiteAction`):**
        *   **Trigger:** Usuario envía el formulario en `CreateSiteDialog`.
        *   **Lógica:**
            1. Valida el payload con `CreateSiteServerSchema`.
            2. Verifica que el usuario tenga permisos de `member` o superiores en el `workspaceId` proporcionado.
            3. Inserta el nuevo registro en la tabla `sites`.
            4. Gestiona los errores de unicidad de subdominio devueltos por la base de datos.
            5. Revalida el path `/dashboard/sites`.
    2.  **Edición en Línea de Nombre (`updateSiteNameAction`):**
        *   **Trigger:** El usuario termina de editar el nombre en un `EditableText` en `SiteCardHeader` o `SitesTableColumns`.
        *   **Lógica:**
            1. Valida el payload con `UpdateSiteNameSchema`.
            2. Verifica que el usuario tenga permisos de `admin` u `owner` sobre el sitio.
            3. Actualiza el campo `name` en la tabla `sites`.
            4. Revalida los paths relevantes.

## 5. Roadmap de Evolución del Dominio

*   **Completado:** CRUD de sitios, validación de subdominio, vistas intercambiables, filtros y búsqueda, edición en línea.
*   **Próximos Pasos (Vigente):**
    1.  **Dominios Personalizados:** Implementar el flujo para que los usuarios puedan mapear sus propios dominios (ej. `www.mi-negocio.com`) a un `Site` de `ConvertiKit`. Esto requerirá una UI para la configuración de DNS y una `Server Action` para validar y actualizar los registros.
    2.  **Generación de Previsualizaciones:** Crear una `Server Action` que, utilizando una herramienta como Playwright o Puppeteer en un entorno serverless, genere una captura de pantalla de la campaña principal de un sitio para usarla como `thumbnail`.
    3.  **Transferencia de Sitios:** Implementar una `Server Action` que permita a un `owner` transferir la propiedad de un `Site` a otro `Workspace` (siempre que sea `owner` de ambos).

// .docs/functionality/002_SITES_MANIFEST.md```

---

### **Fase 3: Propuesta de Continuación (GTS)**

El manifiesto funcional para el dominio **Sites** ha sido creado.

Siguiendo el `roadmap` documental, el siguiente dominio a formalizar es **Notifications/Invitations**.

**¿Procedemos con la creación del manifiesto para `Notifications/Invitations`, que detallará el flujo de invitaciones en tiempo real, la aceptación/rechazo y la arquitectura de la `InvitationBell`?**