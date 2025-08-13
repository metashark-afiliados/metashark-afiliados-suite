// src/lib/validators/i18n/LandingHeader.schema.ts
/**
 * @file LandingHeader.schema.ts
 * @description Define el contrato de datos para el namespace 'LandingHeader'.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

export const LandingHeaderSchema = z.object({
  features: z.string(),
  pricing: z.string(),
  signIn: z.string(),
  signUp: z.string(),
  openMenu: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad**: ((Implementada)) Schema aislado para su namespace.
 * =====================================================================
 */
// src/lib/validators/i18n/LandingHeader.schema.ts
