// src/lib/validators/i18n/ChooseLanguagePage.schema.ts
/**
 * @file ChooseLanguagePage.schema.ts
 * @description Define el contrato de datos para el namespace 'ChooseLanguagePage'.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

export const ChooseLanguagePageSchema = z.object({
  title: z.string(),
  selectFromListText: z.string(),
  redirectText: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad**: ((Implementada)) Schema aislado para su namespace.
 * =====================================================================
 */
// src/lib/validators/i18n/ChooseLanguagePage.schema.ts
