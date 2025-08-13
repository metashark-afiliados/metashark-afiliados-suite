// src/lib/validators/i18n/AuthLayout.schema.ts
/**
 * @file AuthLayout.schema.ts
 * @description Define el contrato de datos para el namespace 'AuthLayout'.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

export const AuthLayoutSchema = z.object({
  /** Aria-label para el enlace del logo que lleva a la homepage. */
  go_back_home_aria: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad**: ((Implementada)) Schema aislado para su namespace.
 * =====================================================================
 */
// src/lib/validators/i18n/AuthLayout.schema.ts
