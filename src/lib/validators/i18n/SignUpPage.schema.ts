// src/lib/validators/i18n/SignUpPage.schema.ts
/**
 * @file SignUpPage.schema.ts
 * @description Define el contrato de datos para el namespace 'app.[locale].signup.page'.
 *              Ha sido depurado para eliminar claves que han sido migradas a la SSoT
 *              de la página de login, mejorando la cohesión.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
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
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Cohesión de Contrato (SRP)**: ((Implementada)) Se ha eliminado la clave `dontHaveAccount`. Este schema ahora se adhiere estrictamente al Principio de Responsabilidad Única, definiendo únicamente los textos para la vista de registro.
 *
 * @subsection Melhorias Futuras
 * 1. **Revisión de Claves**: ((Vigente)) Las claves `terms_label` y otras relacionadas con el formulario podrían ser migradas a un namespace de componente compartido (`SignUpForm.schema.ts`) si se decidiera refactorizar el formulario de registro a un componente de presentación puro.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/SignUpPage.schema.ts
