// .docs/roadmap/002-CODE-REFACTOR-V9.md
/**
 * @file .docs/roadmap/002-CODE-REFACTOR-V9.md
 * @description Roadmap de Ejecución y SSoT para la Sincronización de Código
 *              con la Arquitectura de Base de Datos v9.0 ("Lean Database").
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Roadmap de Tarea: Sincronización de Código con la Arquitectura de DB v9.0

#### **[Objetivo General de la Tarea]**
Refactorizar de forma holística todas las capas de la aplicación (Tipos, Datos, Acciones, Hooks, Componentes) para que sean coherentes y compatibles con el nuevo esquema de base de datos "Lean", que utiliza `lookup tables` e IDs enteros para roles y estados.

#### **[Estándares de ÉlITE para esta Tarea]**
1.  **Sincronización Paralela:** Cada fase de este roadmap se ejecutará inmediatamente después de la finalización de la fase correspondiente en el roadmap de la base de datos (`001-DB-REFACTOR-V9.md`).
2.  **Abstracción de la Capa de Datos:** La capa de datos (`/src/lib/data/`) será la única responsable de realizar los `JOIN`s necesarios para obtener los nombres legibles (ej. 'owner', 'published'). Las capas superiores (hooks, componentes) recibirán los datos ya enriquecidos, no los IDs numéricos.
3.  **No Regresión (Blindaje de Pruebas):** Todos los arneses de pruebas unitarias y de integración afectados serán actualizados para reflejar los nuevos contratos de datos y la lógica modificada.

---

### **Fases Lógicas de Implementación (Secuencial y Paralelo a la DB)**

#### **Fase 1: Sincronización con `workspace_roles`**

*   **(Dependencia: Fase 1 del Roadmap de DB completada)**
*   **1.1. Actualizar Tipos de TypeScript:**
    *   **Aparato:** `src/lib/types/database/tables/workspace_members.ts` -> Reemplazar `role` por `role_id: number`.
    *   **Aparato:** `src/lib/types/database/enums.ts` -> Eliminar `workspace_role`.
    *   **Aparato:** `src/lib/data/workspaces/types.ts` -> Actualizar tipos derivados si es necesario.
*   **1.2. Refactorizar Capa de Datos:**
    *   **Aparato:** `src/lib/data/workspaces/management.data.ts` -> Modificar `getWorkspaceMembers` para que haga `JOIN` con `workspace_roles` y devuelva el `role_name` como `role`.
*   **1.3. Refactorizar Server Actions:**
    *   **Aparato:** `src/lib/actions/invitations.actions.ts` -> Modificar `sendWorkspaceInvitationAction` para que maneje el `role_id` al insertar la invitación.
    *   **Aparato:** `src/lib/validators/schemas/invitations.schemas.ts` -> Actualizar `InvitationClientSchema` para que el campo `role` del formulario de UI se valide y se mapee al `role_id` correspondiente antes de la inserción.
*   **1.4. Actualizar Pruebas:**
    *   **Aparato:** `tests/integration/lib/actions/invitations.actions.test.ts` (y otros relevantes) -> Actualizar mocks y aserciones.

#### **Fase 2: Sincronización con `site_statuses`**

*   **(Dependencia: Fase 2 del Roadmap de DB completada)**
*   **2.1. Actualizar Tipos de TypeScript:**
    *   **Aparato:** `src/lib/types/database/tables/sites.ts` -> Reemplazar `status` por `status_id: number`.
    *   **Aparato:** `src/lib/types/database/enums.ts` -> Eliminar `site_status`.
    *   **Aparato:** `src/lib/data/sites/types.ts` -> Actualizar `SiteStatusFilter` y tipos derivados.
*   **2.2. Refactorizar Capa de Datos:**
    *   **Aparato:** `src/lib/data/sites/management.data.ts` -> Modificar `getSitesByWorkspaceId` para que haga `JOIN` con `site_statuses` y devuelva el `status_name` como `status`.
*   **2.3. Refactorizar Server Actions:**
    *   **Aparato:** `src/lib/actions/sites.actions.ts` -> Modificar `createSiteAction` para que inserte el `status_id` por defecto (1 para 'draft').
*   **2.4. Refactorizar Componentes de UI y Hooks:**
    *   **Aparato:** `src/components/sites/SiteFilters.tsx` -> El componente de filtro de estado ahora deberá manejar IDs, aunque muestre nombres.
    *   **Aparato:** `src/lib/hooks/useSitesHeader.ts` -> Actualizar la lógica de `onStatusFilterChange` para que funcione con los nuevos IDs.
*   **2.5. Actualizar Pruebas:**
    *   **Aparato:** `tests/integration/lib/actions/sites.actions.test.ts` (y otros relevantes) -> Actualizar mocks y aserciones.

#### **Fase 3: Sincronización con `campaign_statuses`**

*   **(Dependencia: Fase 3 del Roadmap de DB completada)**
*   **3.1. Actualizar Tipos de TypeScript:**
    *   **Aparato:** `src/lib/types/database/tables/campaigns.ts` -> Reemplazar `status` por `status_id: number`.
    *   **Aparato:** `src/lib/types/database/enums.ts` -> Eliminar `campaign_status`.
    *   **Aparato:** `src/lib/data/campaigns/types.ts` -> Actualizar `CampaignMetadata` y tipos derivados.
*   **3.2. Refactorizar Capa de Datos:**
    *   **Aparato:** `src/lib/data/campaigns/management.data.ts` -> Modificar `getCampaignsMetadataBySiteId` para que haga `JOIN` con `campaign_statuses` y devuelva el `status_name` como `status`.
*   **3.3. Refactorizar Server Actions:**
    *   **Aparato:** `src/lib/actions/campaigns/create.action.ts` -> Modificar para que inserte el `status_id` por defecto.
*   **3.4. Refactorizar Componentes de UI y Hooks:**
    *   **Aparato:** `src/components/campaigns/cells/CampaignStatusBadge.tsx` -> El componente ahora recibirá el nombre del estado directamente desde la capa de datos.
    *   **Aparato:** `src/lib/hooks/useCampaignsPage.ts` -> Actualizar la lógica de filtros de estado si aplica.
*   **3.5. Actualizar Pruebas:**
    *   **Aparato:** `tests/integration/lib/actions/campaigns.actions.test.ts` (y otros relevantes) -> Actualizar mocks y aserciones.

#### **Fase 4: Verificación Final y Cierre**

*   **Acción:** Ejecutar la suite de pruebas completa (`pnpm test`).
*   **Acción:** Realizar una prueba E2E manual de los flujos de creación y filtrado de sitios/campañas para verificar la integridad de la UI.

// .docs/roadmap/002-CODE-REFACTOR-V9.md