// .docs/espejo/functionality/009_DEV_CONSOLE_DOMAIN_MANIFEST.md
/**
 * @file .docs/espejo/functionality/009_DEV_CONSOLE_DOMAIN_MANIFEST.md
 * @description Documento Espejo y SSoT conceptual para el Manifiesto del Dominio "Dev Console".
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Conceptual: Dominio "Dev Console & Admin Tools"

## 1. Rol Estratégico y Propósito
Este documento es la SSoT canónica que define el propósito de negocio, la arquitectura técnica, los flujos de lógica y el roadmap de evolución para el dominio del `Dev Console`. Sirve como la guía de referencia funcional de alto nivel para el centro de comando interno de operación y mantenimiento de ConvertiKit.

## 2. Arquitectura del Contenido
El manifiesto se estructura para proporcionar una visión 360° del dominio:
1.  **Rol Estratégico:** Define la filosofía de "Poder Controlado y Visibilidad Absoluta".
2.  **Funcionalidades Implementadas:** Detalla las capacidades actuales, como la gestión de usuarios (cambio de rol, suplantación) y los visores de datos.
3.  **Arquitectura Técnica y de Datos:** Explica la arquitectura de componentes del frontend, incluyendo un diagrama de interacción de componentes.
4.  **Flujos de Lógica de Negocio:** Documenta los flujos críticos de las Server Actions de administración, como `updateUserRoleAction` e `impersonateUserAction`.
5.  **Roadmap de Evolución:** Especifica las funcionalidades completadas y las próximas a implementar, como la gestión de Feature Flags y un dashboard de salud del sistema.

## 3. Contrato de API
- **Formato de Entrada:** Requerimientos de negocio y decisiones arquitectónicas de la Constitución (AD-005).
- **Formato de Salida:** Documento Markdown que sirve como la SSoT funcional para el dominio del Dev Console.

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Visor de Logs de Auditoría:** Crear una nueva página `/dev-console/audit-logs`.
 * 2.  **Gestión de Feature Flags:** Implementar una UI para gestionar la tabla `feature_flags`.
 * 3.  **Dashboard de Salud del Sistema:** Crear una página de inicio (`/dev-console`) que muestre métricas clave.
 * 4.  **Visor de `system_errors`:** Crear una UI para ver, filtrar y marcar como "resueltos" los errores persistentes de la base de datos.
 * 5.  **Ejecutor de RPCs Seguras:** Desarrollar una UI que permita a los `developer`s ejecutar funciones RPC de la base de datos de forma segura desde el Dev Console.
 * 6.  **Gestión de `Lookup Tables`:** Implementar una UI para añadir/editar valores en las tablas de `lookup` (ej. `workspace_roles`).
 * 7.  **Visor de Sesiones de Usuario:** Crear una herramienta para ver las sesiones activas de un usuario y la capacidad de revocarlas.
 * 8.  **Panel de Emails Transaccionales:** Integrar una vista que muestre un log de los emails transaccionales enviados (ej. a través de webhooks de Resend).
 * 9.  **Herramienta de Búsqueda Global:** Implementar una búsqueda global dentro del Dev Console que pueda buscar a través de usuarios, sitios, campañas y logs.
 * 10. **Internacionalización de la Documentación:** Traducir este manifiesto para equipos de desarrollo multilingües.
 * =====================================================================
 */
// .docs/espejo/functionality/009_DEV_CONSOLE_DOMAIN_MANIFEST.md