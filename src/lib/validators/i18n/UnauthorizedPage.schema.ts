// src/lib/validators/i18n/UnauthorizedPage.schema.ts
/**
 * @file UnauthorizedPage.schema.ts
 * @description Define el contrato de datos para el namespace 'pages.UnauthorizedPage'.
 *              Sincronizado con la Directiva 3.4 (IMAS), validando el contenido
 *              opcional como un objeto y utilizando `ValidationErrorKey`s.
 * @author L.I.A Legacy
 * @version 2.0.0
 */
import { z } from "zod";

/**
 * @private
 * @constant UnauthorizedContentSectionSchema
 * @description Define la estructura para una única sección de contenido de la página.
 */
const UnauthorizedContentSectionSchema = z.object({
  title: z
    .string()
    .min(1, {
      message: "ValidationErrors.unauthorized_page_section_title_required",
    }),
  body: z
    .record(
      z
        .string()
        .min(1, {
          message: "ValidationErrors.unauthorized_page_paragraph_required",
        })
    )
    .refine((data) => Object.keys(data).length > 0, {
      message: "ValidationErrors.unauthorized_page_body_content_required",
    }),
});

/**
 * @public
 * @constant UnauthorizedPageSchema
 * @description El schema Zod que valida la estructura completa del archivo de
 *              mensajes para la página de Acceso No Autorizado.
 */
export const UnauthorizedPageSchema = z.object({
  title: z
    .string()
    .min(1, { message: "ValidationErrors.unauthorized_page_title_required" }),
  description: z
    .string()
    .min(1, {
      message: "ValidationErrors.unauthorized_page_description_required",
    }),
  back_to_dashboard_button: z
    .string()
    .min(1, { message: "ValidationErrors.unauthorized_page_button_required" }),
  content: z
    .record(UnauthorizedContentSectionSchema)
    .refine((data) => Object.keys(data).length > 0, {
      message: "ValidationErrors.unauthorized_page_content_sections_required",
    })
    .optional(),
});
// src/lib/validators/i18n/UnauthorizedPage.schema.ts
