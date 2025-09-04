// src/lib/validators/i18n/LandingHeader.schema.ts
/**
 * @file LandingHeader.schema.ts
 * @description Define el contrato de datos para el namespace 'Header' dentro de `landing.json`.
 *              Este aparato atómico de validación es consumido por la infraestructura
 *              de i18n para garantizar la seguridad de tipos. Ha sido sincronizado
 *              con la estructura de datos que incluye el array `navLinks`.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 2.0.0
 */
import { z } from "zod";

const LinkSchema = z.object({
  label: z.string(),
  href: z.any(), // Para ser compatible con el tipo Route de next-intl que puede ser un string o un objeto.
});

export const LandingHeaderSchema = z.object({
  navLinks: z.array(LinkSchema),
  signIn: z.string(),
  signUp: z.string(),
  openMenu: z.string(),
});
// src/lib/validators/i18n/LandingHeader.schema.ts
