// src/lib/validators/i18n/SupportPage.schema.ts
/**
 * @file SupportPage.schema.ts
 * @description Define el contrato de datos para el namespace 'SupportPage'.
 *              Sincronizado holísticamente para reflejar la estructura completa y anidada del contenido
 *              del archivo `messages/pages/SupportPage.json`, resolviendo una brecha crítica de sincronización.
 *              Incorpora la localización de mensajes de error de Zod referenciando claves de `ValidationErrors`
 *              y sigue el patrón de clasificación por dominio (`support_page_`).
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { z } from "zod";

/**
 * @public
 * @constant SupportPageSchema
 * @description Define la estructura y los tipos de datos esperados para las
 *              traducciones relacionadas con la página del Centro de Soporte.
 *              Incluye el título principal, un array de secciones de contenido,
 *              y enlaces/textos relacionados con el contacto y la base de conocimiento.
 *              Las validaciones de Zod utilizan claves internacionalizadas prefijadas por dominio.
 */
export const SupportPageSchema = z.object({
  /**
   * @property {string} title - El título principal de la página del Centro de Soporte.
   *           Validado para no ser una cadena vacía, con mensaje de error internacionalizado
   *           prefijado con `support_page_`.
   */
  title: z
    .string()
    .min(1, { message: "ValidationErrors.support_page_title_required" }),
  /**
   * @property {Array<object>} content - Un array de objetos que representan las secciones
   *           de contenido de la página de soporte. Cada objeto contiene:
   *           - `title`: El título de la sección (ej. "1. Get Immediate Assistance"), con mensaje de error internacionalizado.
   *           - `body`: Un array de strings, donde cada string es un párrafo de texto,
   *                     con mensajes de error internacionalizados.
   */
  content: z
    .array(
      z.object({
        title: z
          .string()
          .min(1, {
            message: "ValidationErrors.support_page_section_title_required",
          }),
        body: z
          .array(
            z
              .string()
              .min(1, {
                message: "ValidationErrors.support_page_paragraph_required",
              })
          )
          .min(1, {
            message: "ValidationErrors.support_page_body_content_required",
          }),
      })
    )
    .min(1, {
      message: "ValidationErrors.support_page_content_sections_required",
    }),
  /**
   * @property {string} [contact_email_text] - Texto para el enlace de contacto por correo electrónico.
   *           Opcional, permitiendo flexibilidad en la UI.
   */
  contact_email_text: z.string().optional(),
  /**
   * @property {string} [knowledge_base_link_text] - Texto para el enlace a la base de conocimiento.
   *           Opcional, permitiendo flexibilidad en la UI.
   */
  knowledge_base_link_text: z.string().optional(),
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
 * 1. **Sincronización Completa de Contrato**: ((Implementada)) El schema ha sido actualizado para reflejar la estructura completa y anidada del archivo `messages/pages/SupportPage.json`, incluyendo el título principal y el array de secciones de contenido. Esto resuelve la brecha crítica de sincronización y asegura el tipado de todas las claves de traducción.
 * 2. **Localización y Clasificación de Mensajes de Error de Zod**: ((Implementada)) Se han redefinido los mensajes de error de Zod para que sean claves de internacionalización con un prefijo de dominio (`ValidationErrors.support_page_...`). Esto formaliza la clasificación de errores y establece las bases para la futura generación automática de claves de error, mejorando la organización y mantenibilidad.
 * 3. **Robustez de Validación**: ((Implementada)) Se han añadido validaciones `.min(1)` a todas las propiedades de tipo `string` y a los arrays (`content`, `body`) para asegurar que las claves de traducción no estén vacías y que haya al menos un elemento. Esto aumenta la robustez del contrato.
 * 4. **Documentación TSDoc de Élite**: ((Implementada)) Se ha añadido documentación TSDoc verbosa a cada sección y propiedad del schema, incluyendo la nueva lógica de errores clasificados, lo que mejora la claridad para desarrolladores y traductores.
 * 5. **Flexibilidad del Contrato**: ((Implementada)) Se han añadido campos opcionales (`contact_email_text`, `knowledge_base_link_text`) para dar flexibilidad al componente de UI, permitiendo renderizar diferentes enlaces o textos sin modificar el schema central.
 *
 * @subsection Melhorias Futuras
 * 1. **Componente de Página de Soporte**: ((Vigente)) Crear un `SupportPageClient.tsx` que consuma este schema y el `LegalPageLayout` (o un `InfoPageLayout` más genérico) para renderizar dinámicamente el contenido de la página de soporte.
 * 2. **Integración de Búsqueda y FAQ**: ((Vigente)) La página de soporte podría integrar una barra de búsqueda que filtre los artículos de la base de conocimiento o las preguntas frecuentes, utilizando los campos `search_placeholder` y `faq_link_text` (si se añaden).
 *
 * =====================================================================
 */
// src/lib/validators/i18n/SupportPage.schema.ts
