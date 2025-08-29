// src/lib/validators/i18n/errors/ContactFormErrors.schema.ts
/**
 * @file ContactFormErrors.schema.ts
 * @description Aparato de validación atómico. Define el contrato de datos para
 *              mensajes de error de validación específicos del formulario de contacto
 *              sin un prefijo de dominio. Esta es la SSoT para los errores de este formulario.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
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

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **Errores de Rate Limiting**: ((Vigente)) Si el formulario de contacto implementa `rate limiting` en el futuro, se añadirán aquí los errores relacionados.
 * =====================================================================
 */
// src/lib/validators/i18n/errors/ContactFormErrors.schema.ts
