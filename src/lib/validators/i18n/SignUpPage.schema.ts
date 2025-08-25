// src/lib/validators/i18n/SignUpPage.schema.ts
/**
 * @file SignUpPage.schema.ts
 * @description Define el contrato de datos para el namespace 'app.[locale].signup.page'.
 *              Sincronizado para incluir el ciclo de vida completo de OAuth.
 * @author Raz Podestá - MetaShark Tech
 * @version 4.0.0
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
  alreadyHaveAccount: z.string(),
  signInWith: z.string(),
  signInWithProvider: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Contrato Completo**: ((Implementada)) Se han añadido las claves `alreadyHaveAccount`, `signInWith` y `signInWithProvider`, asegurando que la página de registro sea un módulo 100% autocontenido.
 *
 * =====================================================================
 */
