// .docs/espejo/system/003_OBSERVABILITY_MANIFEST.md
/**
 * @file .docs/espejo/system/003_OBSERVABILITY_MANIFEST.md
 * @description Documento Espejo y SSoT conceptual para el Manifiesto de Observabilidad.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Conceptual: Observabilidad v1.0

## 1. Rol Estratégico y Propósito
Este documento es la SSoT canónica que detalla la implementación técnica de la filosofía **"Visibilidad Total, Cero Puntos Ciegos"**, correspondiente al **Pilar 4 de la Constitución Arquitectónica**. Su propósito es servir como una guía técnica profunda para los ingenieros sobre la arquitectura y el uso de las cuatro capas de observabilidad de ConvertiKit: Logging, Telemetría, Auditoría y Monitoreo de Errores.

## 2. Arquitectura del Contenido
El manifiesto se estructura en los cuatro pilares técnicos de la observabilidad. Para cada pilar, se detalla:
1.  **SSoT Técnica:** El o los aparatos de código que son la fuente de verdad para la implementación de esa capa.
2.  **Funcionalidad:** Una descripción técnica del flujo de datos y la lógica de negocio.
3.  **Propósito:** El objetivo estratégico que cumple cada capa.

## 3. Contrato de API
- **Formato de Entrada:** Contenido consolidado del manifiesto de observabilidad obsoleto y las directivas del Pilar 4.
- **Formato de Salida:** Documento Markdown que sirve como la SSoT técnica detallada para la arquitectura de observabilidad.

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Dashboard de Observabilidad Centralizado:** Crear una vista en el Dev Console que unifique datos de `audit_logs`, `system_errors` y `visitor_logs`.
 * 2.  **Alertas Proactivas:** Configurar triggers en Supabase para enviar alertas (ej. a Slack) ante eventos de auditoría críticos o un pico en `system_errors`.
 * 3.  **Trazabilidad Distribuida (Distributed Tracing):** Implementar OpenTelemetry para generar un `traceId` en el middleware que se propague a través de Server Actions, logs y llamadas a la DB, permitiendo reconstruir una petición completa.
 * 4.  **Análisis de Cohortes en Telemetría:** Construir vistas en la DB para analizar el comportamiento de cohortes de usuarios basándose en sus `utm_params` o fecha de registro.
 * 5.  **Servicio de Anonimización de PII:** Crear un helper que sanitice logs para eliminar o enmascarar Información Personal Identificable (PII) antes de enviarla a servicios de terceros.
 * 6.  **Estrategia de Rotación de Logs:** Implementar una política y un script para archivar logs antiguos de la base de datos (ej. a S3) para controlar los costos de almacenamiento.
 * 7.  **Visor de Auditoría para el Usuario Final:** Permitir a los usuarios (ej. `owner` de un workspace) ver un log de auditoría filtrado de las acciones realizadas dentro de su propio workspace.
 * 8.  **Mapas de Calor de Errores:** Integrar Sentry con herramientas de visualización para crear mapas de calor de dónde ocurren con más frecuencia los errores en la UI.
 * 9.  **Análisis de Correlación:** Desarrollar consultas que correlacionen `visitor_logs` con `system_errors` para identificar si ciertos patrones de navegación causan errores.
 * 10. **Internacionalización de Mensajes de Log:** Para equipos de soporte multilingües, los mensajes de log de alto nivel podrían usar claves de i18n.
 * =====================================================================
 */
// .docs/espejo/system/003_OBSERVABILITY_MANIFEST.md