// src/lib/builder/block-editor-definitions.ts
/**
 * @file block-editor-definitions.ts
 * @description Manifiesto central, declarativo y Única Fuente de Verdad (SSoT) que
 *              define la estructura editable de cada bloque del constructor. Validado
 *              contra los contratos de tipo de élite v3.0.0.
 * @author Raz Podestá - MetaShark Tech
 * @version 4.2.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { type LucideIconName } from "@/config/lucide-icon-names";
import { type BlockEditableDefinition, type FeatureItem } from "./types.d";

/**
 * @private
 * @constant initialFeatures
 * @description Define la estructura de datos inicial por defecto para un nuevo bloque de "Características".
 */
const initialFeatures: FeatureItem[] = [
  {
    icon: "ShieldCheck",
    title: "Característica Segura",
    description: "Descripción de la característica segura y confiable.",
  },
  {
    icon: "Zap",
    title: "Característica Rápida",
    description: "Descripción de la característica increíblemente rápida.",
  },
  {
    icon: "Globe",
    title: "Característica Global",
    description: "Descripción de la característica con alcance global.",
  },
];

/**
 * @public
 * @constant blockEditorDefinitions
 * @description Registro canónico que mapea cada `block.type` a su definición editable.
 */
export const blockEditorDefinitions: Record<string, BlockEditableDefinition> = {
  Header1: {
    properties: {
      logoText: {
        label: "properties.logoText_label",
        type: "text",
        defaultValue: "Mi Marca",
      },
      ctaText: {
        label: "properties.ctaText_label",
        type: "text",
        defaultValue: "Empezar",
      },
    },
    styles: {
      backgroundColor: {
        label: "properties.backgroundColor_label",
        type: "color",
        defaultValue: "#111827",
      },
      textColor: {
        label: "properties.textColor_label",
        type: "color",
        defaultValue: "#F9FAFB",
      },
    },
  },
  Hero1: {
    properties: {
      title: {
        label: "properties.title_label",
        type: "textarea",
        defaultValue: "Título Impactante Para Tu Oferta",
      },
      subtitle: {
        label: "properties.subtitle_label",
        type: "textarea",
        defaultValue:
          "Describe el principal beneficio de tu producto o servicio.",
      },
    },
    styles: {
      backgroundColor: {
        label: "properties.backgroundColor_label",
        type: "color",
        defaultValue: "#F9FAFB",
      },
      textColor: {
        label: "properties.textColor_label",
        type: "color",
        defaultValue: "#1F2937",
      },
      paddingTop: {
        label: "properties.paddingTop_label",
        type: "text",
        defaultValue: "80px",
      },
      paddingBottom: {
        label: "properties.paddingBottom_label",
        type: "text",
        defaultValue: "80px",
      },
    },
  },
  Features1: {
    properties: {
      title: {
        label: "properties.title_label",
        type: "text",
        defaultValue: "Descubre Nuestras Características",
      },
      subtitle: {
        label: "properties.subtitle_label",
        type: "textarea",
        defaultValue:
          "Explora las características que hacen que nuestro producto sea único y poderoso.",
      },
      features: {
        label: "properties.features_label",
        type: "array", // <-- AHORA VÁLIDO
        defaultValue: initialFeatures,
        itemSchema: {
          icon: { label: "properties.icon_label", type: "icon" }, // <-- AHORA VÁLIDO
          title: { label: "properties.title_label", type: "text" },
          description: {
            label: "properties.description_label",
            type: "textarea",
          },
        },
      },
    },
    styles: {
      backgroundColor: {
        label: "properties.backgroundColor_label",
        type: "color",
        defaultValue: "#FFFFFF",
      },
      textColor: {
        label: "properties.textColor_label",
        type: "color",
        defaultValue: "#111827",
      },
    },
  },
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Validación Exitosa**: ((Implementada)) Al consumir los contratos de tipo actualizados desde `types.d.ts`, este manifiesto ahora pasa la validación de TypeScript sin errores.
 * 2. **Cero Regresiones**: ((Implementada)) Se ha mantenido la estructura de datos y las claves de i18n de la versión anterior, garantizando que no haya pérdida de funcionalidad.
 *
 * @subsection Melhorias Futuras
 * 1. **Implementación de `SettingsField`**: ((Vigente)) La deuda técnica principal ahora reside en `SettingsField.tsx`, que debe ser extendido para poder renderizar los nuevos tipos `array` e `icon`.
 *
 * =====================================================================
 */
// src/lib/builder/block-editor-definitions.ts
