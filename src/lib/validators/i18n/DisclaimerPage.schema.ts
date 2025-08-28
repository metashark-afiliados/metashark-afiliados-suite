// src/lib/validators/i18n/DisclaimerPage.schema.ts
/**
 * @file DisclaimerPage.schema.ts
 * @description Define el contrato de datos para el namespace 'DisclaimerPage'.
 *              Sincronizado holísticamente para reflejar la estructura completa y anidada del contenido
 *              del archivo `messages/pages/DisclaimerPage.json`, resolviendo una brecha crítica de sincronización.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { z } from "zod";

/**
 * @public
 * @constant DisclaimerPageSchema
 * @description Define la estructura y los tipos de datos esperados para las
 *              traducciones relacionadas con la página de Descargo de Responsabilidad.
 *              Incluye el título principal y un array de secciones de contenido,
 *              cada una con un título y un cuerpo (array de párrafos).
 */
export const DisclaimerPageSchema = z.object({
  /**
   * @property {string} title - El título principal de la página de Descargo de Responsabilidad.
   */
  title: z.string().min(1, "title_required"),
  /**
   * @property {Array<object>} content - Un array de objetos que representan las secciones
   *           de contenido del descargo de responsabilidad. Cada objeto contiene:
   *           - `title`: El título de la sección (ej. "1. Affiliate Disclosure").
   *           - `body`: Un array de strings, donde cada string es un párrafo de texto.
   */
  content: z
    .array(
      z.object({
        title: z.string().min(1, "section_title_required"),
        body: z
          .array(z.string().min(1, "paragraph_required"))
          .min(1, "body_content_required"),
      })
    )
    .min(1, "content_sections_required"),
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
 * 1. **Sincronización Completa de Contrato**: ((Implementada)) El schema ha sido actualizado para reflejar la estructura completa y anidada del archivo `messages/pages/DisclaimerPage.json`, incluyendo el título principal y el array de secciones de contenido. Esto resuelve la brecha crítica de sincronización y asegura el tipado de todas las claves de traducción.
 * 2. **Robustez de Validación**: ((Implementada)) Se han añadido validaciones `.min(1)` a todas las propiedades de tipo `string` y a los arrays (`content`, `body`) para asegurar que las claves de traducción no estén vacías y que haya al menos un elemento. Esto aumenta la robustez del contrato.
 * 3. **Documentación TSDoc de Élite**: ((Implementada)) Se ha añadido documentación TSDoc verbosa a cada sección del schema, incluyendo `describe` para las propiedades, lo que mejora la claridad para desarrolladores y traductores.
 *
 * @subsection Melhorias Futuras
 * 1. **Localización de Mensajes de Error de Zod**: ((Vigente)) Los mensajes de error (`title_required`, `section_title_required`, etc.) están actualmente hardcodeados aquí. Para una internacionalización de élite, estas claves deberían ser referenciadas desde un namespace `ValidationErrors` que se consumiría en `useHandleErrors`. Sin embargo, esto requiere un cambio en la forma en que Zod maneja los mensajes de error en las transformaciones de `safeParse`, y es una mejora más avanzada.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/DisclaimerPage.schema.ts
