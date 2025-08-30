// src/lib/validators/schemas/_base.schemas.ts
/**
 * @file src/lib/validators/schemas/_base.schemas.ts
 * @description Aparato de validación atómico y SSoT para los schemas de Zod
 *              primitivos y reutilizables en toda la aplicación. Este módulo
 *              es la fundación sobre la que se construyen todos los demás
 *              schemas de validación de entidades.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { z } from "zod";

/**
 * @public
 * @constant UuidSchema
 * @description Valida que un string sea un UUID válido. El mensaje de error
 *              es una clave de i18n para ser consumida por `useHandleErrors`.
 */
export const UuidSchema = z
  .string()
  .uuid({ message: "ValidationErrors.generic.invalid_uuid" });

/**
 * @public
 * @constant NameSchema
 * @description Valida un nombre genérico para entidades (workspaces, sitios, etc.).
 *              Aplica reglas de longitud y recorta espacios en blanco.
 */
export const NameSchema = z
  .string({ required_error: "ValidationErrors.generic.name_required" })
  .trim()
  .min(3, { message: "ValidationErrors.generic.name_too_short" })
  .max(40, { message: "ValidationErrors.generic.name_too_long" });

/**
 * @public
 * @constant SubdomainSchema
 * @description Valida un subdominio. Aplica reglas de longitud, caracteres
 *              permitidos y transforma a minúsculas.
 */
export const SubdomainSchema = z
  .string()
  .trim()
  .min(3, { message: "ValidationErrors.generic.subdomain_too_short" })
  .regex(/^[a-z0-9-]+$/, {
    message: "ValidationErrors.generic.subdomain_invalid_chars",
  })
  .transform((subdomain) => subdomain.toLowerCase());

/**
 * @public
 * @constant EmailSchema
 * @description Valida una dirección de correo electrónico.
 */
export const EmailSchema = z
  .string()
  .trim()
  .email({ message: "ValidationErrors.generic.invalid_email" });

/**
 * @public
 * @constant PasswordSchema
 * @description Valida una contraseña, aplicando una regla de longitud mínima.
 */
export const PasswordSchema = z
  .string()
  .min(8, { message: "ValidationErrors.generic.password_too_short" });

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **`UrlSchema`**: Añadir un `UrlSchema` reutilizable (`z.string().url()`) para validar URLs en varios contextos, como enlaces de afiliados o dominios personalizados.
 * 2. **`DescriptionSchema`**: Crear un `DescriptionSchema` (`z.string().max(255).optional()`) para estandarizar la validación de campos de descripción opcionales.
 * 3. **`SlugSchema`**: Crear un `SlugSchema` que combine las reglas de `SubdomainSchema` pero con un mensaje de error semánticamente diferente (`slug_invalid_chars`), para ser usado en la validación de slugs de campañas.
 * 4. **Internacionalización de Mensajes Zod**: Aunque las claves ya son de i18n, se podría implementar un `z.setErrorMap` global para centralizar la lógica de traducción de todos los errores de Zod, en lugar de manejarlo en cada `toast.error`.
 * 5. **Validación de Complejidad de Contraseña**: El `PasswordSchema` podría ser mejorado con `.regex()` para forzar la inclusión de mayúsculas, minúsculas, números y símbolos, aumentando la seguridad de las cuentas de usuario.
 * =====================================================================
 */
// src/lib/validators/schemas/_base.schemas.ts
