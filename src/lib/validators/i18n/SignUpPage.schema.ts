// src/lib/validators/i18n/SignUpPage.schema.ts
/**
 * @file SignUpPage.schema.ts
 * @description Define el contrato de datos para el namespace 'SignUpPage',
 *              utilizado en la página de registro dedicada.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { z } from "zod";

export const SignUpPageSchema = z.object({
  metadataTitle: z.string(),
  title: z.string(),
  subtitle: z.string(),
  email_label: z.string(),
  password_label: z.string(),
  confirm_password_label: z.string(),
  terms_label: z.string(),
  signUpButton: z.string(),
  signUpButton_pending: z.string(),
  dontHaveAccount: z.string(),
  legalNotice: z.string(),
  strength_weak: z.string(),
  strength_fair: z.string(),
  strength_good: z.string(),
  strength_strong: z.string(),
  newsletter_label: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Contrato Atómico**: ((Implementada)) Se ha creado el schema faltante, un paso crítico para la integridad del sistema i18n.
 * =====================================================================
 */
// src/lib/validators/i18n/SignUpPage.schema.ts
