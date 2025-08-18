// src/lib/validators/i18n/LandingFooter.schema.ts
/**
 * @file LandingFooter.schema.ts
 * @description Define el contrato de datos para el namespace 'LandingFooter'.
 *              Sincronizado para incluir la clave `placeholder_email`.
 * @author Raz Podestá
 * @version 1.1.0
 */
import { z } from "zod";

export const LandingFooterSchema = z.object({
  slogan: z.string(),
  product: z.string(),
  company: z.string(),
  stayUpdated: z.string(),
  newsletterPrompt: z.string(),
  subscribe: z.string(),
  placeholder_email: z.string(), // <-- SINCRONIZADO
  allRightsReserved: z.string(),
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Contrato**: ((Implementada)) Se ha añadido la clave `placeholder_email`, resolviendo el `IntlError: MISSING_MESSAGE`.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/LandingFooter.schema.ts
