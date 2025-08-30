V// .docs/functionality/003_NOTIFICATIONS_INVITATIONS_MANIFEST.md
/**
 * @file .docs/functionality/003_NOTIFICATIONS_INVITATIONS_MANIFEST.md
 * @description Manifiesto Funcional y Arquitectónico del Dominio "Notifications & Invitations" v1.0.
 *              Esta es la SSoT que define el propósito, la arquitectura y la lógica
 *              de negocio para el sistema de notificaciones y el flujo de invitaciones
 *              de colaboración en ConvertiKit.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Funcional y Arquitectónico: Dominio "Notifications & Invitations"

## 1. Rol Estratégico y Propósito de Negocio

Este dominio es el **motor de la colaboración en tiempo real**. Su propósito es permitir a los equipos crecer de forma fluida y segura, proporcionando un mecanismo robusto para invitar nuevos miembros a los `Workspaces` y notificar a los usuarios de eventos importantes. Estratégicamente, es fundamental para el modelo de negocio de agencias y equipos.

*   **Filosofía:** "Comunicación Instantánea y Accionable". Las notificaciones no son solo informativas; son puntos de entrada a flujos de trabajo críticos (ej. aceptar una invitación).

## 2. Funcionalidades Implementadas

*   **Envío de Invitaciones:** Los `owner`s y `admin`s de un `Workspace` pueden enviar invitaciones a nuevos miembros a través de su dirección de correo electrónico, asignándoles un rol (`admin` o `member`).
*   **Visualización de Invitaciones Pendientes:** El componente `InvitationBell` en la cabecera del dashboard muestra un indicador numérico con la cantidad de invitaciones pendientes para el usuario logueado.
*   **Lista de Invitaciones:** Al hacer clic en la `InvitationBell`, se despliega una lista de invitaciones pendientes, mostrando el nombre del `Workspace` al que ha sido invitado.
*   **Aceptación de Invitaciones:** El usuario puede aceptar una invitación directamente desde la lista, lo que lo añade como miembro al `Workspace` correspondiente.
*   **Actualizaciones en Tiempo Real:** El sistema utiliza **Supabase Realtime** para escuchar cambios en la tabla `invitations`. Si se crea, actualiza o elimina una invitación para el usuario actual, la `InvitationBell` se actualiza automáticamente sin necesidad de recargar la página.

## 3. Arquitectura Técnica y de Datos

### 3.1. Modelo de Entidad-Relación (Base de Datos)

*   **SSoT de Datos:** Tablas `invitations` y `notifications`.
*   **Diagrama de Entidad-Relación (Mermaid):**
    ```mermaid
    erDiagram
        profiles   ||--|{ invitations : "envía"
        workspaces ||--|{ invitations : "pertenece a"
        profiles   ||--o{ notifications : "recibe"
    ```
*   **Descripción:** La tabla `invitations` almacena el estado de cada invitación. La tabla `notifications` es una entidad futura para notificaciones más genéricas (ej. "Tu campaña ha terminado su análisis de IA").

### 3.2. Arquitectura de Componentes (Frontend)

*   **SSoT de Lógica de UI:** Hook soberano `useRealtimeInvitations`.
*   **Componentes Principales:**
    *   `InvitationBell`: Orquestador de UI que consume `useRealtimeInvitations` y gestiona el `DropdownMenu` con la lista de invitaciones.
    *   `InviteMemberDialog`: Modal que contiene el `InviteMemberForm`.
    *   `InviteMemberForm`: Formulario de cliente que utiliza `react-hook-form` para validar la entrada y llamar a la Server Action de envío.

## 4. Flujos de Lógica de Negocio

*   **SSoT de Lógica de Negocio:** `src/lib/actions/invitations.actions.ts`.
*   **Flujos Críticos:**
    1.  **Suscripción en Tiempo Real (Cliente):**
        *   **Trigger:** El hook `useRealtimeInvitations` se inicializa.
        *   **Lógica:** Utiliza el cliente de Supabase para suscribirse al canal `postgres_changes` para la tabla `invitations`, filtrando por el `invitee_email` del usuario actual.
        *   **Efecto:** Al recibir un evento, muestra un `toast` y fuerza un `router.refresh()` para obtener los datos más recientes, actualizando la UI de forma reactiva.
    2.  **Aceptación de Invitación (`acceptInvitationAction`):**
        *   **Trigger:** Usuario hace clic en el botón "Aceptar" en la `InvitationBell`.
        *   **Lógica:** La acción invoca una **RPC de PostgreSQL** (`accept_workspace_invitation`). Esta función transaccional:
            1.  Verifica que la invitación es válida y está 'pending'.
            2.  Inserta un nuevo registro en `workspace_members`.
            3.  Actualiza el estado de la invitación a 'accepted'.
            4.  Todo se ejecuta de forma atómica (o todo o nada).
        *   **Seguridad:** La RPC se ejecuta con `SECURITY DEFINER` y contiene su propia lógica de validación de permisos.

## 5. Roadmap de Evolución del Dominio

*   **Completado:** Flujo de envío y aceptación de invitaciones, actualizaciones en tiempo real.
*   **Próximos Pasos (Vigente):**
    1.  **Rechazar/Ignorar Invitación:** Implementar una `Server Action` `rejectInvitationAction(invitationId)` que actualice el estado de la invitación a `declined`.
    2.  **Revocar Invitación:** Implementar una `Server Action` `revokeInvitationAction(invitationId)` que permita a los `owner`s/`admin`s cancelar una invitación `pending` que hayan enviado.
    3.  **Notificaciones por Email:** Integrar un servicio de email (ej. Resend) en la `sendWorkspaceInvitationAction` para notificar al invitado por correo electrónico.
    4.  **Centro de Notificaciones Genérico:** Expandir la funcionalidad para utilizar la tabla `notifications`, permitiendo mostrar diferentes tipos de alertas en la `InvitationBell` (o un futuro `NotificationCenter`).

// .docs/functionality/003_NOTIFICATIONS_INVITATIONS_MANIFEST.md