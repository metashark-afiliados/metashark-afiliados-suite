// src/lib/validators/i18n/errors/GenericErrors.schema.ts
/**
 * @file GenericErrors.schema.ts
 * @description Aparato de validación atómico. Define el contrato de datos para
 *              mensajes de error de validación genéricos, sin un prefijo de
 *              dominio específico.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
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
  no_data_available: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical (SRP)**: ((Implementada)) Este nuevo aparato encapsula los errores de validación genéricos, mejorando la modularidad y la organización de la capa de validación.
 * 2. **Base para Composición**: ((Implementada)) Al no tener prefijos de dominio, es la base ideal para ser compuesta en el `ValidationErrorsSchema` principal, donde se aplicarán los prefijos.
 *
 * @subsection Melhorias Futuras
 * 1. **Categorización de Errores**: ((Vigente)) Si la lista de errores genéricos crece, se podría considerar dividirlos aún más (ej., `FormErrors.schema.ts`, `SystemErrors.schema.ts`).
 *
 * =====================================================================
 */
