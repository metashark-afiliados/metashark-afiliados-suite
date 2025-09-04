// .docs/functionality/006_MONETIZATION_DOMAIN_MANIFEST.md
/**
 * @file .docs/functionality/006_MONETIZATION_DOMAIN_MANIFEST.md
 * @description Manifiesto Funcional y Arquitectónico del Dominio "Monetization" v1.0.
 *              Esta es la SSoT que define la arquitectura para el sistema de
 *              facturación y suscripciones. Reemplaza a la versión anterior.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Funcional y Arquitectónico: Dominio "Monetization"

## 1. Rol Estratégico y Propósito de Negocio
*   **Referencia a la Constitución:** AD-005.
*   El dominio de Monetización es el **motor financiero** de ConvertiKit. Gestiona el ciclo de vida completo de las suscripciones.
*   **Filosofía:** "Sincronización Transparente y Auto-servicio". La SSoT para la facturación reside en **Stripe**. Nuestra base de datos actúa como un espejo sincronizado, actualizado vía webhooks.

## 2. Arquitectura Técnica y de Datos

### 2.1. Modelo de Entidad-Relación (Base de Datos Espejo)
*   **SSoT de Datos:** Tablas `customers`, `products`, `prices`, `subscriptions`.
*   **Diagrama (Mermaid):**
    ```mermaid
    erDiagram
        profiles ||--o{ customers : "es un"
        customers ||--o{ subscriptions : "tiene"
        products ||--|{ prices : "tiene"
        prices ||--o{ subscriptions : "se suscribe a"
    ```

### 2.2. Arquitectura de Sincronización (Stripe Webhooks)
*   **SSoT Técnica:** Un endpoint de API (`/api/webhooks/stripe`) que escucha los eventos de Stripe, valida la firma, y actualiza las tablas espejo.
*   **Trigger de Base de Datos:** Un trigger `on_subscription_change` en la tabla `subscriptions` actualiza la columna `plan_type` en la tabla `profiles` para un control de acceso rápido.

## 3. Flujos de Lógica de Negocio (Server Actions)
*   **SSoT de Lógica de Negocio:** Futuras `Server Actions` en `src/lib/actions/billing.actions.ts`.
*   **Flujos Críticos:**
    1.  **Creación de Sesión de Checkout (`createCheckoutSessionAction`):** Obtiene el `price_id`, utiliza el SDK de Stripe para crear una `Checkout Session` y devuelve la `sessionId` al cliente para redirigir a la página de pago de Stripe.
    2.  **Creación de Sesión del Portal de Cliente (`createPortalSessionAction`):** Obtiene el `stripe_customer_id` del usuario, crea una sesión del `Customer Portal` y redirige al usuario para la autogestión de su facturación.

## 4. Roadmap de Evolución del Dominio
*   **Completado:** Definición del esquema de base de datos y componentes de UI de presentación.
*   **Próximos Pasos (Vigente):**
    1.  Implementar el **Webhook Handler** (`/api/webhooks/stripe`).
    2.  Implementar `createCheckoutSessionAction` y la página de precios.
    3.  Implementar `createPortalSessionAction` y la sección de "Billing" en los ajustes.
    4.  Refactorizar `useSubscriptionData` para que consuma los datos reales de la tabla `subscriptions`.
// .docs/functionality/006_MONETIZATION_DOMAIN_MANIFEST.md