// .docs/functionality/001_WORKSPACES_MANIFEST.md
/**
 * @file .docs/functionality/001_WORKSPACES_MANIFEST.md
 * @description Manifiesto Funcional y Arquitectónico del Dominio "Workspaces" v1.0.
 *              Esta es la Única Fuente de Verdad (SSoT) que define el propósito,
 *              la arquitectura, las interacciones y la lógica de negocio para
 *              la funcionalidad de Workspaces en ConvertiKit.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Funcional y Arquitectónico: Dominio "Workspaces"

## 1. Rol Estratégico y Propósito de Negocio

El dominio `Workspaces` es el **pilar de la arquitectura multi-tenant y colaborativa** de `ConvertiKit`. Su propósito es proporcionar un contenedor aislado y seguro donde un usuario o un equipo pueden organizar sus activos (`Sites`, `Creations`, `Brand Kits`), gestionar permisos y colaborar de forma eficiente. Estratégicamente, es la entidad que permite el modelo de negocio B2B y de agencias.

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
*   **Descripción:** Un `profile` puede ser `member` de muchos `workspaces`, y un `workspace` puede tener muchos `members`. La relación se define en la tabla `workspace_members`, que también almacena el `role` del usuario en ese contexto específico.

### 2.2. Arquitectura de Componentes (Frontend)

*   **SSoT de Lógica de UI:** Hook soberano `useWorkspaceManager`.
*   **Componentes Principales:**
    *   `WorkspaceSwitcher`: Orquestador principal que renderiza el `trigger` y el `popover`.
    *   `WorkspaceTrigger`: Botón que muestra el workspace activo y permite la edición en línea del nombre.
    *   `WorkspacePopoverContent`: Contenido del popover, que ensambla `WorkspaceList` y `WorkspaceActions`.
    *   `Dialogs`: Componentes modales para `Crear`, `Invitar`, `Renombrar` y `Eliminar`.

## 3. Flujos de Lógica de Negocio (Server Actions)

*   **SSoT de Lógica de Negocio:** `src/lib/actions/workspaces.actions.ts`.
*   **Flujos Críticos:**
    1.  **Selección de Contexto (`setActiveWorkspaceAction`):**
        *   **Trigger:** Usuario selecciona un workspace en `WorkspaceList`.
        *   **Lógica:** La acción establece una cookie `httpOnly` (`active_workspace_id`) con el ID del workspace seleccionado.
        *   **Efecto:** El middleware y los Server Components leen esta cookie para filtrar datos y aplicar permisos, garantizando que el usuario solo opere dentro del contexto autorizado.
    2.  **Creación de Workspace (`createWorkspaceAction`):**
        *   **Trigger:** Usuario envía el formulario en `CreateWorkspaceDialog`.
        *   **Lógica:** La acción (implementada como RPC transaccional) inserta un nuevo registro en `workspaces` y otro en `workspace_members`, asignando al usuario creador el rol de `owner`.
    3.  **Invitación de Miembro (`sendWorkspaceInvitationAction`):**
        *   **Trigger:** Usuario envía el formulario en `InviteMemberDialog`.
        *   **Lógica:** La acción verifica que el invitador tenga permisos (`owner` o `admin`), valida que el invitado no sea ya miembro, y crea un registro en la tabla `invitations`.

## 4. Roadmap de Evolución del Dominio

*   **Completado:** CRUD básico, sistema de roles extensible (`owner`, `admin`, `member`, `viewer`, `billing`), sistema de invitaciones, persistencia de contexto vía cookie.
*   **Próximos Pasos (Vigente):**
    1.  **Transferencia de Propiedad:** Implementar la `Server Action` `transferOwnershipAction(workspaceId, newOwnerId)`.
    2.  **Página de Ajustes de Workspace:** Crear la UI para la gestión avanzada de miembros y configuraciones.
    3.  **Integración con Facturación:** Conectar un `workspace` a la futura tabla `subscriptions`.

// .docs/functionality/001_WORKSPACES_MANIFEST.md