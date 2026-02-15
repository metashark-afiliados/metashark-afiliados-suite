// src/lib/builder/definitions/hero1.definition.ts
/**
 * @file hero1.definition.ts
 * @description Manifiesto de edición atómico y SSoT para las propiedades
 *              editables del bloque `Hero1`.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { type BlockEditableDefinition } from "../types.d";

export const Hero1Definition: BlockEditableDefinition = {
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
  },
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical (SRP)**: ((Implementada)) Este aparato aísla la configuración del bloque `Hero1`, mejorando la mantenibilidad.
 * 2. **Full Internacionalización**: ((Implementada)) Utiliza claves de i18n para las etiquetas.
 *
 * @subsection Melhorias Futuras
 * 1. **Propiedad de CTA**: ((Vigente)) Añadir una definición para un botón de CTA, incluyendo `ctaText` y `ctaHref`, para hacer el bloque más funcional.
 *
 * =====================================================================
 */
// src/lib/builder/definitions/hero1.definition.ts
