// .docs/espejo/functionality/006_MONETIZATION_DOMAIN_MANIFEST.md
/**
 * @file .docs/espejo/functionality/006_MONETIZATION_DOMAIN_MANIFEST.md
 * @description Documento Espejo y SSoT conceptual para el Manifiesto del Dominio "Monetización".
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Conceptual: Dominio "Monetización"

## 1. Rol Estratégico y Propósito
Este documento es la SSoT canónica que define el propósito de negocio, la arquitectura técnica, los flujos de lógica y el roadmap de evolución para el dominio de `Monetización`. Sirve como la guía de referencia funcional de alto nivel para el motor financiero de ConvertiKit.

## 2. Arquitectura del Contenido
El manifiesto se estructura para proporcionar una visión 360° del dominio:
1.  **Rol Estratégico:** Define la filosofía de "Sincronización Transparente y Auto-servicio", con Stripe como SSoT financiera.
2.  **Arquitectura Técnica y de Datos:** Explica el modelo de base de datos como un "espejo" de Stripe y la arquitectura de sincronización basada en webhooks.
3.  **Flujos de Lógica de Negocio:** Documenta los flujos críticos de `createCheckoutSessionAction` y `createPortalSessionAction`.
4.  **Roadmap de Evolución:** Especifica las funcionalidades completadas y las próximas a implementar.

## 3. Contrato de API
- **Formato de Entrada:** Requerimientos de negocio y decisiones arquitectónicas de la Constitución.
- **Formato de Salida:** Documento Markdown que sirve como la SSoT funcional para el dominio de Monetización.

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Implementar Webhooks Handler:** Crear el endpoint `/api/webhooks/stripe` y la lógica de sincronización.
 * 2.  **Implementar `createCheckoutSessionAction`:** Crear la Server Action y la página de precios.
 * 3.  **Implementar `createPortalSessionAction`:** Crear la Server Action y la sección de "Billing" en los ajustes.
 * 4.  **Soporte para Cupones:** Integrar la lógica para aplicar cupones de descuento durante el checkout.
 * 5.  **Facturación Basada en Uso (Metered Billing):** Implementar la lógica para reportar el uso (ej. créditos de IA) a Stripe para facturación variable.
 * 6.  **Gestión de Múltiples Suscripciones:** Soportar que un `customer` pueda tener múltiples suscripciones activas a diferentes productos.
 * 7.  **Emails Transaccionales de Facturación:** Enviar emails personalizados (usando Resend) para eventos de facturación como `invoice.payment_succeeded` o `customer.subscription.trial_will_end`.
 * 8.  **Página de Historial de Facturas:** Crear una UI que muestre el historial de facturas del cliente, obteniendo los datos desde la API de Stripe o desde una tabla local sincronizada.
 * 9.  **Lógica de "Grace Period":** Implementar la lógica para manejar períodos de gracia cuando un pago falla, antes de cancelar la suscripción.
 * 10. **Internacionalización de la Documentación:** Traducir este manifiesto para equipos de desarrollo multilingües.
 * =====================================================================
 */
// .docs/espejo/functionality/006_MONETIZATION_DOMAIN_MANIFEST.md