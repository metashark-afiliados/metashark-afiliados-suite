// src/lib/validators/i18n/LandingHeader.schema.ts
/**
 * @file LandingHeader.schema.ts
 * @description Define el contrato de datos para el namespace 'Header' dentro de `landing.json`.
 *              Este aparato atómico de validación es consumido por la infraestructura
 *              de i18n para garantizar la seguridad de tipos.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
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
// src/lib/validators/i18n/LandingHeader.schema.ts