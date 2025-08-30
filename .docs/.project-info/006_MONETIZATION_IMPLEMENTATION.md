// .docs/espejo/roadmap/006_MONETIZATION_IMPLEMENTATION.md
/**
 * @file .docs/espejo/roadmap/006_MONETIZATION_IMPLEMENTATION.md
 * @description Documento Espejo y SSoT conceptual para el Roadmap de Implementación de Monetización.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Conceptual: Roadmap de Implementación de Monetización

## 1. Rol Estratégico y Propósito
Este documento es la SSoT de ejecución para materializar el dominio de `Monetización`. Su propósito es desglosar la implementación del manifiesto funcional en un plan de trabajo fásico, secuencial y accionable, sirviendo como la hoja de ruta para la construcción del motor financiero de ConvertiKit.

## 2. Arquitectura del Contenido
El roadmap se estructura en fases lógicas que construyen el sistema de forma incremental y segura:
1.  **Fase 1: Fundación del Backend (Stripe Webhooks):** Prioriza la creación del endpoint que sincronizará los datos de Stripe con nuestra base de datos, estableciendo la SSoT.
2.  **Fase 2: Flujo de Suscripción del Usuario (Checkout):** Define la creación de la UI de precios y la Server Action que permite a los usuarios suscribirse.
3.  **Fase 3: Flujo de Autogestión (Customer Portal):** Define la creación de la Server Action y la UI que permite a los usuarios gestionar su facturación.
4.  **Fase 4: Integración de Datos y Refactorización:** Define el paso final de conectar la UI existente del dashboard con los datos de suscripción reales.

## 3. Contrato de API
- **Formato de Entrada:** Manifiesto de Dominio `006_MONETIZATION_DOMAIN_MANIFEST.md`.
- **Formato de Salida:** Documento Markdown que detalla las fases y aparatos a implementar.

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Monitorización de Webhooks:** Integrar Sentry para monitorear y alertar sobre fallos en el handler de webhooks.
 * 2.  **Pruebas E2E del Flujo de Pago:** Crear un arnés de pruebas de Playwright que utilice el modo de prueba de Stripe para simular un flujo de pago completo.
 * 3.  **Jobs en Segundo Plano para Sincronización:** Implementar un "cron job" que periódicamente verifique la consistencia de los datos entre nuestra DB y Stripe.
 * 4.  **Manejo de Múltiples Monedas:** Adaptar la lógica para soportar precios y pagos en diferentes monedas.
 * 5.  **Facturación para Equipos (Workspaces):** Detallar la lógica de negocio para vincular suscripciones a un `workspace_id` en lugar de un `user_id`.
 * 6.  **Lógica de "Grace Period" en Webhooks:** Detallar la lógica en el webhook handler para manejar el estado `past_due` y conceder un período de gracia antes de restringir el acceso.
 * 7.  **Pruebas de Seguridad para Webhooks:** Documentar la estrategia de pruebas para validar la verificación de la firma del webhook y prevenir ataques de falsificación.
 * 8.  **Optimización de Carga de la Página de Precios:** Detallar cómo la página de precios obtendrá los datos de los planes desde la tabla `prices` cacheada.
 * 9.  **UI de Selección de Plan de Alta Conversión:** Diseñar y documentar los componentes de UI para la tabla de precios, enfocados en la claridad y la conversión.
 * 10. **Internacionalización de la Documentación:** Traducir este roadmap para equipos de desarrollo multilingües.
 * =====================================================================
 */
// .docs/espejo/roadmap/006_MONETIZATION_IMPLEMENTATION.md