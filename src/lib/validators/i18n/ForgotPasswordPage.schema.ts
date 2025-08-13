// src/lib/validators/i18n/ForgotPasswordPage.schema.ts
/**
 * @file ForgotPasswordPage.schema.ts
 * @description Define el contrato de datos para el namespace 'ForgotPasswordPage'.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

export const ForgotPasswordPageSchema = z.object({
  title: z.string(),
  description: z.string(),
  emailLabel: z.string(),
  submitButton: z.string(),
  sendingButton: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad**: ((Implementada)) Schema aislado para su namespace.
 * =====================================================================
 */
// src/lib/validators/i18n/ForgotPasswordPage.schema.ts
