// src/lib/validators/i18n/ContactPage.schema.ts
/**
 * @file ContactPage.schema.ts
 * @description Define el contrato de datos para el namespace 'pages.ContactPage'.
 *              Sincronizado con la Directiva 3.4 (IMAS), validando la lista
 *              `contactInfo.cards` como un objeto con claves numéricas.
 * @author L.I.A Legacy
 * @version 3.0.0
 */
import { z } from "zod";

import { LucideIconNameSchema } from "@/config/lucide-icon-names";

/**
 * @private
 * @constant CardSchema
 * @description Define el contrato de datos para una única tarjeta de información de contacto.
 */
const CardSchema = z.object({
  icon: LucideIconNameSchema,
  title: z.string(),
  description: z.string(),
  value: z.string(),
  href: z.string().url().optional().or(z.string().optional()),
});

/**
 * @public
 * @constant ContactPageSchema
 * @description El schema Zod que valida la estructura completa del archivo de
 *              mensajes para la página de Contacto.
 */
export const ContactPageSchema = z.object({
  hero: z.object({
    title: z.string(),
    subtitle: z.string(),
  }),
  form: z.object({
    title: z.string(),
    nameLabel: z.string(),
    emailLabel: z.string(),
    inquiryLabel: z.string(),
    inquiryOptions: z.object({
      sales: z.string(),
      support: z.string(),
      general: z.string(),
    }),
    messageLabel: z.string(),
    submitButton: z.string(),
    sendingButton: z.string(),
  }),
  contactInfo: z.object({
    title: z.string(),
    // Validación de array de tarjetas como un record (objeto)
    cards: z.record(CardSchema),
  }),
});
// src/lib/validators/i18n/ContactPage.schema.ts
