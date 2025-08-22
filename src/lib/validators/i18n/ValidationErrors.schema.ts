// src/lib/validators/i18n/ValidationErrors.schema.ts
/**
 * @file ValidationErrors.schema.ts
 * @description Define el contrato de datos para el namespace 'ValidationErrors'.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

export const ValidationErrorsSchema = z.object({
  invalid_uuid: z.string(),
  name_required: z.string(),
  name_too_short: z.string(),
  name_too_long: z.string(),
  subdomain_too_short: z.string(),
  subdomain_invalid_chars: z.string(),
  invalid_email: z.string(),
  password_too_short: z.string(),
  passwords_do_not_match: z.string(),
  terms_must_be_accepted: z.string(),
  slug_too_short: z.string(),
  slug_invalid_chars: z.string(),
  fingerprint_required: z.string(),
  invalid_ip: z.string(),
  icon_required: z.string(),
  error_server_generic: z.string(),
  error_user_already_exists: z.string(),
  error_signup_failed: z.string(),
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Contrato de Errores Centralizado**: ((Implementada)) ((Vigente)) Crea la SSoT para los mensajes de error de validación.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/ValidationErrors.schema.ts
