// .docs/functionality/006_MONETIZATION_MANIFEST.md
/**
 * @file .docs/functionality/006_MONETIZATION_MANIFEST.md
 * @description Manifiesto Funcional y Arquitectónico del Dominio "Monetization" v1.0.
 *              Esta es la SSoT que define el propósito, la arquitectura y la
 *              lógica de negocio para el sistema de facturación y suscripciones
 *              de ConvertiKit, basado en una integración de élite con Stripe.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Funcional y Arquitectónico: Dominio "Monetization"

## 1. Rol Estratégico y Propósito de Negocio

El dominio de Monetización es el **motor financiero** de `ConvertiKit`. Su propósito es gestionar el ciclo de vida completo de las suscripciones de los clientes, desde la selección de un plan y el pago, hasta la gestión de la facturación y las cancelaciones.

*   **Filosofía:** "Sincronización Transparente y Auto-servicio". La SSoT para la facturación reside en **Stripe**. Nuestra base de datos actúa como un espejo sincronizado de solo lectura de los datos de Stripe, actualizado vía webhooks. El usuario debe tener control total sobre su suscripción a través de un portal de cliente (`Stripe Customer Portal`).

## 2. Arquitectura Técnica y de Datos

### 2.1. Modelo de Entidad-Relación (Base de Datos Espejo)

*   **SSoT de Datos:** Tablas `customers`, `products`, `prices`, `subscriptions`.
*   **Diagrama de Entidad-Relación (Mermaid):**
    ```mermaid
    erDiagram
        profiles ||--o{ customers : "es un"
        customers ||--o{ subscriptions : "tiene"
        products ||--|{ prices : "tiene"
        prices ||--o{ subscriptions : "se suscribe a"
    ```
*   **Descripción:** Un `profile` se mapea a un `customer` en Stripe. Un `customer` puede tener una o más `subscriptions`. Cada `subscription` está asociada a un `price` específico, que a su vez pertenece a un `product`.

### 2.2. Arquitectura de Sincronización (Stripe Webhooks)

*   **SSoT Técnica:** Un endpoint de API (`/api/webhooks/stripe`) que escucha los eventos de Stripe.
*   **Flujo de Datos:**
    1.  **Stripe:** Un evento ocurre (ej. `customer.subscription.created`, `invoice.payment_succeeded`).
    2.  **Webhook:** Stripe envía una petición `POST` firmada a nuestro endpoint.
    3.  **Endpoint API:** Valida la firma del webhook para seguridad y luego inserta/actualiza los datos en las tablas `subscriptions`, `prices`, etc.
    4.  **Trigger de Base de Datos:** Un trigger `on_subscription_change` en la tabla `subscriptions` actualiza la columna denormalizada `plan_type` en la tabla `profiles` del usuario correspondiente.

## 3. Flujos de Lógica de Negocio (Server Actions)

*   **SSoT de Lógica de Negocio:** Futuras `Server Actions` en `src/lib/actions/billing.actions.ts`.
*   **Flujos Críticos:**
    1.  **Creación de Sesión de Checkout (`createCheckoutSessionAction`):**
        *   **Trigger:** Usuario hace clic en "Upgrade Plan" en la página de precios.
        *   **Lógica:**
            1.  La acción obtiene el `price_id` seleccionado y el `user_id`.
            2.  Utiliza el SDK de Stripe para crear una `Checkout Session`.
            3.  Devuelve la `sessionId` al cliente, que utiliza `stripe.js` para redirigir al usuario a la página de pago de Stripe.
    2.  **Creación de Sesión del Portal de Cliente (`createPortalSessionAction`):**
        *   **Trigger:** Usuario hace clic en "Manage Billing" en los ajustes de su cuenta.
        *   **Lógica:**
            1.  La acción obtiene el `stripe_customer_id` del usuario desde la tabla `customers`.
            2.  Utiliza el SDK de Stripe para crear una sesión del `Customer Portal`.
            3.  Redirige al usuario al portal de Stripe, donde puede actualizar su método de pago, ver facturas o cancelar su suscripción.

## 4. Roadmap de Evolución del Dominio

*   **Completado:**
    *   Definición del esquema de base de datos (`customers`, `products`, `prices`, `subscriptions`).
    *   Componentes de UI de presentación para mostrar datos de suscripción.
*   **Próximos Pasos (Vigente):**
    1.  **Implementar Webhooks Handler:** Crear el endpoint `/api/webhooks/stripe` y la lógica para sincronizar los eventos de Stripe con la base de datos.
    2.  **Implementar `createCheckoutSessionAction`:** Crear la Server Action y la página de precios (`/pricing`) para que los usuarios puedan suscribirse.
    3.  **Implementar `createPortalSessionAction`:** Crear la Server Action y una sección "Billing" en los ajustes del usuario para la autogestión.
    4.  **Refactorizar `useSubscriptionData`:** Nivelar el hook para que consuma los datos reales de la tabla `subscriptions`, en lugar del `plan_type` simulado.

// .docs/functionality/006_MONETIZATION_MANIFEST.md