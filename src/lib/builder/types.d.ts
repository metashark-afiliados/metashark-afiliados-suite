// src/lib/builder/types.d.ts
/**
 * @file src/lib/builder/types.d.ts
 * @description Contrato de datos canónico para el sistema del constructor. Ha sido
 *              refactorizado para incluir `site_id` nullable en la configuración de la campaña,
 *              resolviendo la desincronización arquitectónica y permitiendo campañas "huérfanas".
 * @author Raz Podestá
 * @version 2.0.0
 */
import { z } from "zod";

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

/**
 * @public
 * @constant CampaignConfigSchema
 * @description El esquema raíz que representa la configuración completa de una campaña.
 *              Incluye `site_id` como nullable para soportar campañas "huérfanas".
 */
export const CampaignConfigSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  site_id: z.string().uuid().nullable(), // <-- ARQUITECTURA v12.0
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

export type BlockPropertyType =
  | "text"
  | "textarea"
  | "boolean"
  | "color"
  | "number"
  | "select"
  | "image";

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
 * 1. **Sincronización de Contrato Arquitectónico**: ((Implementada)) Se ha modificado `site_id` a `z.string().uuid().nullable()`. Este cambio fundamental alinea el contrato de datos con la nueva lógica de negocio, permitiendo la existencia de campañas no asignadas.
 *
 * @subsection Melhorias Futuras
 * 1. **Versionado de Esquema**: ((Vigente)) Añadir un campo `version: z.number()` a `CampaignConfigSchema` para facilitar futuras migraciones de datos de `content` si la estructura del bloque cambia.
 *
 * =====================================================================
 */
// src/lib/builder/types.d.ts
