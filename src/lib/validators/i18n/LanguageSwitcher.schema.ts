// src/lib/validators/i18n/LanguageSwitcher.schema.ts
/**
 * @file LanguageSwitcher.schema.ts
 * @description Define el contrato de datos para el namespace 'LanguageSwitcher'.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

export const LanguageSwitcherSchema = z.object({
  selectLanguage_sr: z.string(),
  language_en_US: z.string(),
  flag_en_US: z.string(),
  language_es_ES: z.string(),
  flag_es_ES: z.string(),
  language_pt_BR: z.string(),
  flag_pt_BR: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad**: ((Implementada)) Schema aislado para su namespace.
 * =====================================================================
 */
// src/lib/validators/i18n/LanguageSwitcher.schema.ts
