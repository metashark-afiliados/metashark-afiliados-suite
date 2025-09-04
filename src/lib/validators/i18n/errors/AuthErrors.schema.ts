// src/lib/validators/i18n/errors/AuthErrors.schema.ts
/**
 * @file AuthErrors.schema.ts
 * @description Aparato de validación atómico. Define el contrato de datos para
 *              mensajes de error de autenticación (login, OAuth, perfil)
 *              sin un prefijo de dominio.
 * @author @author RaZ Podestá - MetaShark Tech
 * @version 1.0.0
 * @see .docs-espejo/lib/validators/i18n/errors/AuthErrors.schema.ts.md
 */
import { z } from "zod";

export const AuthErrorsSchema = z.object({
  login_invalid_credentials: z.string(),
  oauth_failed: z.string(),
  oauth_provider_missing: z.string(),
  profile_creation_failed: z.string(),
});
// src/lib/validators/i18n/errors/AuthErrors.schema.ts
