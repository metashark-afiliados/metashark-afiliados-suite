// src/lib/validators/schemas/creations.schemas.ts
/**
 * @file src/lib/validators/schemas/creations.schemas.ts
 * @description Aparato de validación atómico y SSoT para la entidad 'creations'.
 *              Este módulo encapsula todos los schemas de Zod relacionados con
 *              la creación y manipulación de diseños soberanos en el constructor.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { z } from "zod";
import { NameSchema } from "./_base.schemas";

/**
 * @public
 * @constant CreateCreationSchema
 * @description Valida el payload para la creación de un nuevo diseño ('Creation').
 *              Este schema es consumido por la Server Action `createCreationAction`.
 */
export const CreateCreationSchema = z.object({
  /**
   * El nombre inicial para el nuevo diseño.
   * Reutiliza el `NameSchema` base para una validación consistente.
   */
  name: NameSchema,
  /**
   * El tipo de diseño que se está creando (ej. "landing-page", "doc").
   * Validado para ser un string no vacío.
   */
  type: z.string().min(1),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **`UpdateCreationNameSchema`**: Añadir un schema específico para validar la actualización del nombre de una creación, reutilizando el `NameSchema` base.
 * 2. **`UpdateCreationContentSchema`**: Crear un schema robusto que valide la estructura completa del objeto `content` de una creación, importando y utilizando `CampaignConfigSchema` desde `src/lib/builder/types.d.ts` para una SSoT compartida.
 * 3. **`DeleteCreationSchema`**: Añadir un schema que valide el `creationId` (UUID) para la acción de eliminación, reutilizando `UuidSchema`.
 * 4. **Enum para `type`**: Reemplazar `z.string().min(1)` por un `z.enum(["landing-page", "doc", ...])` para restringir los tipos de creación a un conjunto predefinido y válido, mejorando la seguridad de tipos.
 * 5. **Mensajes de Error Específicos**: Añadir mensajes de error específicos del dominio `creations` si las reglas de validación se vuelven más complejas que las genéricas.
 * 6. **Validación de `workspaceId`**: Incluir la validación del `workspaceId` en el `CreateCreationSchema` si la Server Action correspondiente lo requiere directamente del formulario.
 * 7. **`DuplicateCreationSchema`**: Para una futura funcionalidad de duplicación, crear un schema que valide el `creationId` del diseño a duplicar.
 * =====================================================================
 */
// src/lib/validators/schemas/creations.schemas.ts