// .docs/functionality/009_DEV_CONSOLE_DOMAIN_MANIFEST.md
/**
 * @file .docs/functionality/009_DEV_CONSOLE_DOMAIN_MANIFEST.md
 * @description Manifiesto Funcional y Arquitectónico del Dominio "Dev Console" v1.0.
 *              Esta es la SSoT que define la arquitectura para el panel de
 *              administración interna. Reemplaza a la versión anterior.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Funcional y Arquitectónico: Dominio "Dev Console & Admin Tools"

## 1. Rol Estratégico y Propósito de Negocio
*   **Referencia a la Constitución:** AD-005.
*   El `Dev Console` es el **centro de comando para la operación y mantenimiento** de ConvertiKit. Proporciona a los roles privilegiados (`developer`, `admin`) las herramientas para supervisar la salud de la plataforma y realizar acciones administrativas.
*   **Filosofía:** "Poder Controlado y Visibilidad Absoluta".

## 2. Funcionalidades Implementadas
*   **Acceso Restringido por Rol:** El `layout.tsx` del `Dev Console` utiliza el guardián de seguridad `requireAppRole(['developer'])`.
*   **Gestión de Usuarios:**
    *   **Visualización:** Tabla paginada de todos los usuarios.
    *   **Cambio de Rol:** Permite a los `developer`s cambiar el `app_role` de cualquier usuario.
    *   **Suplantación (Impersonation):** Permite generar un "magic link" para iniciar sesión como cualquier usuario.
*   **Visor de Telemetría:** Muestra una tabla paginada de `visitor_logs`.
*   **Visor de Campañas:** Muestra una tabla de todas las campañas en la plataforma.

## 3. Arquitectura Técnica y de Datos

### 3.1. Arquitectura de Componentes (Frontend)
*   **SSoT de Lógica de UI:** Hooks soberanos como `useUsersPage`.
*   **Diagrama de Interacción (User Management):**
    ```mermaid
    graph TD
        A[users/page.tsx] -- Carga datos --> B[adminData.users.getPaginatedUsersWithRoles];
        A -- Renderiza --> C[UsersClient];
        C -- Consume --> D[useUsersPage];
        D -- Sincroniza --> E[URL SearchParams];
        C -- Ensambla --> G[PaginatedDataTable];
        G -- Usa config de --> H[users-table-columns.tsx];
    ```

## 4. Flujos de Lógica de Negocio (Server Actions)
*   **SSoT de Lógica de Negocio:** `src/lib/actions/admin.actions.ts`.
*   **Flujos Críticos:**
    1.  **Cambio de Rol (`updateUserRoleAction`):** Valida que el invocador sea `developer`, ejecuta un `UPDATE` en `profiles` usando el `createAdminClient` para eludir RLS, revalida la ruta y crea un `audit_log`.
    2.  **Suplantación (`impersonateUserAction`):** Valida que el invocador sea `developer`, utiliza `supabase.auth.admin.generateLink()` para crear un "magic link", crea un `audit_log` y devuelve el enlace.

## 5. Roadmap de Evolución del Dominio
*   **Completado:** Gestión de usuarios (ver, cambiar rol, suplantar), visores de telemetría y campañas.
*   **Próximos Pasos (Vigente):**
    1.  Crear una página para el **Visor de Logs de Auditoría** (`/dev-console/audit-logs`).
    2.  Implementar una UI para la **Gestión de Feature Flags**.
    3.  Crear un **Dashboard de Salud del Sistema** en la página de inicio del Dev Console.
// .docs/functionality/009_DEV_CONSOLE_DOMAIN_MANIFEST.md