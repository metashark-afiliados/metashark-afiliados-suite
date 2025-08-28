// src/lib/validators/i18n/PrivacyPolicyPage.schema.ts
/**
 * @file PrivacyPolicyPage.schema.ts
 * @description Define el contrato de datos para el namespace 'PrivacyPolicyPage'.
 *              Sincronizado holísticamente para reflejar la estructura completa y anidada del contenido
 *              del archivo `messages/pages/PrivacyPolicyPage.json`, resolviendo una brecha crítica de sincronización.
 *              Incorpora la localización de mensajes de error de Zod referenciando claves de `ValidationErrors`
 *              y sigue el patrón de clasificación por dominio (`privacy_policy_page_`).
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { z } from "zod";

/**
 * @public
 * @constant PrivacyPolicyPageSchema
 * @description Define la estructura y los tipos de datos esperados para las
 *              traducciones relacionadas con la página de Política de Privacidad.
 *              Incluye el título principal y un array de secciones de contenido,
 *              cada una con un título y un cuerpo (array de párrafos).
 *              Las validaciones de Zod utilizan claves internacionalizadas prefijadas por dominio.
 */
export const PrivacyPolicyPageSchema = z.object({
  /**
   * @property {string} title - El título principal de la página de Política de Privacidad.
   *           Validado para no ser una cadena vacía, con mensaje de error internacionalizado
   *           prefijado con `privacy_policy_page_`.
   */
  title: z
    .string()
    .min(1, { message: "ValidationErrors.privacy_policy_page_title_required" }),
  /**
   * @property {Array<object>} content - Un array de objetos que representan las secciones
   *           de contenido de la política de privacidad. Cada objeto contiene:
   *           - `title`: El título de la sección (ej. "1. Information We Collect"), con mensaje de error internacionalizado.
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
              "ValidationErrors.privacy_policy_page_section_title_required",
          }),
        body: z
          .array(
            z
              .string()
              .min(1, {
                message:
                  "ValidationErrors.privacy_policy_page_paragraph_required",
              })
          )
          .min(1, {
            message:
              "ValidationErrors.privacy_policy_page_body_content_required",
          }),
      })
    )
    .min(1, {
      message: "ValidationErrors.privacy_policy_page_content_sections_required",
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
 * 1. **Sincronización Completa de Contrato**: ((Implementada)) El schema ha sido actualizado para reflejar la estructura completa y anidada del archivo `messages/pages/PrivacyPolicyPage.json`, incluyendo el título principal y el array de secciones de contenido. Esto resuelve la brecha crítica de sincronización y asegura el tipado de todas las claves de traducción.
 * 2. **Localización y Clasificación de Mensajes de Error de Zod**: ((Implementada)) Se han redefinido los mensajes de error de Zod para que sean claves de internacionalización con un prefijo de dominio (`ValidationErrors.privacy_policy_page_...`). Esto formaliza la clasificación de errores y establece las bases para la futura generación automática de claves de error, mejorando la organización y mantenibilidad.
 * 3. **Robustez de Validación**: ((Implementada)) Se han añadido validaciones `.min(1)` a todas las propiedades de tipo `string` y a los arrays (`content`, `body`) para asegurar que las claves de traducción no estén vacías y que haya al menos un elemento. Esto aumenta la robustez del contrato.
 * 4. **Documentación TSDoc de Élite**: ((Implementada)) Se ha añadido documentación TSDoc verbosa a cada sección y propiedad del schema, incluyendo la nueva lógica de errores clasificados, lo que mejora la claridad para desarrolladores y traductores.
 *
 * @subsection Melhorias Futuras
 * 1. **Sistema de Auditoría de Consentimiento de Cookies**: ((Vigente)) Integrar este schema con un sistema de gestión de consentimiento de cookies que registre explícitamente la versión de la política aceptada por el usuario, permitiendo a la aplicación forzar una re-aceptación si la política cambia.
 * 2. **Notificaciones de Cambios en la Política**: ((Vigente)) Implementar un mecanismo (ej. un campo `last_updated_at` en el schema y una `Server Action` de notificación) para alertar a los usuarios sobre cambios significativos en la política de privacidad.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/PrivacyPolicyPage.schema.ts
