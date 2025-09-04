// src/lib/validators/i18n/errors/TermsOfServicePageErrors.schema.ts
/**
 * @file TermsOfServicePageErrors.schema.ts
 * @description Aparato de validación atómico. Define el contrato de datos para
 *              mensajes de error de validación específicos de la página de
 *              Términos de Servicio sin un prefijo de dominio. Esta es la SSoT
 *              para los errores de validación de contenido de esta página.
 * @author @author RaZ Podestá - MetaShark Tech
 * @version 1.0.0
 * @see .docs-espejo/lib/validators/i18n/errors/TermsOfServicePageErrors.schema.ts.md
 */
import { z } from "zod";

export const TermsOfServicePageErrorsSchema = z.object({
  title_required: z.string(),
  section_title_required: z.string(),
  paragraph_required: z.string(),
  body_content_required: z.string(),
  content_sections_required: z.string(),
});
// src/lib/validators/i18n/errors/TermsOfServicePageErrors.schema.ts
