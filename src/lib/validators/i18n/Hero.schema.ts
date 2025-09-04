// src/lib/validators/i18n/Hero.schema.ts
/**
 * @file Hero.schema.ts
 * @description Define el contrato de datos para el namespace 'Hero' dentro de `landing.json`.
 *              Este aparato atómico de validación es consumido por la infraestructura
 *              de i18n para garantizar la seguridad de tipos. Ha sido sincronizado
 *              con las claves de contenido corregidas.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 2.0.0
 */
import { z } from "zod";

export const HeroSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  ctaPrimary: z.string(),
  ctaSecondary: z.string(),
});
// src/lib/validators/i18n/Hero.schema.ts