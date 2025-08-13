// src/lib/validators/i18n/LegalNoticePage.schema.ts
/**
 * @file LegalNoticePage.schema.ts
 * @description Define el contrato de datos para el namespace 'LegalNoticePage'.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

export const LegalNoticePageSchema = z.object({
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
// src/lib/validators/i18n/LegalNoticePage.schema.ts
