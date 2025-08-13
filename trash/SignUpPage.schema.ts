// src/lib/validators/i18n/SignUpPage.schema.ts
/**
 * @file SignUpPage.schema.ts
 * @description Define el contrato de datos para el namespace 'SignUpPage'.
 *              Ha sido nivelado para incluir las claves de validación y
 *              los nuevos checkboxes.
 * @author Raz Podestá
 * @version 2.0.0
 */
import { z } from "zod";

export const SignUpPageSchema = z.object({
  metadataTitle: z.string(),
  title: z.string(),
  subtitle: z.string(),
  emailLabel: z.string(),
  passwordLabel: z.string(),
  confirmPasswordLabel: z.string(),
  signUpButton: z.string(),
  signUpButton_pending: z.string(),
  signUpWith: z.string(),
  legalNotice: z.string(),
  acceptTermsLabel: z.string(),
  subscribeToNewsletterLabel: z.string(),
  passwordStrength: z.object({
    strength: z.string(),
    veryWeak: z.string(),
    weak: z.string(),
    medium: z.string(),
    strong: z.string(),
    veryStrong: z.string(),
  }),
  // Errores de Zod
  error_password_too_short: z.string(),
  error_passwords_do_not_match: z.string(),
  error_accept_terms_required: z.string(),
});
// src/lib/validators/i18n/SignUpPage.schema.ts
