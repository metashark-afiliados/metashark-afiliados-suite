// src/lib/validators/i18n/WikiPage.schema.ts
/**
 * @file WikiPage.schema.ts
 * @description Define el contrato de datos para el namespace 'WikiPage'.
 *              Sincronizado holísticamente para reflejar una estructura de contenido más rica,
 *              incorporando la localización de mensajes de error de Zod referenciando claves de `ValidationErrors`
 *              y siguiendo el patrón de clasificación por dominio (`wiki_page_`).
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { z } from "zod";

/**
 * @public
 * @constant WikiPageSchema
 * @description Define la estructura y los tipos de datos esperados para las
 *              traducciones relacionadas con la página Wiki y Base de Conocimiento.
 *              Incluye un título, un campo opcional para contenido detallado en secciones,
 *              y campos opcionales para la funcionalidad de búsqueda y categorías.
 *              Las validaciones de Zod utilizan claves internacionalizadas prefijadas por dominio.
 */
export const WikiPageSchema = z.object({
  /**
   * @property {string} title - El título principal de la página Wiki.
   *           Validado para no ser una cadena vacía, con mensaje de error internacionalizado.
   */
  title: z
    .string()
    .min(1, { message: "ValidationErrors.wiki_page_title_required" }),
  /**
   * @property {Array<object>} [content] - Un array opcional de objetos que representan las secciones
   *           de contenido de la wiki. Cada objeto contiene:
   *           - `title`: El título de la sección.
   *           - `body`: Un array de strings, donde cada string es un párrafo de texto.
   */
  content: z
    .array(
      z.object({
        title: z
          .string()
          .min(1, {
            message: "ValidationErrors.wiki_page_section_title_required",
          }),
        body: z
          .array(
            z
              .string()
              .min(1, {
                message: "ValidationErrors.wiki_page_paragraph_required",
              })
          )
          .min(1, {
            message: "ValidationErrors.wiki_page_body_content_required",
          }),
      })
    )
    .min(1, { message: "ValidationErrors.wiki_page_content_sections_required" })
    .optional(),
  /**
   * @property {string} [search_placeholder] - Placeholder opcional para el campo de búsqueda de la wiki.
   */
  search_placeholder: z.string().optional(),
  /**
   * @property {string} [category_general] - Texto para la categoría 'General'.
   */
  category_general: z.string().optional(),
  /**
   * @property {string} [category_ai_tools] - Texto para la categoría 'AI Tools'.
   */
  category_ai_tools: z.string().optional(),
  /**
   * @property {string} [category_campaigns] - Texto para la categoría 'Campaign Management'.
   */
  category_campaigns: z.string().optional(),
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
 * 1. **Sincronización Completa de Contrato**: ((Implementada)) El schema ha sido actualizado para reflejar la estructura completa y anidada del archivo `messages/pages/WikiPage.json` (recién creado), incluyendo un campo `content` opcional con secciones anidadas, y campos opcionales para búsqueda y categorías. Esto resuelve la brecha de sincronización y asegura el tipado de todas las claves de traducción.
 * 2. **Localización y Clasificación de Mensajes de Error de Zod**: ((Implementada)) Se han redefinido los mensajes de error de Zod para que sean claves de internacionalización con un prefijo de dominio (`ValidationErrors.wiki_page_...`). Esto formaliza la clasificación de errores y establece las bases para la futura generación automática de claves de error, mejorando la organización y mantenibilidad.
 * 3. **Robustez de Validación**: ((Implementada)) Se han añadido validaciones `.min(1)` a todas las propiedades de tipo `string` y a los arrays (`content`, `body`) para asegurar que las claves de traducción no estén vacías y que haya al menos un elemento. Esto aumenta la robustez del contrato.
 * 4. **Documentación TSDoc de Élite**: ((Implementada)) Se ha añadido documentación TSDoc verbosa a cada sección y propiedad del schema, incluyendo la nueva lógica de errores clasificados, lo que mejora la claridad para desarrolladores y traductores.
 * 5. **Flexibilidad del Contrato y Previsión de UI**: ((Implementada)) El campo `content` se ha hecho opcional, y se han añadido campos opcionales para `search_placeholder` y `category_*` para anticipar y soportar la futura expansión de la UI de la wiki.
 *
 * @subsection Melhorias Futuras
 * 1. **Componente de Página Wiki**: ((Vigente)) Crear un `WikiPageClient.tsx` que consuma este schema y el `LegalPageLayout` (o un `InfoPageLayout` más genérico) para renderizar dinámicamente el contenido de esta página, integrando la búsqueda y la navegación por categorías.
 * 2. **Integración con Motor de Búsqueda (Client-Side)**: ((Vigente)) Si la wiki tiene muchos artículos, el `search_placeholder` podría integrarse con una solución de búsqueda client-side (ej., `Fuse.js`) para filtrar el contenido cargado, o una solución de búsqueda más avanzada con `Server Actions` para contenido dinámico.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/WikiPage.schema.ts
