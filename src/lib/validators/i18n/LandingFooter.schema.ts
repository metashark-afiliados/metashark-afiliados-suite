// src/lib/validators/i18n/LandingFooter.schema.ts
/**
 * @file LandingFooter.schema.ts
 * @description Define el contrato de datos para el namespace 'LandingFooter'.
 *              Sincronizado para incluir la estructura anidada de los enlaces.
 * @author Raz Podestá
 * @version 2.0.0
 */
import { z } from "zod";

export const LandingFooterSchema = z.object({
  brand_name: z.string(),
  logo_alt_text: z.string(),
  slogan: z.string(),
  product: z.string(),
  company: z.string(),
  stayUpdated: z.string(),
  newsletterPrompt: z.string(),
  subscribe: z.string(),
  placeholder_email: z.string(),
  allRightsReserved: z.string(),
  productLinks: z.object({
    features: z.string(),
    process: z.string(),
    pricing: z.string(),
  }),
  companyLinks: z.object({
    about: z.string(),
    blog: z.string(),
  }),
  legalLinks: z.object({
    privacy: z.string(),
    terms: z.string(),
  }),
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de SSoT de Tipos**: ((Implementada)) El schema Zod ahora valida la nueva estructura anidada del archivo de mensajes, garantizando la integridad del contrato de datos en toda la aplicación.
 *
 * =====================================================================
 */
