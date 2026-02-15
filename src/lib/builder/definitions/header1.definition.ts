// src/lib/builder/definitions/header1.definition.ts
/**
 * @file header1.definition.ts
 * @description Manifiesto de edición atómico y Única Fuente de Verdad (SSoT)
 *              para las propiedades editables del bloque `Header1`. Este aparato
 *              aísla la configuración de un único "LEGO brick".
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 205-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { type BlockEditableDefinition } from "../types.d";

export const Header1Definition: BlockEditableDefinition = {
  properties: {
    logoText: {
      label: "properties.logoText_label",
      type: "text",
      defaultValue: "Tu Marca",
    },
    ctaText: {
      label: "properties.ctaText_label",
      type: "text",
      defaultValue: "Empezar Ahora",
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
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical (SRP)**: ((Implementada)) Este nuevo aparato tiene la única y clara responsabilidad de definir la estructura editable para el bloque `Header1`, mejorando la mantenibilidad y escalabilidad.
 * 2. **Full Internacionalización**: ((Implementada)) Las propiedades `label` utilizan claves de i18n, desacoplando la configuración de la presentación.
 *
 * @subsection Melhorias Futuras
 * 1. **Validación de `defaultValue`**: ((Vigente)) Se podría añadir una validación en un script de build que asegure que el `defaultValue` para un tipo `color` sea un código hexadecimal válido.
 * 2. **Grupo de Propiedades**: ((Vigente)) Añadir una propiedad opcional `group: 'Branding' | 'Navegación'` a `EditablePropertyDefinition` para permitir que el `SettingsPanel` agrupe visualmente las propiedades relacionadas.
 *
 * =====================================================================
 */
// src/lib/builder/definitions/header1.definition.ts
