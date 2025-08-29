// src/lib/validators/i18n/errors/SupportPageErrors.schema.ts
/**
 * @file SupportPageErrors.schema.ts
 * @description Aparato de validación atómico. Define el contrato de datos para
 *              mensajes de error de validación específicos de la página de
 *              Soporte sin un prefijo de dominio.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 */
import { z } from "zod";

export const SupportPageErrorsSchema = z.object({
  title_required: z.string(),
  section_title_required: z.string(),
  paragraph_required: z.string(),
  body_content_required: z.string(),
  content_sections_required: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **Errores de Formulario de Soporte**: ((Vigente)) Si la página de soporte incluye un formulario de contacto, se añadirán aquí los errores de validación específicos de ese formulario (ej. `ticket_subject_required`).
 * =====================================================================
 */
// src/lib/validators/i18n/errors/SupportPageErrors.schema.ts
