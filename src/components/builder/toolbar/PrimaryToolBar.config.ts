// src/components/builder/toolbar/PrimaryToolBar.config.ts
/**
 * @file PrimaryToolBar.config.ts
 * @description Manifiesto de Configuración Declarativo y SSoT para la barra
 *              de herramientas principal. Sincronizado con la nueva semántica de
 *              "Añadir Contenido".
 * @author Raz Podestá - MetaShark Tech
 * @version 2.1.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { type LucideIconName } from "@/config/lucide-icon-names";

export type ContextualPanelType =
  | "add_content"
  | "elements"
  | "text"
  | "brand"
  | "uploads"
  | "tools";

export interface ToolDefinition {
  id: ContextualPanelType;
  iconName: LucideIconName;
  i18nKey: string;
}

export const PRIMARY_TOOLS_CONFIG: ToolDefinition[] = [
  // --- INICIO DE SINCRONIZACIÓN SEMÁNTICA ---
  { id: "add_content", iconName: "Palette", i18nKey: "add_content" },
  // --- FIN DE SINCRONIZACIÓN SEMÁNTICA ---
  { id: "elements", iconName: "Shapes", i18nKey: "elements" },
  { id: "text", iconName: "CaseSensitive", i18nKey: "text" },
  { id: "brand", iconName: "Crown", i18nKey: "brand" },
  { id: "uploads", iconName: "CloudUpload", i18nKey: "uploads" },
  { id: "tools", iconName: "Wand", i18nKey: "tools" },
];

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización Semántica**: ((Implementada)) Se ha actualizado la ID y la clave de i18n de 'design' a 'add_content', reflejando con precisión la nueva funcionalidad y terminología de la UI.
 *
 * =====================================================================
 */
// src/components/builder/toolbar/PrimaryToolBar.config.ts
