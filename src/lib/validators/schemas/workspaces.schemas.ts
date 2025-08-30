// src/lib/validators/schemas/workspaces.schemas.ts
/**
 * @file src/lib/validators/schemas/workspaces.schemas.ts
 * @description Aparato de validación atómico y SSoT para la entidad 'workspaces'.
 *              Este módulo encapsula todos los schemas de Zod relacionados con
 *              la creación, actualización y eliminación de workspaces, consumiendo
 *              los schemas base para máxima reutilización y consistencia.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { z } from "zod";
import { NameSchema, UuidSchema } from "./_base.schemas";

/**
 * @public
 * @constant CreateWorkspaceSchema
 * @description Valida el payload para la creación de un nuevo workspace.
 */
export const CreateWorkspaceSchema = z.object({
  workspaceName: NameSchema,
});

/**
 * @public
 * @constant UpdateWorkspaceNameSchema
 * @description Valida el payload para la actualización del nombre de un workspace.
 */
export const UpdateWorkspaceNameSchema = z.object({
  name: NameSchema,
});

/**
 * @public
 * @constant DeleteWorkspaceSchema
 * @description Valida el payload para la eliminación de un workspace.
 */
export const DeleteWorkspaceSchema = z.object({
  workspaceId: UuidSchema,
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **`UpdateWorkspaceIconSchema`**: Añadir un nuevo schema para validar la actualización del icono de un workspace, que podría verificar si el string proporcionado es un emoji válido.
 * 2. **`TransferOwnershipSchema`**: Para una futura funcionalidad de transferencia de propiedad, crear un `TransferOwnershipSchema` que valide el `workspaceId` y el `newOwnerUserId`.
 * 3. **Consistencia de Nomenclatura de Campos**: En `CreateWorkspaceSchema` el campo es `workspaceName`, mientras que en `UpdateWorkspaceNameSchema` es `name`. Estandarizar a `name` en ambos schemas mejoraría la consistencia de la API.
 * 4. **Mensajes de Error Específicos por Dominio**: Al igual que con los schemas de `sites`, se podrían añadir mensajes de error específicos (ej. `workspaces_name_too_short`) si las reglas de validación para workspaces llegaran a divergir de las reglas genéricas.
 * 5. **Schema `WorkspaceSettingsSchema`**: Crear un schema compuesto que valide un objeto de configuración completo para un workspace, incluyendo nombre, icono, y otras futuras configuraciones.
 * =====================================================================
 */
// src/lib/validators/schemas/workspaces.schemas.ts
