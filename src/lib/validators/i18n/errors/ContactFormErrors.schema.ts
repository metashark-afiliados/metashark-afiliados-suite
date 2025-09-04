// src/lib/validators/i18n/errors/ContactFormErrors.schema.ts
/**
 * @file ContactFormErrors.schema.ts
 * @description Aparato de validación atómico. Define el contrato de datos para
 *              mensajes de feedback (éxito y error) específicos del formulario
 *              de contacto, sin un prefijo de dominio. Esta es la SSoT para los
 *              errores y éxitos de este formulario.
 * @author @author RaZ Podestá - MetaShark Tech
 * @version 1.0.0
 * @see .docs-espejo/lib/validators/i18n/errors/ContactFormErrors.schema.ts.md
 */
import { z } from "zod";

export const ContactFormErrorsSchema = z.object({
  name_required: z.string(),
  name_too_short: z.string(),
  email_required: z.string(),
  email_invalid: z.string(),
  inquiry_type_required: z.string(),
  inquiry_type_invalid: z.string(),
  message_required: z.string(),
  message_too_short: z.string(),
  send_email_failed: z.string(),
  invalid_data: z.string(),
  success_toast: z.string(),
});
// src/lib/validators/i18n/errors/ContactFormErrors.schema.ts
