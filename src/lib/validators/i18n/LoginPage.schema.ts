// src/lib/validators/i18n/LoginPage.schema.ts
/**
 * @file LoginPage.schema.ts
 * @description Define el contrato de datos consolidado y SSoT para el namespace
 *              'app.[locale].login.page', unificando todos los textos necesarios
 *              para la vista de inicio de sesión.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { z } from "zod";

export const LoginPageSchema = z.object({
  metadataTitle: z.string(),
  title: z.string(),
  subtitle: z.string(),
  email_label: z.string(),
  password_label: z.string(),
  forgot_password_link: z.string(),
  signInButton: z.string(),
  signInButton_pending: z.string(),
  signInWith: z.string(),
  signInWithProvider: z.string().describe("Ej: 'Continuar con {provider}'"),
  dontHaveAccount: z.string(),
  error_invalid_credentials: z.string(),
  error_oauth_failed: z.string(),
  error_oauth_provider_missing: z.string(),
  error_profile_creation_failed: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Contrato de Datos Autocontenido**: ((Implementada)) El schema ahora valida todas las claves que la página de login necesita, incluyendo `signInWith` y `dontHaveAccount`, completando la soberanía de su contrato de i18n.
 *
 * =====================================================================
 */
