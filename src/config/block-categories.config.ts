// src/config/block-categories.config.ts
/**
 * @file block-categories.config.ts
 * @description Manifiesto de Configuración Declarativo y SSoT para las categorías
 *              de bloques del constructor. Corregido para asegurar la exportación
 *              correcta de la configuración, resolviendo un error crítico de build.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 2.1.0
 */
import { type LucideIconName } from "@/config/lucide-icon-names";

/**
 * @public
 * @typedef BlockCategoryId
 * @description Define la unión de todos los identificadores de categoría de bloque válidos.
 */
export type BlockCategoryId =
  | "templates"
  | "headers"
  | "heros"
  | "features"
  | "testimonials"
  | "footers";

/**
 * @public
 * @interface BlockCategoryDefinition
 * @description Define el contrato de datos para una única categoría de bloque.
 */
export interface BlockCategoryDefinition {
  id: BlockCategoryId;
  iconName: LucideIconName;
  i18nKey: string;
}

/**
 * @public
 * @constant BLOCK_CATEGORIES_CONFIG
 * @description El manifiesto canónico que define la estructura y metadatos
 *              de las categorías de bloques disponibles en el constructor.
 */
export const BLOCK_CATEGORIES_CONFIG: BlockCategoryDefinition[] = [
  {
    id: "templates",
    iconName: "LayoutTemplate",
    i18nKey: "category_templates",
  },
  { id: "headers", iconName: "PanelTop", i18nKey: "category_headers" },
  { id: "heros", iconName: "Image", i18nKey: "category_heros" },
  { id: "features", iconName: "Sparkles", i18nKey: "category_features" },
  { id: "testimonials", iconName: "Quote", i18nKey: "category_testimonials" },
  { id: "footers", iconName: "PanelBottom", i18nKey: "category_footers" },
];
// src/config/block-categories.config.ts
