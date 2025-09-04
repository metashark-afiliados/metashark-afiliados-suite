// .docs/functionality/001_WORKSPACES_DOMAIN_MANIFEST.md
/**
 * @file .docs/functionality/001_WORKSPACES_DOMAIN_MANIFEST.md
 * @description Manifiesto Funcional y Arquitectónico del Dominio "Workspaces" v1.0.
 *              Esta es la SSoT que define el propósito, la arquitectura y la lógica
 *              de negocio para la funcionalidad de Workspaces. Reemplaza a la
 *              versión anterior en la raíz de `/functionality`.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Funcional y Arquitectónico: Dominio "Workspaces"

## 1. Rol Estratégico y Propósito de Negocio
*   **Referencia a la Constitución:** AD-005.
*   El dominio `Workspaces` es el **pilar de la arquitectura multi-tenant y colaborativa** de ConvertiKit. Su propósito es proporcionar un contenedor aislado y seguro donde un usuario o un equipo pueden organizar sus activos (`Sites`, `Creations`, `Brand Kits`), gestionar permisos y colaborar de forma eficiente.

## 2. Arquitectura Técnica y de Datos

### 2.1. Modelo de Entidad-Relación (Base de Datos)
*   **SSoT de Datos:** Tablas `workspaces`, `workspace_members`, `invitations`.
*   **Diagrama de Entidad-Relación (Mermaid):**
    ```mermaid
    erDiagram
        profiles   ||--|{ workspace_members : "es miembro de"
        workspaces ||--|{ workspace_members : "tiene"
        workspaces ||--|{ invitations : "tiene"
        workspaces ||--o{ sites : "contiene"
    ```

### 2.2. Arquitectura de Componentes (Frontend)
*   **SSoT de Lógica de UI:** Hook soberano `useWorkspaceManager`.
*   **Componentes Principales:**
    *   `WorkspaceSwitcher`: Orquestador principal.
    *   `WorkspaceTrigger`: Botón que muestra el workspace activo y permite edición en línea.
    *   `WorkspacePopoverContent`: Contenido del popover con lista y acciones.
    *   `Dialogs`: Modales para `Crear`, `Invitar`, `Renombrar` y `Eliminar`.

## 3. Flujos de Lógica de Negocio (Server Actions)
*   **SSoT de Lógica de Negocio:** `src/lib/actions/workspaces.actions.ts`.
*   **Referencia a la Constitución:** AD-003.
*   **Flujos Críticos:**
    1.  **Selección de Contexto (`setActiveWorkspaceAction`):** Establece una cookie `httpOnly` (`active_workspace_id`) que define el contexto operativo del usuario.
    2.  **Creación de Workspace (`createWorkspaceAction`):** Implementado como una RPC transaccional que inserta en `workspaces` y `workspace_members`, garantizando la atomicidad.
    3.  **Invitación de Miembro (`sendWorkspaceInvitationAction`):** Valida permisos del invitador y crea un registro en la tabla `invitations`.

## 4. Roadmap de Evolución del Dominio
*   **Completado:** CRUD básico, sistema de roles (`owner`, `admin`, `member`, `viewer`), sistema de invitaciones, persistencia de contexto.
*   **Próximos Pasos (Vigente):**
    1.  Implementar la `Server Action` `transferOwnershipAction(workspaceId, newOwnerId)`.
    2.  Crear la UI para la gestión avanzada de miembros y configuraciones en `/dashboard/settings/workspace`.
    3.  Conectar un `workspace` a la futura tabla `subscriptions` para habilitar planes de equipo.
// .docs/functionality/001_WORKSPACES_DOMAIN_MANIFEST.md