// src/lib/validators/i18n/ValidationErrors.schema.ts
/**
 * @file ValidationErrors.schema.ts
 * @description Define el contrato de datos para el namespace 'ValidationErrors'.
 *              Este schema es la SSoT para todos los mensajes de error de
 *              validación de Zod, permitiendo su completa internacionalización.
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
  slug_too_short: z.string(),
  slug_invalid_chars: z.string(),
  fingerprint_required: z.string(),
  invalid_ip: z.string(),
  icon_required: z.string(),
  error_server_generic: z.string(),
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Contrato de Errores Centralizado**: ((Implementada)) Este nuevo aparato atómico crea una SSoT para los mensajes de error de validación, desacoplándolos de la lógica de los schemas de Zod.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/ValidationErrors.schema.ts