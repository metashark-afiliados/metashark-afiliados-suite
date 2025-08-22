// src/lib/validators/i18n/SignUpPage.schema.ts
/**
 * @file src/lib/validators/i18n/SignUpPage.schema.ts
 * @description Define el contrato de datos para el namespace 'SignUpPage'.
 * @author Raz Podestá
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
  alreadyHaveAccount: z.string(),
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Contrato Atómico de Registro**: ((Implementada)) ((Vigente)) Se ha creado el contrato de datos completo para la UI del flujo de registro.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/SignUpPage.schema.ts
