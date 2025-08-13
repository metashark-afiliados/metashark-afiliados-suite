// src/lib/validators/i18n/BlogPage.schema.ts
/**
 * @file BlogPage.schema.ts
 * @description Define el contrato de datos para el namespace 'BlogPage'.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

export const BlogPageSchema = z.object({
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
// src/lib/validators/i18n/BlogPage.schema.ts
