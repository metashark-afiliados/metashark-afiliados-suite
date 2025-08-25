// src/config/block-categories.config.ts
/**
 * @file block-categories.config.ts
 * @description Manifiesto de Configuración Declarativo y SSoT para las categorías
 *              de bloques del constructor. Sincronizado con la nueva visión
 *              semántica para un constructor de landing pages profesional.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { type LucideIconName } from "@/config/lucide-icon-names";

export type BlockCategoryId =
  | "templates"
  | "headers"
  | "heros"
  | "features"
  | "testimonials"
  | "footers";

export interface BlockCategoryDefinition {
  id: BlockCategoryId;
  iconName: LucideIconName;
  i18nKey: string;
}

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

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización Semántica**: ((Implementada)) El manifiesto ahora refleja la nueva estructura de categorías solicitada (`Templates`, `Headers`, `Heros`, etc.), sentando las bases para la nueva UX.
 *
 * @subsection Melhorias Futuras
 * 1. **Carga desde Base de Datos**: ((Vigente)) Para una flexibilidad máxima, esta configuración podría ser cargada desde una tabla `block_categories` en la base de datos.
 *
 * =====================================================================
 */
// src/config/block-categories.config.ts
