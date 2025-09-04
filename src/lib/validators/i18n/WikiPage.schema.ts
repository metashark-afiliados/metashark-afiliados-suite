// src/lib/validators/i18n/WikiPage.schema.ts
/**
 * @file WikiPage.schema.ts
 * @description Define el contrato de datos para el namespace 'pages.WikiPage'.
 *              Sincronizado con la Directiva 3.4 (IMAS), validando el contenido
 *              como un objeto con claves numéricas y utilizando `ValidationErrorKey`s.
 * @author L.I.A Legacy
 * @version 2.0.0
 */
import { z } from "zod";

/**
 * @private
 * @constant WikiContentSectionSchema
 * @description Define la estructura para una única sección de contenido de la Wiki.
 */
const WikiContentSectionSchema = z.object({
  title: z
    .string()
    .min(1, { message: "ValidationErrors.wiki_page_section_title_required" }),
  body: z
    .record(
      z
        .string()
        .min(1, { message: "ValidationErrors.wiki_page_paragraph_required" })
    )
    .refine((data) => Object.keys(data).length > 0, {
      message: "ValidationErrors.wiki_page_body_content_required",
    }),
});

/**
 * @public
 * @constant WikiPageSchema
 * @description El schema Zod que valida la estructura completa del archivo de
 *              mensajes para la página de la Wiki o Base de Conocimiento.
 */
export const WikiPageSchema = z.object({
  title: z
    .string()
    .min(1, { message: "ValidationErrors.wiki_page_title_required" }),
  content: z
    .record(WikiContentSectionSchema)
    .refine((data) => Object.keys(data).length > 0, {
      message: "ValidationErrors.wiki_page_content_sections_required",
    })
    .optional(),
  search_placeholder: z.string().optional(),
  category_general: z.string().optional(),
  category_ai_tools: z.string().optional(),
  category_campaigns: z.string().optional(),
});
// src/lib/validators/i18n/WikiPage.schema.ts
