// src/lib/builder/types.d.ts
/**
 * @file src/lib/builder/types.d.ts
 * @description Define las interfaces y los esquemas de validación de Zod que
 *              gobiernan la estructura de una campaña, así como la definición
 *              declarativa de las propiedades editables de los bloques.
 *              Este archivo actúa como el "contrato de datos" oficial para
 *              todo el sistema del constructor.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

// --- Esquemas de Validación (Zod) ---

/**
 * @public
 * @constant BlockStylesSchema
 * @description Define las propiedades de estilo CSS personalizables para un bloque.
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
 * @description Define la estructura de un único bloque (componente) dentro de una página.
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
 * @description Define los ajustes de tema globales para una campaña.
 */
export const CampaignThemeSchema = z.object({
  globalFont: z.string(),
  globalColors: z.record(z.string()),
});

/**
 * @public
 * @constant CampaignConfigSchema
 * @description El esquema raíz que representa la configuración completa de una campaña.
 */
export const CampaignConfigSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
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

/**
 * @public
 * @typedef BlockPropertyType
 * @description Define los tipos de controles de UI que se pueden usar para editar una propiedad.
 */
export type BlockPropertyType =
  | "text"
  | "textarea"
  | "boolean"
  | "color"
  | "number"
  | "select"
  | "image";

/**
 * @public
 * @interface SelectOption
 * @description Define la estructura para una opción en un control de tipo 'select'.
 */
export interface SelectOption {
  value: string;
  label: string;
}

/**
 * @public
 * @interface EditablePropertyDefinition
 * @description Define la estructura para una única propiedad editable de un bloque.
 */
export interface EditablePropertyDefinition {
  label: string;
  type: BlockPropertyType;
  defaultValue?: any;
  placeholder?: string;
  options?: SelectOption[];
}

/**
 * @public
 * @typedef BlockPropertiesSchema
 * @description Un mapa de definiciones de propiedades editables.
 */
export type BlockPropertiesSchema = Record<string, EditablePropertyDefinition>;

/**
 * @public
 * @interface BlockEditableDefinition
 * @description Define la estructura completa para la edición de un tipo de bloque,
 *              separando propiedades de contenido y de estilo.
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
 * 1. **Contrato de Datos del Constructor**: ((Implementada)) Este aparato establece el contrato de datos completo y la SSoT para toda la funcionalidad del constructor de campañas, una dependencia crítica para todos los aparatos del builder.
 * 2. **Documentación de Élite**: ((Implementada)) Se ha mejorado la documentación TSDoc para cumplir con los estándares del protocolo.
 *
 * @subsection Melhorias Futuras
 * 1. **Tipado Genérico Avanzado en Zod**: ((Vigente)) El esquema `PageBlockSchema` usa `z.record(z.any())` para las props. Se podría crear una función genérica para generar esquemas de bloque específicos y validar las props de cada tipo de bloque con su propio esquema Zod.
 * 2. **Versionado de Esquema**: ((Vigente)) Añadir un campo `version: z.number()` a `CampaignConfigSchema` para facilitar futuras migraciones de datos si la estructura cambia.
 *
 * =====================================================================
 */
// src/lib/builder/types.d.ts
