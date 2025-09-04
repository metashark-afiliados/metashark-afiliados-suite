// .docs/roadmap/004-DB-REFACTOR-V12-ROLES.md
/**
 * @file .docs/roadmap/004-DB-REFACTOR-V12-ROLES.md
 * @description Roadmap de Ejecución y SSoT para la Refactorización Holística de
 *              la Base de Datos a la Arquitectura v12.0 (Roles Extensibles).
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 12.0.0
 */
# Roadmap de Tarea: Refactorización Holística de la Base de Datos v12.0 (Roles Extensibles)

#### **[Objetivo General de la Tarea]**
Evolucionar el esquema de la base de datos para implementar un sistema de roles de workspace extensible y preparado para el futuro, incorporando los roles `viewer` y `billing`. Esta refactorización es aditiva y no destructiva.

#### **[Estándares de ÉlITE para esta Tarea]**
1.  **Aditivo y No Destructivo:** Las modificaciones al `ENUM` y a la lógica se realizarán de forma que no afecten los roles existentes.
2.  **Seguridad por Defecto:** Las políticas RLS serán actualizadas para incluir los nuevos roles, aplicando el principio de mínimo privilegio.
3.  **Sincronización Total:** Los tipos de TypeScript y toda la base de código serán actualizados para reconocer y manejar los nuevos roles.

---

### **Fases Lógicas de Implementación (Secuencial)**

#### **Fase 1: Evolución del Esquema de la Base de Datos**

*   **1.1. Modificar ENUM `workspace_role`:**
    *   **Acción:** `ALTER TYPE public.workspace_role ADD VALUE 'viewer';`
    *   **Acción:** `ALTER TYPE public.workspace_role ADD VALUE 'billing';`
*   **1.2. Actualizar Políticas RLS:**
    *   **Aparato:** `schema.sql` (o un nuevo script de migración).
    *   **Acción:** La política de `SELECT` para `workspaces` y `sites` será actualizada para incluir el rol `viewer`.
        *   `USING (EXISTS (SELECT 1 FROM public.workspace_members WHERE ... AND role IN ('owner', 'admin', 'member', 'viewer')))`
    *   **Acción:** Las políticas de `UPDATE`/`DELETE` se mantendrán sin cambios, denegando implícitamente estos permisos a los nuevos roles.

#### **Fase 2: Sincronización de la Base de Código**

*   **2.1. Actualizar Tipos de TypeScript:**
    *   **Aparato:** `src/lib/types/database/enums.ts`
    *   **Acción:** Actualizar la unión de tipo `workspace_role` para incluir `'viewer'` y `'billing'`.
*   **2.2. Refactorizar Capa de Datos y Permisos:**
    *   **Aparato:** `src/lib/auth/user-permissions.ts`
    *   **Acción:** Revisar los guardianes de seguridad (`requireWorkspacePermission`, etc.) para asegurar que los nuevos roles se manejen correctamente. El `canEdit` y `canDelete` en `useWorkspaceContext` seguirán funcionando correctamente, ya que están basados en una lista explícita de roles de edición.
*   **2.3. Refactorizar Componentes de UI y Hooks:**
    *   **Aparato:** `src/components/workspaces/form-fields/RoleSelectField.tsx`
    *   **Acción:** Añadir las nuevas opciones (`Viewer`, `Billing`) al componente de selección de roles en el formulario de invitación.
    *   **Aparato:** `src/lib/validators/schemas/invitations.schemas.ts`
    *   **Acción:** Actualizar el `z.enum` en `InvitationClientSchema` para incluir los nuevos roles.
*   **2.4. Actualizar Pruebas:**
    *   **Aparato:** Todos los arneses de pruebas relevantes.
    *   **Acción:** Añadir nuevos casos de prueba que validen la lógica de permisos para los roles `viewer` y `billing` (ej. un `viewer` no puede ver el botón de "Invitar Miembro").

---