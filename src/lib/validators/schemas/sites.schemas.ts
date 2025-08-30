// src/lib/validators/schemas/sites.schemas.ts
/**
 * @file src/lib/validators/schemas/sites.schemas.ts
 * @description Aparato de validación atómico y SSoT para la entidad 'sites'.
 *              Este módulo encapsula todos los schemas de Zod relacionados con
 *              la creación, actualización y eliminación de sitios, promoviendo
 *              una alta cohesión y el Principio de Responsabilidad Única.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { z } from "zod";

import { keysToSnakeCase } from "@/lib/helpers/object-case-converter";
import { slugify } from "@/lib/utils/text";
import { NameSchema, SubdomainSchema, UuidSchema } from "./_base.schemas";

export const CreateSiteClientSchema = z.object({
  name: NameSchema.optional(),
  subdomain: SubdomainSchema,
  description: z.string().optional(),
  workspaceId: UuidSchema,
});

export const CreateSiteServerSchema = CreateSiteClientSchema.transform(
  (data) => ({
    ...data,
    name: data.name || data.subdomain,
    description: data.description || null,
  })
).transform(keysToSnakeCase);

export const UpdateSiteNameSchema = z.object({
  siteId: UuidSchema,
  name: NameSchema,
});

export const UpdateSiteSchema = z
  .object({
    siteId: UuidSchema,
    name: NameSchema.optional(),
    subdomain: SubdomainSchema.optional(),
    description: z.string().optional(),
  })
  .transform(keysToSnakeCase);

export const DeleteSiteSchema = z.object({ siteId: UuidSchema });

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **Validación de Propiedad Única**: El `UpdateSiteSchema` podría ser refinado con un `.refine()` para asegurar que al menos una de las propiedades opcionales (`name`, `subdomain`, `description`) esté presente, previniendo llamadas de actualización vacías a la API.
 * 2. **Schema `SiteIconSchema`**: Para una futura funcionalidad de personalización de iconos de sitio, se podría crear un `SiteIconSchema` que valide si el valor es un emoji o una URL de imagen válida, y luego integrarlo en los schemas de creación y actualización.
 * 3. **Consistencia de Nomenclatura**: Considerar renombrar `CreateSiteServerSchema` a `CreateSitePayloadSchema` para reflejar más explícitamente que su propósito es generar el payload para la base de datos.
 * 4. **Tipado Estricto de `keysToSnakeCase`**: Mejorar el tipado genérico del helper `keysToSnakeCase` para que el tipo de retorno inferido sea más preciso, eliminando la necesidad de aserciones de tipo en los consumidores.
 * 5. **Mensajes de Error Específicos por Campo**: Actualmente, los mensajes de error se heredan de los schemas base. Se podrían añadir mensajes de error personalizados a nivel de este schema (ej. `subdomain: SubdomainSchema.min(3, { message: "sites_subdomain_too_short" })`) para una internacionalización de errores más granular.
 * =====================================================================
 */
// src/lib/validators/schemas/sites.schemas.ts
