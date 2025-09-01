// src/lib/validators/schemas/auth.schemas.ts
/**
 * @file src/lib/validators/schemas/auth.schemas.ts
 * @description Aparato de validación atómico y SSoT para el ciclo de vida de
 *              autenticación. Enriquecido con `SignInSchema` para completar
 *              el contrato de validación del módulo.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-09-01
 */
import { z } from "zod";
import { EmailSchema, PasswordSchema } from "./_base.schemas";

/**
 * @public
 * @constant SignInSchema
 * @description Valida el payload para el inicio de sesión con email y contraseña.
 */
export const SignInSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
});

/**
 * @public
 * @constant SignUpSchema
 * @description Valida el payload completo para el registro de un nuevo usuario.
 *              Incluye una refinación para asegurar que las contraseñas coincidan.
 */
export const SignUpSchema = z
  .object({
    email: EmailSchema,
    password: PasswordSchema,
    confirmPassword: PasswordSchema,
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "ValidationErrors.generic.terms_must_be_accepted",
    }),
    newsletterSubscribed: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "ValidationErrors.generic.passwords_do_not_match",
    path: ["confirmPassword"],
  });

/**
 * @public
 * @constant ResetPasswordSchema
 * @description Valida el payload para la actualización de una contraseña
 *              durante el flujo de restablecimiento.
 */
export const ResetPasswordSchema = z
  .object({
    password: PasswordSchema,
    confirmPassword: PasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "ValidationErrors.generic.passwords_do_not_match",
    path: ["confirmPassword"],
  });
// src/lib/validators/schemas/auth.schemas.ts
