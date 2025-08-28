// src/lib/validators/i18n/UnauthorizedPage.schema.ts
/**
 * @file UnauthorizedPage.schema.ts
 * @description Define el contrato de datos para el namespace 'UnauthorizedPage'.
 *              Sincronizado holísticamente para reflejar una estructura de contenido más rica,
 *              incorporando la localización de mensajes de error de Zod referenciando claves de `ValidationErrors`
 *              y siguiendo el patrón de clasificación por dominio (`unauthorized_page_`).
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { z } from "zod";

/**
 * @public
 * @constant UnauthorizedPageSchema
 * @description Define la estructura y los tipos de datos esperados para las
 *              traducciones relacionadas con la página de Acceso No Autorizado.
 *              Incluye un título, descripción, texto para el botón de regreso,
 *              y un campo opcional para contenido detallado en secciones.
 *              Las validaciones de Zod utilizan claves internacionalizadas prefijadas por dominio.
 */
export const UnauthorizedPageSchema = z.object({
  /**
   * @property {string} title - El título principal de la página (ej. "Acceso No Autorizado").
   *           Validado para no ser una cadena vacía, con mensaje de error internacionalizado.
   */
  title: z
    .string()
    .min(1, { message: "ValidationErrors.unauthorized_page_title_required" }),
  /**
   * @property {string} description - Una descripción corta del motivo del acceso denegado.
   *           Validado para no ser una cadena vacía, con mensaje de error internacionalizado.
   */
  description: z
    .string()
    .min(1, {
      message: "ValidationErrors.unauthorized_page_description_required",
    }),
  /**
   * @property {string} back_to_dashboard_button - Texto para el botón que permite al usuario
   *           regresar a una página segura (ej. "Volver al Dashboard").
   *           Validado para no ser una cadena vacía, con mensaje de error internacionalizado.
   */
  back_to_dashboard_button: z
    .string()
    .min(1, { message: "ValidationErrors.unauthorized_page_button_required" }),
  /**
   * @property {Array<object>} [content] - Un array opcional de objetos que representan secciones
   *           de contenido adicional, útil para explicar el motivo del error o proporcionar
   *           pasos para resolverlo. Cada objeto contiene:
   *           - `title`: El título de la sección.
   *           - `body`: Un array de strings, donde cada string es un párrafo de texto.
   */
  content: z
    .array(
      z.object({
        title: z
          .string()
          .min(1, {
            message:
              "ValidationErrors.unauthorized_page_section_title_required",
          }),
        body: z
          .array(
            z
              .string()
              .min(1, {
                message:
                  "ValidationErrors.unauthorized_page_paragraph_required",
              })
          )
          .min(1, {
            message: "ValidationErrors.unauthorized_page_body_content_required",
          }),
      })
    )
    .min(1, {
      message: "ValidationErrors.unauthorized_page_content_sections_required",
    })
    .optional(),
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
 * 1. **Sincronización Completa de Contrato**: ((Implementada)) El schema ha sido actualizado para reflejar una estructura de contenido más rica para la página de Acceso No Autorizado, incluyendo un campo `content` opcional con secciones anidadas. Esto mejora la flexibilidad y asegura el tipado de las claves de traducción.
 * 2. **Localización y Clasificación de Mensajes de Error de Zod**: ((Implementada)) Se han redefinido los mensajes de error de Zod para que sean claves de internacionalización con un prefijo de dominio (`ValidationErrors.unauthorized_page_...`). Esto formaliza la clasificación de errores y establece las bases para la futura generación automática de claves de error, mejorando la organización y mantenibilidad.
 * 3. **Robustez de Validación**: ((Implementada)) Se han añadido validaciones `.min(1)` a todas las propiedades de tipo `string` y a los arrays (`content`, `body`) para asegurar que las claves de traducción no estén vacías y que haya al menos un elemento. Esto aumenta la robustez del contrato.
 * 4. **Documentación TSDoc de Élite**: ((Implementada)) Se ha añadido documentación TSDoc verbosa a cada sección y propiedad del schema, incluyendo la nueva lógica de errores clasificados, lo que mejora la claridad para desarrolladores y traductores.
 * 5. **Flexibilidad del Contrato**: ((Implementada)) El campo `content` se ha hecho opcional. Esto permite que la página `UnauthorizedPage` pueda ser renderizada con una versión simple (solo título, descripción, botón) o con contenido más detallado, sin romper el contrato actual del archivo de mensajes.
 *
 * @subsection Melhorias Futuras
 * 1. **Componente de Página de Acceso No Autorizado**: ((Vigente)) Crear un `UnauthorizedPageClient.tsx` que consuma este schema y el `LegalPageLayout` (o un `ErrorPageLayout` más genérico) para renderizar dinámicamente el contenido de esta página, proporcionando acciones de soporte o redirección contextual.
 * 2. **Contexto de Redirección Inteligente**: ((Vigente)) El `back_to_dashboard_button` podría tener un `href` dinámico basado en el contexto de dónde vino el usuario, o incluso un botón para `Contactar Soporte` si el problema persiste.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/UnauthorizedPage.schema.ts
