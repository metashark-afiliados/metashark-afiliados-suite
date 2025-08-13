// src/lib/validators/i18n/HeroSection.schema.ts
/**
 * @file HeroSection.schema.ts
 * @description Define el contrato de datos para el namespace 'HeroSection'.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

export const HeroSectionSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  ctaPrimary: z.string(),
  ctaSecondary: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad**: ((Implementada)) Schema aislado para su namespace.
 * =====================================================================
 */
// src/lib/validators/i18n/HeroSection.schema.ts
