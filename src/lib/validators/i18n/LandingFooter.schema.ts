// src/lib/validators/i18n/LandingFooter.schema.ts
/**
 * @file LandingFooter.schema.ts
 * @description Define el contrato de datos para el namespace 'Footer' dentro de `landing.json`.
 *              Este schema valida la estructura completa del pie de página. Ha sido
 *              sincronizado con las claves de contenido reales del `landing.json`.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 2.0.0
 */
import { z } from "zod";

const LinkSchema = z.object({
  label: z.string(),
  href: z.any(), // Para ser compatible con el tipo Route de next-intl que puede ser un string o un objeto.
});

// Este objeto ahora refleja la estructura REAL del landing.json
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
  productLinks: z.record(z.string()), // Los links son objetos, no arrays
  companyLinks: z.record(z.string()),
  legalLinks: z.record(z.string()),
});
// src/lib/validators/i18n/LandingFooter.schema.ts
