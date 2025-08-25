// src/lib/builder/types.d.ts
/**
 * @file src/lib/builder/types.d.ts
 * @description Contrato de datos canónico para el sistema del constructor.
 *              Sincronizado para exportar `FeatureItem` y expandir `BlockPropertyType`,
 *              resolviendo la desincronización de contratos.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { z } from "zod";
import { type LucideIconName } from "@/config/lucide-icon-names";

export const BlockStylesSchema = z.object({
  backgroundColor: z.string().optional(),
  textColor: z.string().optional(),
  paddingTop: z.string().optional(),
  paddingBottom: z.string().optional(),
  marginTop: z.string().optional(),
  marginBottom: z.string().optional(),
});

export const PageBlockSchema = z.object({
  id: z.string(),
  type: z.string(),
  props: z.record(z.any()),
  styles: BlockStylesSchema,
});

export const CampaignThemeSchema = z.object({
  globalFont: z.string(),
  globalColors: z.record(z.string()),
});

export const CampaignConfigSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  site_id: z.string().uuid().nullable(),
  theme: CampaignThemeSchema,
  blocks: z.array(PageBlockSchema),
});

// --- Tipos de TypeScript (Inferidos y Explícitos) ---

export type BlockStyles = z.infer<typeof BlockStylesSchema>;
export type PageBlock<T = Record<string, any>> = {
  id: string;
  type: string;
  props: T;
  styles: BlockStyles;
};
export type CampaignTheme = z.infer<typeof CampaignThemeSchema>;
export type CampaignConfig = z.infer<typeof CampaignConfigSchema>;

// --- INICIO DE REFACTORIZACIÓN DE ÉLITE ---
/**
 * @public
 * @typedef BlockPropertyType
 * @description Define la unión de todos los tipos de control de UI válidos
 *              que el `SettingsPanel` puede renderizar.
 */
export type BlockPropertyType =
  | "text"
  | "textarea"
  | "boolean"
  | "color"
  | "number"
  | "select"
  | "image"
  | "icon" // <-- SINCRONIZADO
  | "array"; // <-- SINCRONIZADO

/**
 * @public
 * @interface FeatureItem
 * @description Define el contrato de datos para una única característica.
 */
export interface FeatureItem {
  icon: LucideIconName;
  title: string;
  description: string;
}
// --- FIN DE REFACTORIZACIÓN DE ÉLITE ---

export interface SelectOption {
  value: string;
  label: string;
}

export interface EditablePropertyDefinition {
  label: string;
  type: BlockPropertyType;
  defaultValue?: any;
  placeholder?: string;
  options?: SelectOption[];
  /**
   * @description Si `type` es 'array', este schema define la estructura
   *              de cada item en el array.
   */
  itemSchema?: BlockPropertiesSchema;
}

export type BlockPropertiesSchema = Record<string, EditablePropertyDefinition>;

export interface BlockEditableDefinition {
  properties: BlockPropertiesSchema;
  styles: BlockPropertiesSchema;
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Contratos**: ((Implementada)) Se ha añadido `array` y `icon` a `BlockPropertyType` y se ha exportado `FeatureItem`. Esto resuelve la causa raíz de los errores `TS2322` y `TS2305`.
 * 2. **Soporte para Tipos de Array**: ((Implementada)) Se ha añadido la propiedad opcional `itemSchema` a `EditablePropertyDefinition`, estableciendo el contrato para que el `SettingsPanel` pueda renderizar editores para listas de objetos complejos.
 *
 * @subsection Melhorias Futuras
 * 1. **Tipos de Control Avanzados**: ((Vigente)) El `BlockPropertyType` puede ser expandido con más tipos como `slider`, `toggle-group` o `date-picker` para habilitar controles de UI de edición más ricos y específicos.
 *
 * =====================================================================
 */
// src/lib/builder/types.d.ts
