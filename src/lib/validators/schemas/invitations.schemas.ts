// src/lib/validators/schemas/invitations.schemas.ts
/**
 * @file src/lib/validators/schemas/invitations.schemas.ts
 * @description Aparato de validación atómico y SSoT para la entidad 'invitations'.
 *              Refactorizado para transformar el `role` (string) a `role_id` (number),
 *              actuando como la capa de conformidad entre la UI y la base de datos.
 * @author L.I.A. Legacy
 * @version 2.0.0
 */
import { z } from "zod";

import { WORKSPACE_ROLES } from "@/config/roles.config";
import { EmailSchema, UuidSchema } from "./_base.schemas";

/**
 * @public
 * @constant InvitationClientSchema
 * @description Valida los datos del formulario de invitación en el lado del cliente.
 *              Utiliza `camelCase` para la coherencia con `react-hook-form`.
 */
export const InvitationClientSchema = z.object({
  email: EmailSchema,
  role: z.enum(["admin", "member"]), // Los usuarios no pueden invitar a otros como 'owner'
  workspaceId: UuidSchema,
});

/**
 * @public
 * @constant InvitationServerSchema
 * @description Extiende el schema del cliente. Su `transform` es la SSoT para
 *              convertir el `role` (string) de la UI al `role_id` (number) que
 *              requiere la base de datos.
 */
export const InvitationServerSchema = InvitationClientSchema.transform(
  (data) => {
    const roleKey = data.role.toUpperCase() as keyof typeof WORKSPACE_ROLES;
    const roleId = WORKSPACE_ROLES[roleKey]?.id;

    // Esta validación es una segunda capa de seguridad, aunque Zod ya previene roles inválidos.
    if (typeof roleId !== "number") {
      throw new Error(`Invalid role name provided: ${data.role}`);
    }

    return {
      invitee_email: data.email,
      role_id: roleId,
      workspace_id: data.workspaceId,
    };
  }
);
// src/lib/validators/schemas/invitations.schemas.ts
