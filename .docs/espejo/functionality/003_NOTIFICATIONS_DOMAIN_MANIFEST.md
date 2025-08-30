// .docs/espejo/functionality/003_NOTIFICATIONS_DOMAIN_MANIFEST.md
/**
 * @file .docs/espejo/functionality/003_NOTIFICATIONS_DOMAIN_MANIFEST.md
 * @description Documento Espejo y SSoT conceptual para el Manifiesto del Dominio "Notificaciones e Invitaciones".
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Conceptual: Dominio "Notificaciones e Invitaciones"

## 1. Rol Estratégico y Propósito
Este documento es la SSoT canónica que define el propósito de negocio, la arquitectura técnica, los flujos de lógica y el roadmap de evolución para el dominio `Notifications & Invitations`. Sirve como la guía de referencia funcional de alto nivel para el motor de colaboración en tiempo real de la plataforma.

## 2. Arquitectura del Contenido
El manifiesto se estructura para proporcionar una visión 360° del dominio:
1.  **Rol Estratégico:** Define la filosofía de "Comunicación Instantánea y Accionable".
2.  **Funcionalidades Implementadas:** Detalla las capacidades actuales del dominio, como el envío y aceptación de invitaciones con actualizaciones en tiempo real.
3.  **Arquitectura Técnica y de Datos:** Explica el modelo de base de datos y la arquitectura de componentes del frontend, incluyendo el uso de Supabase Realtime.
4.  **Flujos de Lógica de Negocio:** Documenta los flujos críticos, destacando la suscripción en el cliente y el uso de RPCs transaccionales en el backend.
5.  **Roadmap de Evolución:** Especifica las funcionalidades completadas y las próximas a implementar.

## 3. Contrato de API
- **Formato de Entrada:** Requerimientos de negocio y decisiones arquitectónicas de la Constitución.
- **Formato de Salida:** Documento Markdown que sirve como la SSoT funcional para el dominio de Notificaciones e Invitaciones.

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Rechazar/Ignorar Invitación:** Implementar una `Server Action` `rejectInvitationAction(invitationId)`.
 * 2.  **Revocar Invitación:** Implementar una `Server Action` `revokeInvitationAction(invitationId)` para que los `owner`s/`admin`s cancelen invitaciones pendientes.
 * 3.  **Notificaciones por Email:** Integrar un servicio de email (ej. Resend) en la `sendWorkspaceInvitationAction`.
 * 4.  **Centro de Notificaciones Genérico:** Expandir la funcionalidad para utilizar la tabla `notifications`, permitiendo mostrar diferentes tipos de alertas.
 * 5.  **Reenvío de Invitación:** Añadir una acción `resendInvitationAction` con limitación de tasa (rate limiting).
 * 6.  **Expiración de Invitaciones:** Añadir un campo `expires_at` a la tabla `invitations` y un "job" de base de datos que las invalide.
 * 7.  **Feedback de UI Optimista:** Al aceptar/rechazar una invitación, actualizar el estado de la UI localmente de forma inmediata antes de que la acción del servidor complete.
 * 8.  **Agrupación de Notificaciones:** Si un usuario recibe múltiples notificaciones, agruparlas en la UI (ej. "Tienes 3 invitaciones y 2 menciones").
 * 9.  **Preferencias de Notificación:** Permitir a los usuarios configurar qué tipo de notificaciones desean recibir (en la app, por email, etc.) en sus ajustes de perfil.
 * 10. **Internacionalización de la Documentación:** Traducir este manifiesto para equipos de desarrollo multilingües.
 * =====================================================================
 */
// .docs/espejo/functionality/003_NOTIFICATIONS_DOMAIN_MANIFEST.md