// src/lib/validators/i18n/SupabaseAuthUI.schema.ts
/**
 * @file SupabaseAuthUI.schema.ts
 * @description Aparato de validación atómico. Define el contrato de datos para
 *              el namespace 'components.auth.SupabaseAuthUI', garantizando la
 *              seguridad de tipos para la internacionalización de la UI de Supabase.
 * @author @author RaZ Podestá - MetaShark Tech
 * @version 1.0.0
 * @see .docs-espejo/lib/validators/i18n/SupabaseAuthUI.schema.ts.md
 */
import { z } from "zod";

export const SupabaseAuthUISchema = z.object({
  magic_link_sent_title: z.string(),
  magic_link_sent_message: z.string(),
  confirmation_message: z.string(),
});
// src/lib/validators/i18n/SupabaseAuthUI.schema.ts
