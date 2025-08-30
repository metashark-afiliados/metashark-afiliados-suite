// src/lib/validators/schemas/invitations.schemas.ts
/**
 * @file src/lib/validators/schemas/invitations.schemas.ts
 * @description Aparato de validación atómico y SSoT para la entidad 'invitations'.
 *              Este módulo encapsula los schemas de Zod relacionados con el
 *              flujo de invitación de miembros a un workspace.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { z } from "zod";

import { keysToSnakeCase } from "@/lib/helpers/object-case-converter";
import { EmailSchema, UuidSchema } from "./_base.schemas";

/**
 * @public
 * @constant InvitationClientSchema
 * @description Valida los datos del formulario de invitación en el lado del cliente.
 *              Utiliza `camelCase` para la coherencia con `react-hook-form`.
 */
export const InvitationClientSchema = z.object({
  email: EmailSchema,
  role: z.enum(["admin", "member", "owner"]),
  workspaceId: UuidSchema,
});

/**
 * @public
 * @constant InvitationServerSchema
 * @description Extiende el schema del cliente, transformando las claves a `snake_case`
 *              para coincidir con la estructura de la base de datos. Es utilizado
 *              por la Server Action `sendWorkspaceInvitationAction`.
 */
export const InvitationServerSchema = InvitationClientSchema.transform(
  (data) => ({
    invitee_email: data.email,
    role: data.role,
    workspace_id: data.workspaceId,
  })
);

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **`AcceptInvitationSchema`**: Crear un `AcceptInvitationSchema` que valide el `invitationId` (UUID) para ser usado en la `acceptInvitationAction`, proporcionando una capa de validación explícita para esa acción.
 * 2. **`RevokeInvitationSchema`**: Para una futura funcionalidad de revocación, crear un `RevokeInvitationSchema` que valide el `invitationId` a revocar.
 * 3. **Consistencia de `role` Enum**: El enum `["admin", "member", "owner"]` está hardcodeado. Para una SSoT de élite, debería ser derivado del tipo `Enums<"workspace_role">` de la base de datos, posiblemente a través de un helper `z.enum(WORKSPACE_ROLES_ARRAY)`.
 * 4. **Exclusión de Rol 'owner' en Invitaciones**: El `InvitationClientSchema` podría ser refinado con un `.refine()` para prevenir que se envíen invitaciones con el rol de 'owner', ya que la propiedad de un workspace generalmente se transfiere, no se invita.
 * 5. **Mensajes de Error Específicos por Dominio**: Añadir mensajes de error específicos (ej. `invitations_invalid_email`) a los schemas base para una internacionalización de errores más granular.
 * =====================================================================
 */
// src/lib/validators/schemas/invitations.schemas.ts
