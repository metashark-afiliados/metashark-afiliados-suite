// src/lib/validators/schemas/campaigns.schemas.ts
/**
 * @file src/lib/validators/schemas/campaigns.schemas.ts
 * @description Aparato de validación atómico y SSoT para la entidad 'campaigns'.
 *              Este módulo encapsula todos los schemas de Zod relacionados con
 *              la creación y eliminación de campañas, mejorando la cohesión y el SRP.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { z } from "zod";

import { keysToSnakeCase } from "@/lib/helpers/object-case-converter";
import { slugify } from "@/lib/utils/text";
import { NameSchema, UuidSchema } from "./_base.schemas";

/**
 * @public
 * @constant CreateCampaignSchema
 * @description Valida el payload para la creación de una nueva campaña.
 *              Transforma el `name` a un `slug` si este no es provisto, y
 *              convierte todas las claves a `snake_case` para la base de datos.
 */
export const CreateCampaignSchema = z
  .object({
    name: NameSchema,
    slug: z
      .string()
      .trim()
      .min(3, { message: "ValidationErrors.generic.slug_too_short" })
      .regex(/^[a-z0-9-]+$/, {
        message: "ValidationErrors.generic.slug_invalid_chars",
      })
      .optional(),
    siteId: UuidSchema,
  })
  .transform((data) => ({
    ...data,
    slug: data.slug || slugify(data.name),
  }))
  .transform(keysToSnakeCase);

/**
 * @public
 * @constant DeleteCampaignSchema
 * @description Valida el payload para la eliminación de una campaña.
 */
export const DeleteCampaignSchema = z.object({
  campaignId: UuidSchema,
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **`UpdateCampaignSchema`**: Crear un `UpdateCampaignSchema` que valide los datos para actualizar los metadatos de una campaña (ej. `name`, `slug`, `affiliate_url`).
 * 2. **Validación de Unicidad de Slug**: La validación actual del slug no comprueba la unicidad dentro de un sitio. Esto debe ser manejado en la Server Action `createCampaignAction`, pero se podría añadir un `z.refine` asíncrono aquí para una validación en tiempo real en el cliente, si fuera necesario.
 * 3. **`CampaignContentSchema`**: Definir un schema Zod para el campo `content` de una campaña, basándose en el tipo `CampaignConfig` de `src/lib/builder/types.d.ts`, para validar la estructura del contenido antes de guardarlo en la base de datos.
 * 4. **`ArchiveCampaignSchema`**: Crear un schema simple que valide el `campaignId` para la acción de archivar una campaña.
 * 5. **`DuplicateCampaignSchema`**: Crear un schema que valide el `campaignId` para la acción de duplicar una campaña.
 * =====================================================================
 */
// src/lib/validators/schemas/campaigns.schemas.ts
