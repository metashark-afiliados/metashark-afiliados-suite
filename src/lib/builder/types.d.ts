// src/lib/builder/types.d.ts
/**
 * @file src/lib/builder/types.d.ts
 * @description Contrato de datos canónico y Única Fuente de Verdad (SSoT) para todo
 *              el sistema del constructor ("Builder"). Define la estructura de cada
 *              entidad de datos, desde la configuración global de una campaña hasta
 *              la definición de una propiedad editable individual.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.2.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { z } from "zod";
import { type LucideIconName } from "@/config/lucide-icon-names";

// --- ESQUEMAS DE ZOD (SSoT para la forma de los datos) ---

/**
 * @public
 * @constant BlockStylesSchema
 * @description Valida el objeto de estilos CSS que puede ser aplicado a un `PageBlock`.
 */
export const BlockStylesSchema = z.object({
  backgroundColor: z.string().optional(),
  textColor: z.string().optional(),
  paddingTop: z.string().optional(),
  paddingBottom: z.string().optional(),
  marginTop: z.string().optional(),
  marginBottom: z.string().optional(),
});

/**
 * @public
 * @constant PageBlockSchema
 * @description Valida la estructura fundamental de un único bloque de construcción
 *              dentro del array `blocks` de una campaña.
 */
export const PageBlockSchema = z.object({
  id: z.string(),
  type: z.string(),
  props: z.record(z.any()),
  styles: BlockStylesSchema,
});

/**
 * @public
 * @constant CampaignThemeSchema
 * @description Valida el objeto de tema global para una campaña, definiendo
 *              estilos consistentes a través de todos los bloques.
 */
export const CampaignThemeSchema = z.object({
  globalFont: z.string(),
  globalColors: z.record(z.string()),
});

/**
 * @public
 * @constant CampaignConfigSchema
 * @description El esquema raíz que representa la configuración completa y serializable
 *              de una campaña, tal como se almacena en el campo `content` de la base de datos.
 */
export const CampaignConfigSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  site_id: z.string().uuid().nullable(),
  theme: CampaignThemeSchema,
  blocks: z.array(PageBlockSchema),
});

// --- TIPOS DE TYPESCRIPT (Inferidos y Explícitos) ---

export type BlockStyles = z.infer<typeof BlockStylesSchema>;
export type PageBlock<T = Record<string, any>> = {
  id: string;
  type: string;
  props: T;
  styles: BlockStyles;
};
export type CampaignTheme = z.infer<typeof CampaignThemeSchema>;
export type CampaignConfig = z.infer<typeof CampaignConfigSchema>;

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
  | "icon"
  | "array";

/**
 * @public
 * @interface FeatureItem
 * @description Define el contrato de datos para una única tarjeta de característica.
 */
export interface FeatureItem {
  icon: LucideIconName;
  title: string;
  description: string;
}

/**
 * @public
 * @interface TestimonialItem
 * @description Define el contrato de datos para un único testimonio.
 */
export interface TestimonialItem {
  authorImage: string;
  quote: string;
  authorName: string;
  authorTitle: string;
}

/**
 * @public
 * @interface LinkItem
 * @description Define el contrato de datos para un único enlace de navegación,
 *              utilizado en componentes como el `Footer1`.
 */
export interface LinkItem {
  text: string;
  href: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

/**
 * @public
 * @interface EditablePropertyDefinition
 * @description Define el contrato para una única propiedad editable dentro del
 *              manifiesto `blockEditorDefinitions`.
 */
export interface EditablePropertyDefinition {
  label: string;
  type: BlockPropertyType;
  defaultValue?: any;
  placeholder?: string;
  options?: SelectOption[];
  /** Si `type` es 'array', este schema define la estructura de cada item. */
  itemSchema?: BlockPropertiesSchema;
}

export type BlockPropertiesSchema = Record<string, EditablePropertyDefinition>;

/**
 * @public
 * @interface BlockEditableDefinition
 * @description Define el contrato completo para las propiedades y estilos
 *              editables de un tipo de bloque.
 */
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
 * 1. **Restauración de SSoT Canónica**: ((Implementada)) Se ha restaurado la versión completa y correcta del archivo, resolviendo la regresión.
 * 2. **Documentación TSDoc Granular**: ((Implementada)) Cada tipo, interfaz y esquema exportado ahora tiene una descripción detallada de su propósito.
 *
 * @subsection Melhorias Futuras
 * 1. **Versionado de Esquema**: ((Vigente)) Añadir un campo `version: z.number()` a `CampaignConfigSchema` para facilitar futuras migraciones de datos.
 *
 * =====================================================================
 */
// src/lib/builder/types.d.ts
