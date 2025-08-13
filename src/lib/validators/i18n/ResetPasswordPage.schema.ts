// src/lib/validators/i18n/ResetPasswordPage.schema.ts
/**
 * @file ResetPasswordPage.schema.ts
 * @description Define el contrato de datos para el namespace 'ResetPasswordPage'.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

export const ResetPasswordPageSchema = z.object({
  title: z.string(),
  newPasswordLabel: z.string(),
  confirmPasswordLabel: z.string(),
  submitButton: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad**: ((Implementada)) Schema aislado para su namespace.
 * =====================================================================
 */
// src/lib/validators/i18n/ResetPasswordPage.schema.ts
