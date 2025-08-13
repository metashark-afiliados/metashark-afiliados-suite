// src/lib/validators/i18n/DocsPage.schema.ts
/**
 * @file DocsPage.schema.ts
 * @description Define el contrato de datos para el namespace de internacionalización
 *              'DocsPage', utilizado para la página de documentación.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

/**
 * @public
 * @constant DocsPageSchema
 * @description Define la estructura y los tipos de datos esperados para las
 *              traducciones relacionadas con la página de documentación.
 */
export const DocsPageSchema = z.object({
  /** Título principal de la página de documentación. */
  title: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Completitud de Contrato**: ((Implementada)) Se ha creado este schema que faltaba, completando el conjunto de aparatos atómicos necesarios para el contrato de i18n y permitiendo la corrección del ensamblador principal.
 *
 * @subsection Melhorias Futuras
 * 1. **Estructura Anidada**: ((Vigente)) A medida que la documentación crezca, este schema podría expandirse para incluir claves para secciones específicas, como `sidebar_title` o `search_placeholder`.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/DocsPage.schema.ts
