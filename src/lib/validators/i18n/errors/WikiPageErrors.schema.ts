// src/lib/validators/i18n/errors/WikiPageErrors.schema.ts
/**
 * @file WikiPageErrors.schema.ts
 * @description Aparato de validación atómico. Define el contrato de datos para
 *              mensajes de error de validación específicos de la página Wiki
 *              sin un prefijo de dominio.
 * @author @author RaZ Podestá - MetaShark Tech
 * @version 1.0.0
 * @see .docs-espejo/lib/validators/i18n/errors/WikiPageErrors.schema.ts.md
 */
import { z } from "zod";

export const WikiPageErrorsSchema = z.object({
  title_required: z.string(),
  section_title_required: z.string(),
  paragraph_required: z.string(),
  body_content_required: z.string(),
  content_sections_required: z.string(),
});
// src/lib/validators/i18n/errors/WikiPageErrors.schema.ts
