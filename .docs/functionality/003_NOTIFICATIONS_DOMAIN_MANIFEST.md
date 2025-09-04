// .docs/functionality/003_NOTIFICATIONS_DOMAIN_MANIFEST.md
/**
 * @file .docs/functionality/003_NOTIFICATIONS_DOMAIN_MANIFEST.md
 * @description Manifiesto Funcional y Arquitectónico del Dominio "Notifications & Invitations" v1.0.
 *              Esta es la SSoT que define la arquitectura y lógica para el sistema
 *              de notificaciones y el flujo de invitaciones. Reemplaza a la
 *              versión anterior.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Funcional y Arquitectónico: Dominio "Notifications & Invitations"

## 1. Rol Estratégico y Propósito de Negocio
*   **Referencia a la Constitución:** AD-005.
*   Este dominio es el **motor de la colaboración en tiempo real** de ConvertiKit. Su propósito es permitir a los equipos crecer de forma fluida y segura, proporcionando un mecanismo robusto para invitar nuevos miembros y notificar a los usuarios.
*   **Filosofía:** "Comunicación Instantánea y Accionable".

## 2. Funcionalidades Implementadas
*   **Envío de Invitaciones:** Los `owner`s y `admin`s pueden enviar invitaciones por correo electrónico, asignando un rol.
*   **Visualización de Invitaciones:** El componente `InvitationBell` muestra un indicador numérico con las invitaciones pendientes.
*   **Aceptación de Invitaciones:** El usuario puede aceptar una invitación directamente desde la `InvitationBell`.
*   **Actualizaciones en Tiempo Real:** El sistema utiliza **Supabase Realtime** para escuchar cambios en la tabla `invitations`, actualizando la `InvitationBell` automáticamente.

## 3. Arquitectura Técnica y de Datos

### 3.1. Modelo de Entidad-Relación (Base de Datos)
*   **SSoT de Datos:** Tablas `invitations` y `notifications`.
*   **Diagrama (Mermaid):**
    ```mermaid
    erDiagram
        profiles   ||--|{ invitations : "envía"
        workspaces ||--|{ invitations : "pertenece a"
        profiles   ||--o{ notifications : "recibe"
    ```

### 3.2. Arquitectura de Componentes (Frontend)
*   **SSoT de Lógica de UI:** Hook soberano `useRealtimeInvitations`.
*   **Componentes Principales:**
    *   `InvitationBell`: Orquestador de UI que consume el hook y gestiona la lista.
    *   `InviteMemberDialog`: Modal que contiene el `InviteMemberForm`.
    *   `InviteMemberForm`: Formulario de cliente que utiliza `react-hook-form`.

## 4. Flujos de Lógica de Negocio
*   **SSoT de Lógica de Negocio:** `src/lib/actions/invitations.actions.ts`.
*   **Flujos Críticos:**
    1.  **Suscripción en Tiempo Real (Cliente):** El hook `useRealtimeInvitations` se suscribe al canal `postgres_changes` para la tabla `invitations`, filtrando por el `invitee_email` del usuario. Al recibir un evento, muestra un `toast` y fuerza un `router.refresh()`.
    2.  **Aceptación de Invitación (`acceptInvitationAction`):** Invoca una **RPC de PostgreSQL** (`accept_workspace_invitation`). Esta función transaccional inserta en `workspace_members` y actualiza el estado de la invitación de forma atómica.

## 5. Roadmap de Evolución del Dominio
*   **Completado:** Flujo de envío y aceptación de invitaciones, actualizaciones en tiempo real.
*   **Próximos Pasos (Vigente):**
    1.  Implementar `Server Action` `rejectInvitationAction(invitationId)`.
    2.  Implementar `Server Action` `revokeInvitationAction(invitationId)`.
    3.  Integrar un servicio de email para notificar al invitado por correo.
    4.  Expandir la funcionalidad para utilizar la tabla `notifications` para un centro de notificaciones genérico.
// .docs/functionality/003_NOTIFICATIONS_DOMAIN_MANIFEST.md