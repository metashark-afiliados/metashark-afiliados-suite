// src/lib/validators/i18n/errors/GenericErrors.schema.ts
/**
 * @file GenericErrors.schema.ts
 * @description Aparato de validación atómico. Define el contrato de datos para
 *              mensajes de error de validación genéricos, sin un prefijo de
 *              dominio específico.
 * @author @author RaZ Podestá - MetaShark Tech
 * @version 1.0.0
 * @see .docs-espejo/lib/validators/i18n/errors/GenericErrors.schema.ts.md
 */
import { z } from "zod";

export const GenericErrorsSchema = z.object({
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
  message_required: z.string(),
  error_server_generic: z.string(),
  error_user_already_exists: z.string(),
  error_signup_failed: z.string(),
  error_unauthenticated: z.string(),
  error_permission_denied: z.string(),
  error_invalid_data: z.string(),
  error_creation_failed: z.string(),
  error_update_failed: z.string(),
  error_delete_failed: z.string(),
  error_last_owner_cannot_delete: z.string(),
  error_no_active_workspace: z.string(),
  error_too_many_requests: z.string(),
  error_unexpected: z.string(),
  no_data_available: z.string(),
});
// src/lib/validators/i18n/errors/GenericErrors.schema.ts
