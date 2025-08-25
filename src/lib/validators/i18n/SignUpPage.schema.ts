// src/lib/validators/i18n/SignUpPage.schema.ts
/**
 * @file SignUpPage.schema.ts
 * @description Define el contrato de datos para el namespace 'app.[locale].signup.page'.
 *              Sincronizado para incluir la clave del enlace inferior.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { z } from "zod";

export const SignUpPageSchema = z.object({
  metadataTitle: z.string(),
  title: z.string(),
  subtitle: z.string(),
  email_label: z.string(),
  password_label: z.string(),
  confirm_password_label: z.string(),
  legalNotice: z.string(),
  signUpButton: z.string(),
  signUpButton_pending: z.string(),
  strength_weak: z.string(),
  strength_fair: z.string(),
  strength_good: z.string(),
  strength_strong: z.string(),
  newsletter_label: z.string(),
  alreadyHaveAccount: z.string(), // Clave para el enlace "Already have an account? Sign in"
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Contrato**: ((Implementada)) Se ha reintroducido la clave `alreadyHaveAccount`, asegurando que la página de registro tenga todas las traducciones que necesita sin depender de otros namespaces.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/SignUpPage.schema.ts
