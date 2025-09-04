// src/lib/validators/i18n/errors/NewsletterErrors.schema.ts
/**
 * @file NewsletterErrors.schema.ts
 * @description Aparato de validación atómico y SSoT para los mensajes de
 *              feedback (éxito y error) del dominio de la newsletter.
 * @author L.I.A. Legacy
 * @version 1.1.0
 */
import { z } from "zod";

export const NewsletterErrorsSchema = z.object({
  success_duplicate: z.string(),
  success_new: z.string(),
  error_invalid_email: z.string(),
  error_unexpected: z.string(),
});
// src/lib/validators/i18n/errors/NewsletterErrors.schema.ts
