// src/lib/validators/i18n/DashboardSubscriptionCard.schema.ts
/**
 * @file DashboardSubscriptionCard.schema.ts
 * @description Aparato de validación atómico y SSoT. Define el contrato de datos
 *              para el namespace de internacionalización
 *              'components.dashboard.DashboardSubscriptionCard', garantizando la
 *              seguridad de tipos para la UI de suscripciones.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { z } from "zod";

export const DashboardSubscriptionCardSchema = z.object({
  title: z.string().describe("Título de la sección, ej. 'Suscripción Actual'."),
  view_all_button: z
    .string()
    .describe("Texto para el botón 'Ver Todo' o 'Gestionar Suscripción'."),
  no_active_subscriptions: z
    .string()
    .describe("Mensaje a mostrar cuando no hay suscripciones activas."),
  plan_free_name: z.string().describe("Nombre del plan gratuito."),
  plan_free_description: z.string().describe("Descripción del plan gratuito."),
  plan_free_price: z
    .string()
    .describe("Texto de precio para el plan gratuito."),
  plan_pro_name: z.string().describe("Nombre del plan Pro."),
  plan_pro_description: z.string().describe("Descripción del plan Pro."),
  plan_pro_price: z.string().describe("Texto de precio para el plan Pro."),
  frequency_monthly: z.string().describe("Etiqueta para frecuencia mensual."),
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **Soporte para Múltiples Planes**: A medida que se añadan más planes de precios (ej. 'basic', 'enterprise'), se añadirán aquí las claves correspondientes (`plan_basic_name`, etc.) para mantener el contrato sincronizado.
 * 2. **Textos de Estado de Suscripción**: Si la UI necesita mostrar diferentes estados de suscripción (ej. 'trialing', 'past_due'), se añadirán las claves de traducción correspondientes a este schema.
 * 3. **Validación `.min(1)`**: Para una robustez de élite, todas las propiedades `z.string()` pueden ser encadenadas con `.min(1)` para asegurar que ninguna clave de traducción en los archivos `.json` esté accidentalmente vacía.
 * =====================================================================
 */
