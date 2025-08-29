// src/lib/validators/i18n/errors/TermsOfServicePageErrors.schema.ts
/**
 * @file TermsOfServicePageErrors.schema.ts
 * @description Aparato de validación atómico. Define el contrato de datos para
 *              mensajes de error de validación específicos de la página de
 *              Términos de Servicio sin un prefijo de dominio. Esta es la SSoT
 *              para los errores de validación de contenido de esta página.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 */
import { z } from "zod";

export const TermsOfServicePageErrorsSchema = z.object({
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
 * 1. **Error de Aceptación Explícita**: Si se requiere que los usuarios acepten activamente los términos (ej. en un modal de actualización), añadir una clave `terms_acceptance_required` para manejar el error de no aceptación.
 * 2. **Error de Carga de Contenido**: Añadir una clave `terms_content_load_failed` para manejar casos en los que el contenido de los términos no se pueda obtener de una futura fuente de datos externa (CMS).
 * 3. **Error de Versión de Términos**: Si se implementa un sistema de versionado de términos, añadir una clave `terms_version_mismatch` para indicar que el usuario debe aceptar una nueva versión.
 * =====================================================================
 */
// src/lib/validators/i18n/errors/TermsOfServicePageErrors.schema.ts
