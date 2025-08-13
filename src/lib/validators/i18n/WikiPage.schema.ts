// src/lib/validators/i18n/WikiPage.schema.ts
/**
 * @file WikiPage.schema.ts
 * @description Define el contrato de datos para el namespace 'WikiPage'.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

export const WikiPageSchema = z.object({
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
// src/lib/validators/i18n/WikiPage.schema.ts
