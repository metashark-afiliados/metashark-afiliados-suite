// src/lib/validators/i18n/CookiePolicyPage.schema.ts
/**
 * @file CookiePolicyPage.schema.ts
 * @description Define el contrato de datos para el namespace 'pages.CookiePolicyPage'.
 *              Sincronizado con la Directiva 3.4 (IMAS), validando arrays de
 *              contenido como objetos con claves numéricas.
 * @author L.I.A Legacy
 * @version 2.0.0
 */
import { z } from "zod";

/**
 * @private
 * @constant ContentSectionSchema
 * @description Define la estructura para una única sección de contenido,
 *              donde el cuerpo (`body`) es un objeto de párrafos.
 */
const ContentSectionSchema = z.object({
  title: z.string(),
  body: z.record(z.string()),
});

/**
 * @public
 * @constant CookiePolicyPageSchema
 * @description El schema Zod que valida la estructura completa del archivo de
 *              mensajes para la página de Política de Cookies.
 */
export const CookiePolicyPageSchema = z.object({
  title: z.string(),
  /**
   * @property content
   * @description Un objeto que representa una lista de secciones. Las claves son
   *              strings numéricos ("0", "1", ...) y los valores son objetos
   *              de sección que cumplen con `ContentSectionSchema`.
   */
  content: z.record(ContentSectionSchema),
});
// src/lib/validators/i18n/CookiePolicyPage.schema.ts
