// src/lib/validators/i18n/ValidationErrors.schema.ts
/**
 * @file ValidationErrors.schema.ts
 * @description Define el contrato de datos para el namespace 'shared.ValidationErrors'.
 *              Ha sido enriquecido para incluir claves de error de autenticación
 *              y de contexto, resolviendo errores de tipo TS2345 en los consumidores.
 * @author Raz Podestá
 * @version 2.0.0
 * @date 2025-08-27
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
  // --- INICIO DE ENRIQUECIMIENTO DE CONTRATO (TS2345) ---
  error_unauthenticated: z.string(),
  error_no_active_workspace: z.string(),
  // --- FIN DE ENRIQUECIMIENTO DE CONTRATO (TS2345) ---
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Resolución Sistémica de `TS2345`**: Se han añadido las claves `error_unauthenticated` y `error_no_active_workspace` al schema. Esto alinea el contrato de datos con su uso real en `sites-client.tsx`, resolviendo la causa raíz del error de compilación.
 *
 * @subsection Melhorias Futuras
 * 1. **Descripciones Detalladas**: ((Vigente)) Añadir `.describe()` a cada propiedad para proporcionar contexto a los traductores.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/ValidationErrors.schema.ts
