// src/lib/validators/i18n/LandingFooter.schema.ts
/**
 * @file LandingFooter.schema.ts
 * @description Define el contrato de datos para el namespace 'LandingFooter'.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

export const LandingFooterSchema = z.object({
  slogan: z.string(),
  product: z.string(),
  company: z.string(),
  contact: z.string(),
  stayUpdated: z.string(),
  newsletterPrompt: z.string(),
  subscribe: z.string(),
  allRightsReserved: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad**: ((Implementada)) Schema aislado para su namespace.
 * =====================================================================
 */
// src/lib/validators/i18n/LandingFooter.schema.ts
