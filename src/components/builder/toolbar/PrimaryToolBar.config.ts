// src/components/builder/toolbar/PrimaryToolBar.config.ts
/**
 * @file PrimaryToolBar.config.ts
 * @description Manifiesto de Configuración Declarativo y SSoT para la barra
 *              de herramientas principal del constructor. Refactorizado para
 *              utilizar claves de i18n, completando su desacoplamiento del contenido.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-24
 */
import { type LucideIconName } from "@/config/lucide-icon-names";

/**
 * @public
 * @typedef ContextualPanelType
 * @description Define los identificadores únicos para cada panel contextual que
 *              puede ser activado por la barra de herramientas principal.
 */
export type ContextualPanelType =
  | "design"
  | "elements"
  | "text"
  | "brand"
  | "uploads"
  | "tools";

/**
 * @public
 * @interface ToolDefinition
 * @description Define el contrato de datos para un único botón/herramienta en la
 *              barra de herramientas principal.
 */
export interface ToolDefinition {
  /** El identificador único del panel que esta herramienta activa. */
  id: ContextualPanelType;
  /** El nombre del icono de lucide-react a renderizar. */
  iconName: LucideIconName;
  /**
   * @property {string} i18nKey - La clave para obtener el texto traducido
   *                    del botón desde el namespace de i18n.
   */
  i18nKey: string;
}

/**
 * @public
 * @constant PRIMARY_TOOLS_CONFIG
 * @description La SSoT canónica que define todas las herramientas disponibles en la
 *              barra de herramientas principal del constructor.
 */
export const PRIMARY_TOOLS_CONFIG: ToolDefinition[] = [
  { id: "design", iconName: "Palette", i18nKey: "design" },
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
 * 1. **Full Internacionalización**: ((Implementada)) Se ha refactorizado el contrato `ToolDefinition` para que utilice `i18nKey` en lugar de una propiedad `label` codificada. Esto desacopla completamente la configuración de la UI del contenido textual, un pilar de la internacionalización de élite.
 *
 * @subsection Melhorias Futuras
 * 1. **Feature Gating**: ((Vigente)) Añadir una propiedad `requiredPlan?: PlanType` al contrato para permitir que la `PrimaryToolBar` renderice condicionalmente ciertas herramientas solo para usuarios con planes específicos.
 *
 * =====================================================================
 */
// src/components/builder/toolbar/PrimaryToolBar.config.ts
