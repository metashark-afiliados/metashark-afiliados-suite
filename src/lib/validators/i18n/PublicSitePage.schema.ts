// src/lib/validators/i18n/PublicSitePage.schema.ts
/**
 * @file PublicSitePage.schema.ts
 * @description Define el contrato de datos para el namespace 'PublicSitePage'.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

export const PublicSitePageSchema = z.object({
  metadata: z.object({
    notFoundTitle: z.string(),
    title: z.string(),
    description: z.string(),
  }),
  welcomeMessage: z.string(),
  customPageDescription: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad**: ((Implementada)) Schema aislado para su namespace.
 * =====================================================================
 */
// src/lib/validators/i18n/PublicSitePage.schema.ts
