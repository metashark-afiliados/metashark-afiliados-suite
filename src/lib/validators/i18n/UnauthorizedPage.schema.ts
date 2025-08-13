// src/lib/validators/i18n/UnauthorizedPage.schema.ts
/**
 * @file UnauthorizedPage.schema.ts
 * @description Define el contrato de datos para el namespace 'UnauthorizedPage'.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

export const UnauthorizedPageSchema = z.object({
  title: z.string(),
  description: z.string(),
  back_to_dashboard_button: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad**: ((Implementada)) Schema aislado para su namespace.
 * =====================================================================
 */
// src/lib/validators/i18n/UnauthorizedPage.schema.ts
