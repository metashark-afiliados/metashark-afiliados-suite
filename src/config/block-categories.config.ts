// src/config/block-categories.config.ts
/**
 * @file block-categories.config.ts
 * @description Manifiesto de Configuración Declarativo y SSoT para las categorías
 *              de bloques del constructor. Corregido para ser un módulo ES6.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.1
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { type LucideIconName } from "@/config/lucide-icon-names";

/**
 * @public
 * @typedef BlockCategoryId
 * @description Define los identificadores únicos para cada categoría de bloque.
 */
export type BlockCategoryId =
  | "layout"
  | "content"
  | "media"
  | "forms"
  | "footers";

/**
 * @public
 * @interface BlockCategoryDefinition
 * @description Define el contrato de datos para una única categoría de bloques.
 */
export interface BlockCategoryDefinition {
  /** El identificador único de la categoría. */
  id: BlockCategoryId;
  /** El nombre del icono de lucide-react a renderizar. */
  iconName: LucideIconName;
  /** La clave para obtener el nombre traducido de la categoría. */
  i18nKey: string;
}

/**
 * @public
 * @constant BLOCK_CATEGORIES_CONFIG
 * @description La SSoT canónica que define todas las categorías de bloques disponibles.
 */
export const BLOCK_CATEGORIES_CONFIG: BlockCategoryDefinition[] = [
  { id: "layout", iconName: "PanelTop", i18nKey: "category_layout" },
  { id: "content", iconName: "Pilcrow", i18nKey: "category_content" },
  { id: "media", iconName: "Image", i18nKey: "category_media" },
  { id: "forms", iconName: "Mail", i18nKey: "category_forms" },
  { id: "footers", iconName: "PanelBottom", i18nKey: "category_footers" },
];

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Integridad de Módulo**: ((Implementada)) Se han añadido las palabras clave `export`, convirtiendo el archivo en un módulo ES6 estándar. Esto resuelve el error de compilación `TS2306` en su origen.
 *
 * =====================================================================
 */
// src/config/block-categories.config.ts
