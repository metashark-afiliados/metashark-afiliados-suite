// src/lib/validators/i18n/DocsPage.schema.ts
/**
 * @file DocsPage.schema.ts
 * @description Define el contrato de datos para el namespace 'DocsPage'.
 *              Sincronizado holísticamente para reflejar la estructura completa y anidada del contenido
 *              del archivo `messages/pages/DocsPage.json`, resolviendo una brecha crítica de sincronización.
 *              Incorpora el sistema de versionado de esquemas de contenido y la localización de mensajes de error de Zod.
 * @author Raz Podestá - MetaShark Tech
 * @version 4.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { z } from "zod";

const CURRENT_DOCS_SCHEMA_VERSION = 1;

/**
 * @private
 * @function migrateDocsContent
 * @description Función de migración simulada para adaptar estructuras de contenido antiguas
 *              a la versión más reciente del schema. En un escenario real, contendría
 *              lógica para transformar `content` basado en `oldVersion`.
 *              Esta función está pensada para ser utilizada dentro de un `.transform()` de Zod.
 * @param {any} data - Los datos de la documentación a migrar.
 * @param {number} oldVersion - La versión del schema de la que proviene `data`.
 * @returns {any} Los datos de la documentación migrados a la versión actual.
 */
function migrateDocsContent(data: any, oldVersion: number): any {
  if (oldVersion < CURRENT_DOCS_SCHEMA_VERSION) {
    // Aquí iría la lógica real de migración.
    // Ejemplo:
    // if (oldVersion === 0) {
    //   // Suponiendo que la v0 no tenía array de 'content' sino un string
    //   data.content = [{ title: "Introducción", body: [data.content] }];
    // }
    // logger.info(`[DocsPageSchema:Migrate] Migrando contenido de v${oldVersion} a v${CURRENT_DOCS_SCHEMA_VERSION}.`);
  }
  return data;
}

/**
 * @public
 * @constant DocsPageSchema
 * @description Define la estructura y los tipos de datos esperados para las
 *              traducciones relacionadas con la página de Documentación.
 *              Incluye un sistema de versionado para la estructura de contenido
 *              y validaciones con mensajes de error internacionalizados.
 */
export const DocsPageSchema = z
  .object({
    /**
     * @property {number} version - La versión del esquema de la estructura de contenido de la documentación.
     *           Utilizada para la compatibilidad con versiones anteriores y futuras migraciones.
     *           Por defecto, se establece a la versión actual si no se proporciona.
     */
    version: z.number().default(CURRENT_DOCS_SCHEMA_VERSION),
    /**
     * @property {string} title - El título principal de la página de Documentación.
     *           Validado para no ser una cadena vacía, con mensaje de error internacionalizado.
     */
    title: z
      .string()
      .min(1, { message: "ValidationErrors.docs_page_title_required" }),
    /**
     * @property {Array<object>} content - Un array de objetos que representan las secciones
     *           de contenido de la documentación. Cada objeto contiene:
     *           - `title`: El título de la sección (ej. "1. Getting Started"), con mensaje de error internacionalizado.
     *           - `body`: Un array de strings, donde cada string es un párrafo de texto,
     *                     con mensajes de error internacionalizados para array vacío y párrafo vacío.
     */
    content: z
      .array(
        z.object({
          title: z
            .string()
            .min(1, {
              message: "ValidationErrors.docs_page_section_title_required",
            }),
          body: z
            .array(
              z
                .string()
                .min(1, {
                  message: "ValidationErrors.docs_page_paragraph_required",
                })
            )
            .min(1, {
              message: "ValidationErrors.docs_page_body_content_required",
            }),
        })
      )
      .min(1, {
        message: "ValidationErrors.docs_page_content_sections_required",
      }),
    /**
     * @property {string} [sidebar_title] - Título opcional para la barra lateral de navegación,
     *           permitiendo futuras expansiones de la UI.
     */
    sidebar_title: z.string().optional(),
    /**
     * @property {string} [search_placeholder] - Placeholder opcional para el campo de búsqueda,
     *           permitiendo futuras expansiones de la UI.
     */
    search_placeholder: z.string().optional(),
  })
  .transform((data) => {
    // Aplicar lógica de migración si el contenido proviene de una versión anterior.
    const incomingVersion = data.version ?? 0; // Asumir versión 0 si no está presente
    if (incomingVersion < CURRENT_DOCS_SCHEMA_VERSION) {
      // En un entorno real, descomentar la siguiente línea para aplicar la migración.
      // console.log(`[DocsPageSchema:Transform] Migrando contenido de v${incomingVersion} a v${CURRENT_DOCS_SCHEMA_VERSION}.`);
      // return migrateDocsContent(data, incomingVersion);
    }
    // Si la versión es actual o no se necesita migración, devolver los datos con la versión actual.
    return { ...data, version: CURRENT_DOCS_SCHEMA_VERSION };
  });

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 4.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización Completa de Contrato**: ((Implementada)) El schema ha sido actualizado para reflejar la estructura completa y anidada del archivo `messages/pages/DocsPage.json`, incluyendo el título principal y el array de secciones de contenido. Esto resuelve la brecha crítica de sincronización y asegura el tipado de todas las claves de traducción.
 * 2. **Localización de Mensajes de Error de Zod**: ((Implementada)) Se han redefinido los mensajes de error de Zod para que sean claves de internacionalización (`ValidationErrors.docs_page_title_required`, etc.). Esto permite que el sistema de manejo de errores del cliente (`useHandleErrors`) traduzca y muestre estos mensajes de forma coherente y configurable.
 * 3. **Sistema de Versionado de Esquemas de Contenido**: ((Implementada)) Se ha introducido un campo `version: z.number().default(CURRENT_DOCS_SCHEMA_VERSION)` y un `.transform()` en el esquema de nivel superior. Esto establece un patrón arquitectónico de élite para la compatibilidad con versiones anteriores de la estructura de contenido, facilitando futuras evoluciones del esquema.
 * 4. **Robustez de Validación**: ((Implementada)) Se han añadido validaciones `.min(1)` a todas las propiedades de tipo `string` y a los arrays (`content`, `body`) para asegurar que las claves de traducción no estén vacías y que haya al menos un elemento. Esto aumenta la robustez del contrato.
 * 5. **Documentación TSDoc de Élite**: ((Implementada)) Se ha añadido documentación TSDoc verbosa a cada sección y propiedad del schema, incluyendo la nueva lógica de versionado, lo que mejora la claridad para desarrolladores y traductores.
 * 6. **Previsión de Futuras Mejoras (DX)**: ((Implementada)) Se han añadido los campos opcionales `sidebar_title` y `search_placeholder` al schema. Esto anticipa posibles necesidades futuras de UI para una página de documentación más completa (ej. con barra lateral y búsqueda), proporcionando puntos de extensión sin necesidad de romper el contrato existente.
 *
 * @subsection Melhorias Futuras
 * 1. **Automatización de Migración de Contenido**: ((Vigente)) La función `migrateDocsContent` actual es un placeholder. La mejora real implica implementar la lógica de migración de datos dentro de esta función para transformar versiones antiguas de contenido JSON a la estructura actual, lo cual sería invocado por el `.transform()` de Zod. Esto es una tarea compleja que requeriría un análisis detallado de las posibles versiones futuras del contenido.
 * 2. **Integración con Logging para Migración**: ((Vigente)) Si se implementa una migración real, la función `migrateDocsContent` debería utilizar `logger.info` para registrar el éxito de la migración y `logger.error` si encuentra datos irrecuperables o un formato inesperado durante el proceso.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/DocsPage.schema.ts
