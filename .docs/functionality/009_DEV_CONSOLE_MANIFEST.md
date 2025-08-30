// .docs/functionality/009_DEV_CONSOLE_MANIFEST.md
/**
 * @file .docs/functionality/009_DEV_CONSOLE_MANIFEST.md
 * @description Manifiesto Funcional y Arquitectónico del Dominio "Dev Console & Admin Tools" v1.0.
 *              Esta es la SSoT que define el propósito, la arquitectura y la
 *              lógica de negocio para el panel de administración interna.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Funcional y Arquitectónico: Dominio "Dev Console & Admin Tools"

## 1. Rol Estratégico y Propósito de Negocio

El `Dev Console` es el **centro de comando para la operación y mantenimiento** de `ConvertiKit`. Su propósito es proporcionar a los roles privilegiados (`developer`, `admin`) las herramientas necesarias para supervisar la salud de la plataforma, gestionar datos de alto nivel y realizar acciones administrativas. No es una funcionalidad de cara al cliente, sino una herramienta interna crítica.

*   **Filosofía:** "Poder Controlado y Visibilidad Absoluta". El `Dev Console` otorga acceso de alto privilegio, pero cada acción es auditada. Su diseño se enfoca en la densidad de información y la eficiencia operativa.

## 2. Funcionalidades Implementadas

*   **Acceso Restringido por Rol:** El `layout.tsx` del `Dev Console` utiliza el guardián de seguridad `requireAppRole(['developer'])` para proteger todas sus rutas anidadas.
*   **Gestión de Usuarios:**
    *   **Visualización:** Muestra una tabla paginada de todos los usuarios de la plataforma, consultando la vista `user_profiles_with_email`.
    *   **Cambio de Rol:** Permite a los `developer`s cambiar el `app_role` de cualquier usuario.
    *   **Suplantación (Impersonation):** Permite a los `developer`s generar un "magic link" para iniciar sesión como cualquier usuario, una herramienta de depuración de élite.
*   **Visor de Telemetría:** Muestra una tabla paginada de todos los registros en la tabla `visitor_logs`.
*   **Visor de Campañas:** Muestra una tabla de todas las campañas en la plataforma.

## 3. Arquitectura Técnica y de Datos

### 3.1. Arquitectura de Componentes (Frontend)

*   **SSoT de Lógica de UI:** Hooks soberanos como `useUsersPage`.
*   **Componentes Principales:**
    *   `DevSidebarClient`: La barra de navegación lateral estática.
    *   `UsersClient`, `TelemetryPage`, etc.: Orquestadores de UI para cada sub-página.
    *   `PaginatedDataTable`: Componente genérico reutilizado para mostrar los datos.

*   **Diagrama de Interacción de Componentes (User Management):**
    ```mermaid
    graph TD
        A[users/page.tsx] -- Carga datos --> B[adminData.users.getPaginatedUsersWithRoles];
        A -- Renderiza --> C[UsersClient];
        C -- Consume --> D[useUsersPage];
        D -- Sincroniza --> E[URL SearchParams];
        C -- Ensambla --> F[UsersPageHeader];
        C -- Ensambla --> G[PaginatedDataTable];
        G -- Usa config de --> H[users-table-columns.tsx];
        H -- Renderiza celda --> I[ImpersonationDialog];
    ```

## 4. Flujos de Lógica de Negocio (Server Actions)

*   **SSoT de Lógica de Negocio:** `src/lib/actions/admin.actions.ts`.
*   **Flujos Críticos:**
    1.  **Cambio de Rol (`updateUserRoleAction`):**
        *   **Validación:** Verifica que el invocador sea `developer` y no esté intentando cambiar su propio rol.
        *   **Mutación:** Ejecuta un `UPDATE` en la tabla `profiles` utilizando el `createAdminClient` de Supabase para eludir las RLS.
        *   **Efectos:** Revalida la ruta `/dev-console/users` y crea un `audit_log`.
    2.  **Suplantación (`impersonateUserAction`):**
        *   **Validación:** Verifica que el invocador sea `developer` y no se esté auto-suplantando.
        *   **Lógica:** Utiliza `supabase.auth.admin.generateLink()` para crear un "magic link" de un solo uso.
        *   **Efectos:** Crea un `audit_log` de alto impacto y devuelve el enlace al cliente.

## 5. Roadmap de Evolución del Dominio

*   **Completado:** Gestión de usuarios (ver, cambiar rol, suplantar), visores de telemetría y campañas.
*   **Próximos Pasos (Vigente):**
    1.  **Visor de Logs de Auditoría:** Crear una nueva página `/dev-console/audit-logs` que muestre los registros de la tabla `audit_logs` con filtros avanzados.
    2.  **Gestión de Feature Flags:** Implementar una UI para gestionar la tabla `feature_flags`, permitiendo a los `developer`s activar/desactivar características en producción.
    3.  **Dashboard de Salud del Sistema:** Crear una página de inicio (`/dev-console`) que muestre métricas clave: nuevos usuarios, errores del sistema, etc.

// .docs/functionality/009_DEV_CONSOLE_MANIFEST.md