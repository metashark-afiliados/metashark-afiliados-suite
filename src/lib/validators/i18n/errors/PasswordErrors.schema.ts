// src/lib/validators/i18n/errors/PasswordErrors.schema.ts
/**
 * @file PasswordErrors.schema.ts
 * @description Aparato de validación atómico. Define el contrato de datos para
 *              mensajes de feedback de acciones de contraseña (restablecimiento,
 *              actualización) sin un prefijo de dominio. Incluye claves de éxito
 *              para un contrato de feedback completo.
 * @author @author RaZ Podestá - MetaShark Tech
 * @version 2.0.0
 * @see .docs-espejo/lib/validators/i18n/errors/PasswordErrors.schema.ts.md
 */
import { z } from "zod";

export const PasswordErrorsSchema = z.object({
  reset_invalid_email: z.string(),
  reset_too_many_requests: z.string(),
  update_invalid_data: z.string(),
  update_expired_link: z.string(),
  update_failed: z.string(),
  update_success: z
    .string()
    .describe(
      "Mensaje de éxito al actualizar la contraseña. Placeholder: {redirectDelay}"
    ),
});
// src/lib/validators/i18n/errors/PasswordErrors.schema.ts
