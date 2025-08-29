// src/lib/validators/i18n/errors/WikiPageErrors.schema.ts
/**
 * @file WikiPageErrors.schema.ts
 * @description Aparato de validación atómico. Define el contrato de datos para
 *              mensajes de error de validación específicos de la página Wiki
 *              sin un prefijo de dominio.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 */
import { z } from "zod";

export const WikiPageErrorsSchema = z.object({
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
 * 1. **Errores de Búsqueda y Categorización**: Si la página Wiki implementa una funcionalidad de búsqueda o categorización, se añadirán aquí las claves de error relacionadas (ej. `search_no_results`, `invalid_category`).
 * 2. **Errores de Carga de Artículos**: Añadir una clave `article_load_failed` para manejar casos en los que un artículo específico de la wiki no se pueda obtener desde la capa de datos.
 * =====================================================================
 */
// src/lib/validators/i18n/errors/WikiPageErrors.schema.ts
