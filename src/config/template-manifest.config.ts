// src/config/template-manifest.config.ts
/**
 * @file template-manifest.config.ts
 * @description Manifiesto Declarativo y SSoT para las plantillas de bloques visuales.
 *              Este aparato mapea cada categoría de bloque a un array de plantillas
 *              específicas que se mostrarán en el `TemplateGalleryModal`.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { type BlockCategoryId } from "./block-categories.config";

/**
 * @public
 * @interface TemplateDefinition
 * @description Define el contrato de datos para una única plantilla visual.
 */
export interface TemplateDefinition {
  /** El identificador único de la plantilla. */
  id: string;
  /** El tipo de bloque que esta plantilla instancia (ej. "Hero1"). */
  blockType: string;
  /** La clave para obtener el nombre traducido de la plantilla. */
  i18nKey: string;
  /** La ruta a la imagen de previsualización. */
  previewImageUrl: string;
  /**
   * @property {Record<string, unknown>} initialProps - Un objeto con las
   *           propiedades iniciales que esta plantilla aplicará al nuevo bloque,
   *           sobrescribiendo los valores por defecto de `blockEditorDefinitions`.
   */
  initialProps?: Record<string, unknown>;
}

/**
 * @public
 * @constant TEMPLATE_MANIFEST
 * @description El registro canónico que define todas las plantillas disponibles,
 *              agrupadas por `BlockCategoryId`.
 */
export const TEMPLATE_MANIFEST: Record<BlockCategoryId, TemplateDefinition[]> =
  {
    layout: [
      {
        id: "header-corporate-dark",
        blockType: "Header1",
        i18nKey: "template_header_corporate_dark",
        previewImageUrl: "/images/templates/previews/header1-dark.png", // Placeholder
        initialProps: {
          logoText: "NexusCorp",
          ctaText: "Request Demo",
        },
      },
    ],
    content: [
      {
        id: "hero-primary-centered",
        blockType: "Hero1",
        i18nKey: "template_hero_primary_centered",
        previewImageUrl: "/images/templates/previews/hero1-centered.png", // Placeholder
      },
      {
        id: "features-3-col-icons",
        blockType: "Features1",
        i18nKey: "template_features_3_col_icons",
        previewImageUrl: "/images/templates/previews/features1-3col.png", // Placeholder
      },
    ],
    media: [],
    forms: [],
    footers: [],
  };

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **SSoT de Plantillas Visuales**: ((Implementada)) Este manifiesto establece la fuente de verdad para el contenido de la galería, desacoplando completamente la UI del modal de los datos que muestra.
 * 2. **Configuración de Sobrescritura de Props**: ((Implementada)) La propiedad `initialProps` es una capacidad de élite que permite que las plantillas no solo definan una apariencia, sino que también inyecten contenido inicial específico, mejorando la velocidad de creación para el usuario.
 *
 * @subsection Melhorias Futuras
 * 1. **Poblar el Manifiesto**: ((Vigente)) El manifiesto debe ser expandido para incluir múltiples variaciones para cada categoría, creando una biblioteca rica y útil.
 * 2. **Carga desde Base de Datos/CMS**: ((Vigente)) Para una gestión de plantillas sin necesidad de despliegues, este manifiesto podría ser cargado desde una tabla `block_templates` en la base de datos o desde un CMS Headless.
 * 3. **Etiquetas de Plantilla**: ((Vigente)) El contrato `TemplateDefinition` podría ser extendido para incluir `tags: string[]` (ej. "minimalista", "corporativo", "oscuro"), permitiendo al `TemplateGalleryModal` implementar un sistema de filtrado avanzado.
 *
 * =====================================================================
 */
// src/config/template-manifest.config.ts
