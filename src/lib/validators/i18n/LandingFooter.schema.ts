// src/lib/validators/i18n/LandingFooter.schema.ts
/**
 * @file LandingFooter.schema.ts
 * @description Define el contrato de datos para el namespace 'Footer' dentro de `landing.json`.
 *              Este schema valida la estructura completa del pie de página, incluyendo
 *              los arrays de objetos de enlace.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
import { z } from "zod";

const LinkSchema = z.object({
  label: z.string(),
  href: z.any(), // Para ser compatible con el tipo Route de next-intl que puede ser un string o un objeto.
});

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
  productLinks: z.array(LinkSchema),
  companyLinks: z.array(LinkSchema),
  legalLinks: z.array(LinkSchema),
});
// src/lib/validators/i18n/LandingFooter.schema.ts
