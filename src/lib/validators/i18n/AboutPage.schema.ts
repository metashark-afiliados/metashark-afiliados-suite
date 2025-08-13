// src/lib/validators/i18n/AboutPage.schema.ts
/**
 * @file AboutPage.schema.ts
 * @description Define el contrato de datos para el namespace 'AboutPage'.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

export const AboutPageSchema = z.object({
  /** Título de la página "Sobre Nosotros". */
  title: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad**: ((Implementada)) Schema aislado para su namespace.
 * =====================================================================
 */
// src/lib/validators/i18n/AboutPage.schema.ts
