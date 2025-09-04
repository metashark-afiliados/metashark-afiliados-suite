// src/lib/validators/i18n/errors/OnboardingErrors.schema.ts
/**
 * @file OnboardingErrors.schema.ts
 * @description Aparato de validación atómico. Define el contrato de datos para
 *              mensajes de error de acciones de onboarding sin un prefijo de dominio.
 * @author @author RaZ Podestá - MetaShark Tech
 * @version 1.0.0
 * @see .docs-espejo/lib/validators/i18n/errors/OnboardingErrors.schema.ts.md
 */
import { z } from "zod";

export const OnboardingErrorsSchema = z.object({
  unauthenticated: z.string(),
  update_failed: z.string(),
});
// src/lib/validators/i18n/errors/OnboardingErrors.schema.ts
