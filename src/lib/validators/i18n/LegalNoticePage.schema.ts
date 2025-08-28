// src/lib/validators/i18n/LegalNoticePage.schema.ts
/**
 * @file LegalNoticePage.schema.ts
 * @description Define el contrato de datos para el namespace 'LegalNoticePage'.
 *              Sincronizado holísticamente para reflejar la estructura completa y anidada del contenido
 *              del archivo `messages/pages/LegalNoticePage.json`, resolviendo una brecha crítica de sincronización.
 *              Incorpora la localización de mensajes de error de Zod referenciando claves de `ValidationErrors`
 *              y sigue el patrón de clasificación por dominio (`legal_notice_page_`).
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { z } from "zod";

/**
 * @public
 * @constant LegalNoticePageSchema
 * @description Define la estructura y los tipos de datos esperados para las
 *              traducciones relacionadas con la página de Aviso Legal / Imprint.
 *              Incluye el título principal y un array de secciones de contenido,
 *              cada una con un título y un cuerpo (array de párrafos).
 *              Las validaciones de Zod utilizan claves internacionalizadas prefijadas por dominio.
 */
export const LegalNoticePageSchema = z.object({
  /**
   * @property {string} title - El título principal de la página de Aviso Legal.
   *           Validado para no ser una cadena vacía, con mensaje de error internacionalizado
   *           prefijado con `legal_notice_page_`.
   */
  title: z
    .string()
    .min(1, { message: "ValidationErrors.legal_notice_page_title_required" }),
  /**
   * @property {Array<object>} content - Un array de objetos que representan las secciones
   *           de contenido del aviso legal. Cada objeto contiene:
   *           - `title`: El título de la sección (ej. "1. Corporate Information"), con mensaje de error internacionalizado.
   *           - `body`: Un array de strings, donde cada string es un párrafo de texto,
   *                     con mensajes de error internacionalizados.
   */
  content: z
    .array(
      z.object({
        title: z
          .string()
          .min(1, {
            message:
              "ValidationErrors.legal_notice_page_section_title_required",
          }),
        body: z
          .array(
            z
              .string()
              .min(1, {
                message:
                  "ValidationErrors.legal_notice_page_paragraph_required",
              })
          )
          .min(1, {
            message: "ValidationErrors.legal_notice_page_body_content_required",
          }),
      })
    )
    .min(1, {
      message: "ValidationErrors.legal_notice_page_content_sections_required",
    }),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización Completa de Contrato**: ((Implementada)) El schema ha sido actualizado para reflejar la estructura completa y anidada del archivo `messages/pages/LegalNoticePage.json`, incluyendo el título principal y el array de secciones de contenido. Esto resuelve la brecha crítica de sincronización y asegura el tipado de todas las claves de traducción.
 * 2. **Localización y Clasificación de Mensajes de Error de Zod**: ((Implementada)) Se han redefinido los mensajes de error de Zod para que sean claves de internacionalización con un prefijo de dominio (`ValidationErrors.legal_notice_page_...`). Esto formaliza la clasificación de errores y establece las bases para la futura generación automática de claves de error, mejorando la organización y mantenibilidad.
 * 3. **Robustez de Validación**: ((Implementada)) Se han añadido validaciones `.min(1)` a todas las propiedades de tipo `string` y a los arrays (`content`, `body`) para asegurar que las claves de traducción no estén vacías y que haya al menos un elemento. Esto aumenta la robustez del contrato.
 * 4. **Documentación TSDoc de Élite**: ((Implementada)) Se ha añadido documentación TSDoc verbosa a cada sección y propiedad del schema, incluyendo la nueva lógica de errores clasificados, lo que mejora la claridad para desarrolladores y traductores.
 *
 * @subsection Melhorias Futuras
 * 1. **Mapeo de Claves de Error para `useHandleErrors`**: ((Vigente)) Aunque las claves de error ahora están prefijadas, el hook `useHandleErrors` debería ser mejorado para reconocer estos prefijos y buscar los mensajes de error de validación en los namespaces correctos (o en un único `ValidationErrors` que contenga todas estas claves).
 * 2. **Generación Automática de Schemas de Páginas Legales**: ((Vigente)) A medida que la cantidad de páginas legales crezca, se podría considerar un script que escanee los archivos `messages/pages/*.json` (para páginas legales) y genere automáticamente sus schemas de Zod, aplicando el patrón de `content` y errores clasificados.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/LegalNoticePage.schema.ts
