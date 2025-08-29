// src/lib/validators/i18n/errors/DocsPageErrors.schema.ts
/**
 * @file DocsPageErrors.schema.ts
 * @description Aparato de validación atómico. Define el contrato de datos para
 *              mensajes de error de validación específicos de la página de
 *              Documentación sin un prefijo de dominio. Esta es la SSoT para los
 *              errores de validación de contenido de la página de Documentación.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 */
import { z } from "zod";

export const DocsPageErrorsSchema = z.object({
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
 * 1. **Errores de Búsqueda/Filtrado**: ((Vigente)) Si la página de documentación en el futuro implementa una funcionalidad de búsqueda o filtrado, las claves de error relacionadas (ej. `search_query_too_short`, `no_results_found`) se añadirán a este schema para mantener la cohesión del dominio.
 * 2. **Errores de Carga de Contenido**: ((Vigente)) Se podría añadir una clave `content_load_failed` para manejar casos en los que el contenido de la documentación no se pueda obtener desde la capa de datos.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/errors/DocsPageErrors.schema.ts
