// src/lib/validators/schemas/auth.schemas.ts
/**
 * @file src/lib/validators/schemas/auth.schemas.ts
 * @description Aparato de validación atómico y SSoT para el ciclo de vida de
 *              autenticación. Sincronizado para incluir el contrato `OAuthSchema`,
 *              blindando la validación del proveedor de OAuth.
 * @author RaZ Podestá - MetaShark Tech
 * @version 3.0.0
 */
import { z } from "zod";
import { EmailSchema, PasswordSchema } from "./_base.schemas";

/**
 * @public
 * @constant OAuthSchema
 * @description Valida el payload para el inicio de un flujo de autenticación OAuth.
 *              Garantiza que el proveedor sea uno de los soportados.
 */
export const OAuthSchema = z.object({
  provider: z.enum(["google", "apple"]), // SSoT de proveedores permitidos
});

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
