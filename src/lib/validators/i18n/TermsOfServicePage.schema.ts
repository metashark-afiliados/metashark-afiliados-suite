// src/lib/validators/i18n/TermsOfServicePage.schema.ts
/**
 * @file TermsOfServicePage.schema.ts
 * @description Define el contrato de datos para el namespace 'TermsOfServicePage'.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

export const TermsOfServicePageSchema = z.object({
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
// src/lib/validators/i18n/TermsOfServicePage.schema.ts
