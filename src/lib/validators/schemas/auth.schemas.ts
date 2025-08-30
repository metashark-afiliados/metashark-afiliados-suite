// src/lib/validators/schemas/auth.schemas.ts
/**
 * @file src/lib/validators/schemas/auth.schemas.ts
 * @description Aparato de validación atómico y SSoT para el ciclo de vida de
 *              autenticación. Este módulo encapsula todos los schemas de Zod
 *              relacionados con el registro (signup) y la gestión de contraseñas.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { z } from "zod";
import { EmailSchema, PasswordSchema } from "./_base.schemas";

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

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **`SignInSchema`**: Crear un `SignInSchema` que valide explícitamente `email` y `password` para el flujo de inicio de sesión, en lugar de validar los campos por separado en la Server Action.
 * 2. **Complejidad de Contraseña con Mensajes Múltiples**: Mejorar el `PasswordSchema` en `_base.schemas.ts` para que valide múltiples criterios (mayúsculas, números, símbolos) y utilizar un `.refine()` aquí para devolver un array de mensajes de error si múltiples criterios fallan, proporcionando un feedback más granular al usuario.
 * 3. **Validación de Token de Restablecimiento**: Para una seguridad de élite, la Server Action `updatePasswordAction` podría aceptar un token del `searchParams` y el `ResetPasswordSchema` podría ser extendido para validarlo (ej. `resetToken: z.string().uuid()`).
 * 4. **Internacionalización de Mensajes Zod**: Centralizar la lógica de traducción de los mensajes de error de Zod utilizando `z.setErrorMap`, en lugar de manejarlo en cada `toast.error`.
 * 5. **Schema para `signInWithOAuth`**: Crear un `OAuthSchema` que valide que el `provider` es uno de los valores permitidos (ej. `z.enum(["google", "apple"])`), para ser usado en la `signInWithOAuthAction`.
 * =====================================================================
 */
// src/lib/validators/schemas/auth.schemas.ts
