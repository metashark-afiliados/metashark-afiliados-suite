// src/lib/validators/schemas/password.schemas.ts
/**
 * @file src/lib/validators/schemas/password.schemas.ts
 * @description Aparato de validación atómico y SSoT para el dominio de gestión
 *              de contraseñas.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { z } from "zod";
import { EmailSchema, PasswordSchema } from "./_base.schemas";
import { type ValidationErrorKey } from "..";

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
    message: "generic.passwords_do_not_match" as ValidationErrorKey,
    path: ["confirmPassword"],
  });

/**
 * @public
 * @constant RequestPasswordResetSchema
 * @description Valida el payload para solicitar un reseteo de contraseña.
 */
export const RequestPasswordResetSchema = z.object({
  email: EmailSchema,
});
// src/lib/validators/schemas/password.schemas.ts
