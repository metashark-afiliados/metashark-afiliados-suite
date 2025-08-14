// src/lib/validators/i18n/WelcomePage.schema.ts
/**
 * @file WelcomePage.schema.ts
 * @description Define el contrato de datos para el namespace 'WelcomePage'.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

export const WelcomePageSchema = z.object({
  metadata_title: z.string(),
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad**: ((Implementada)) Schema aislado para su namespace.
 * =====================================================================
 */
// src/lib/validators/i18n/WelcomePage.schema.ts
