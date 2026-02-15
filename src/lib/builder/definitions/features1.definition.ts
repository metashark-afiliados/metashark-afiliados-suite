// src/lib/builder/definitions/features1.definition.ts
/**
 * @file features1.definition.ts
 * @description Manifiesto de edición atómico y SSoT para las propiedades
 *              editables del bloque `Features1`.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { type BlockEditableDefinition, type FeatureItem } from "../types.d";

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

export const Features1Definition: BlockEditableDefinition = {
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
        "Explora las características que hacen nuestro producto único.",
    },
    features: {
      label: "properties.features_label",
      type: "array",
      defaultValue: initialFeatures,
      itemSchema: {
        icon: { label: "properties.icon_label", type: "icon" },
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
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Soporte para Tipos de Array**: ((Implementada)) Este manifiesto implementa el patrón `type: "array"` con un `itemSchema`, estableciendo la SSoT para la edición de listas de objetos complejos.
 *
 * @subsection Melhorias Futuras
 * 1. **Validación de `defaultValue`**: ((Vigente)) Se podría añadir validación para asegurar que cada item en `initialFeatures` cumpla el contrato `FeatureItem`.
 *
 * =====================================================================
 */
// src/lib/builder/definitions/features1.definition.ts
