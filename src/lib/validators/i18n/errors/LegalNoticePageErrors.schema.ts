// src/lib/validators/i18n/errors/LegalNoticePageErrors.schema.ts
/**
 * @file LegalNoticePageErrors.schema.ts
 * @description Aparato de validación atómico. Define el contrato de datos para
 *              mensajes de error de validación específicos de la página de
 *              Aviso Legal sin un prefijo de dominio. Esta es la SSoT para los
 *              errores de validación de contenido de la página de Aviso Legal.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 */
import { z } from "zod";

export const LegalNoticePageErrorsSchema = z.object({
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
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 *
 * @subsection Melhorias Futuras
 * 1. **Errores de Contenido Específico**: ((Vigente)) Si en el futuro el contenido del Aviso Legal requiere validaciones más específicas (por ejemplo, validar que un email de contacto en el texto sea un email válido), las claves de error correspondientes (`contact_email_invalid`) se añadirán a este schema.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/errors/LegalNoticePageErrors.schema.ts
