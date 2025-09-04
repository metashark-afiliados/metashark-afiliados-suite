// src/lib/validators/i18n/SupportPage.schema.ts
/**
 * @file SupportPage.schema.ts
 * @description Define el contrato de datos para el namespace 'pages.SupportPage'.
 *              Sincronizado con la Directiva 3.4 (IMAS), validando el contenido
 *              como un objeto con claves numéricas y utilizando `ValidationErrorKey`s
 *              para los mensajes de error de validación.
 * @author L.I.A Legacy
 * @version 2.0.0
 */
import { z } from "zod";

/**
 * @private
 * @constant SupportContentSectionSchema
 * @description Define la estructura para una única sección de contenido de soporte.
 */
const SupportContentSectionSchema = z.object({
  title: z
    .string()
    .min(1, {
      message: "ValidationErrors.support_page_section_title_required",
    }),
  body: z
    .record(
      z
        .string()
        .min(1, { message: "ValidationErrors.support_page_paragraph_required" })
    )
    .refine((data) => Object.keys(data).length > 0, {
      message: "ValidationErrors.support_page_body_content_required",
    }),
});

/**
 * @public
 * @constant SupportPageSchema
 * @description El schema Zod que valida la estructura completa del archivo de
 *              mensajes para la página del Centro de Soporte.
 */
export const SupportPageSchema = z.object({
  title: z
    .string()
    .min(1, { message: "ValidationErrors.support_page_title_required" }),
  content: z
    .record(SupportContentSectionSchema)
    .refine((data) => Object.keys(data).length > 0, {
      message: "ValidationErrors.support_page_content_sections_required",
    }),
  contact_email_text: z.string().optional(),
  knowledge_base_link_text: z.string().optional(),
});
// src/lib/validators/i18n/SupportPage.schema.ts
