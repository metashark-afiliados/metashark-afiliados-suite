// src/lib/validators/schemas/admin.schemas.ts
/**
 * @file admin.schemas.ts
 * @description Aparato de validación atómico y SSoT para las entidades y
 *              acciones del dominio de administración. Sincronizado para incluir
 *              el contrato de actualización de roles.
 * @author RaZ Podestá - MetaShark Tech
 * @version 2.0.0
 */
import { z } from "zod";

import { UuidSchema } from "./_base.schemas";

/**
 * @public
 * @constant AppRoleEnumSchema
 * @description Valida que un string sea uno de los roles de aplicación válidos.
 *              Es la SSoT para la validación de `app_role`.
 */
export const AppRoleEnumSchema = z.enum(["user", "admin", "developer"]);

/**
 * @public
 * @constant ImpersonationSchema
 * @description Valida el payload para la acción de suplantación de usuario.
 */
export const ImpersonationSchema = z.object({
  userId: UuidSchema,
});

/**
 * @public
 * @constant UpdateUserRoleSchema
 * @description Valida el payload para la acción de actualización de rol de usuario.
 */
export const UpdateUserRoleSchema = z.object({
  userId: UuidSchema,
  newRole: AppRoleEnumSchema,
});
// src/lib/validators/schemas/admin.schemas.ts
