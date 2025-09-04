// src/lib/validators/i18n/LegalNoticePage.schema.ts
/**
 * @file LegalNoticePage.schema.ts
 * @description Define el contrato de datos para el namespace 'pages.LegalNoticePage'.
 *              Sincronizado con la Directiva 3.4 (IMAS), validando el contenido
 *              como un objeto con claves numéricas y utilizando `ValidationErrorKey`s
 *              para los mensajes de error de validación.
 * @author L.I.A Legacy
 * @version 2.1.0
 */
import { z } from "zod";

/**
 * @private
 * @constant LegalContentSectionSchema
 * @description Define la estructura para una única sección de contenido legal.
 */
const LegalContentSectionSchema = z.object({
  title: z
    .string()
    .min(1, {
      message: "ValidationErrors.legal_notice_page_section_title_required",
    }),
  body: z
    .record(
      z
        .string()
        .min(1, {
          message: "ValidationErrors.legal_notice_page_paragraph_required",
        })
    )
    .refine((data) => Object.keys(data).length > 0, {
      message: "ValidationErrors.legal_notice_page_body_content_required",
    }),
});

/**
 * @public
 * @constant LegalNoticePageSchema
 * @description El schema Zod que valida la estructura completa del archivo de
 *              mensajes para la página de Aviso Legal.
 */
export const LegalNoticePageSchema = z.object({
  title: z
    .string()
    .min(1, { message: "ValidationErrors.legal_notice_page_title_required" }),
  content: z
    .record(LegalContentSectionSchema)
    .refine((data) => Object.keys(data).length > 0, {
      message: "ValidationErrors.legal_notice_page_content_sections_required",
    }),
});
// src/lib/validators/i18n/LegalNoticePage.schema.ts
