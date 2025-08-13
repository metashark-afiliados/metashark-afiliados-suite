// src/lib/validators/i18n/ContactPage.schema.ts
/**
 * @file ContactPage.schema.ts
 * @description Define el contrato de datos para el namespace 'ContactPage'.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

export const ContactPageSchema = z.object({
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
// src/lib/validators/i18n/ContactPage.schema.ts
