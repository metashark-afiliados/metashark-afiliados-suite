// .docs/roadmap/006_MONETIZATION_IMPLEMENTATION.md
/**
 * @file .docs/roadmap/006_MONETIZATION_IMPLEMENTATION.md
 * @description Roadmap de Ejecución v1.0: Implementación del Dominio de Monetización.
 *              Esta es la SSoT para la construcción del motor financiero de ConvertiKit.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Roadmap de Tarea: Implementación del Dominio de Monetización v1.0

#### **[Objetivo General de la Tarea]**
Implementar el flujo de negocio de monetización de punta a punta, permitiendo a los usuarios suscribirse a planes de pago y gestionar sus suscripciones, con Stripe como la SSoT financiera.

#### **[Estándares de ÉlITE para esta Tarea]**
1.  **Seguridad por Defecto:** Todas las interacciones con Stripe deben ser validadas. El endpoint de webhooks DEBE verificar la firma de Stripe.
2.  **Full Observabilidad:** Cada paso crítico (creación de sesión, recepción de webhook, fallo de pago) DEBE ser registrado.
3.  **SSoT Externa:** Nuestra base de datos es un espejo. La lógica nunca debe asumir que tiene el estado más reciente; siempre debe estar preparada para conciliar con los eventos de Stripe.

---

### **Fases Lógicas de Implementación (Secuencial)**

#### **Fase 1: Fundación del Backend (Stripe Webhooks)**
*   **Objetivo:** Establecer el canal de comunicación unidireccional `Stripe -> ConvertiKit` para sincronizar el estado de las suscripciones.
*   **Aparatos a Crear/Modificar:**
    1.  **Aparato:** `src/app/api/webhooks/stripe/route.ts` (Nuevo)
        *   **Lógica:**
            *   Recibir peticiones `POST` de Stripe.
            *   Validar la firma `Stripe-Signature` para seguridad.
            *   Implementar un `switch` statement para manejar los eventos clave (`customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`).
            *   Para cada evento, escribir/actualizar los datos en las tablas `customers`, `subscriptions`, `prices`.
    2.  **Aparato:** `src/db/schema.sql` (Modificación)
        *   **Lógica:** Añadir el trigger `on_subscription_change` en la tabla `subscriptions` para actualizar la columna denormalizada `plan_type` en `profiles`.

#### **Fase 2: Flujo de Suscripción del Usuario (Checkout)**
*   **Objetivo:** Permitir a un usuario seleccionar un plan y ser redirigido a Stripe para completar el pago.
*   **Aparatos a Crear/Modificar:**
    1.  **Aparato:** `src/lib/actions/billing.actions.ts` (Nuevo)
        *   **Lógica:** Implementar la `createCheckoutSessionAction(priceId: string)`. Esta acción se comunica con la API de Stripe para crear una sesión de checkout y devuelve la URL de redirección.
    2.  **Aparato:** `src/app/[locale]/pricing/page.tsx` (Nuevo)
        *   **Lógica:** Página de servidor que obtiene los planes y precios desde las tablas `products` y `prices`.
    3.  **Aparato:** `src/components/billing/PricingTable.tsx` (Nuevo)
        *   **Lógica:** Componente de cliente que renderiza los planes y contiene los botones "Suscribirse", que invocan la `createCheckoutSessionAction`.

#### **Fase 3: Flujo de Autogestión (Customer Portal)**
*   **Objetivo:** Permitir a un usuario gestionar su suscripción activa (actualizar método de pago, cancelar, ver facturas).
*   **Aparatos a Crear/Modificar:**
    1.  **Aparato:** `src/lib/actions/billing.actions.ts` (Modificación)
        *   **Lógica:** Implementar la `createPortalSessionAction()`. Esta acción obtiene el `stripe_customer_id` del usuario, crea una sesión del Customer Portal de Stripe y redirige al usuario.
    2.  **Aparato:** `src/app/[locale]/dashboard/settings/billing/page.tsx` (Nuevo)
        *   **Lógica:** UI que muestra el estado actual de la suscripción del usuario y un botón "Gestionar Facturación" que invoca la `createPortalSessionAction`.

#### **Fase 4: Integración de Datos y Refactorización de UI**
*   **Objetivo:** Reemplazar los datos de suscripción simulados con los datos reales sincronizados desde Stripe.
*   **Aparatos a Crear/Modificar:**
    1.  **Aparato:** `src/lib/hooks/useSubscriptionData.ts` (Refactorización)
        *   **Lógica:** Modificar el hook para que, en lugar de simular datos basados en `profiles.plan_type`, realice una consulta (a través del `DashboardContext`) a la tabla `subscriptions` para obtener el estado y los detalles reales del plan.
// .docs/roadmap/006_MONETIZATION_IMPLEMENTATION.md