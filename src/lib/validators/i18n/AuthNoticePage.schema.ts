// src/lib/validators/i18n/AuthNoticePage.schema.ts
/**
 * @file AuthNoticePage.schema.ts
 * @description Define el contrato de datos para el namespace 'AuthNoticePage'.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

export const AuthNoticePageSchema = z.object({
  confirmation: z.object({ title: z.string(), description: z.string() }),
  reset: z.object({ title: z.string(), description: z.string() }),
  default: z.object({ title: z.string(), description: z.string() }),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad**: ((Implementada)) Schema aislado para su namespace.
 * =====================================================================
 */
// src/lib/validators/i18n/AuthNoticePage.schema.ts
