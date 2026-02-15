// src/lib/builder/definitions/footer1.definition.ts
/**
 * @file footer1.definition.ts
 * @description Manifiesto de edición atómico y SSoT para las propiedades
 *              editables del bloque `Footer1`.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { type BlockEditableDefinition, type LinkItem } from "../types.d";

const initialLinks: LinkItem[] = [
  { text: "Enlace 1", href: "#" },
  { text: "Enlace 2", href: "#" },
  { text: "Enlace 3", href: "#" },
];

export const Footer1Definition: BlockEditableDefinition = {
  properties: {
    brandName: {
      label: "properties.brandName_label",
      type: "text",
      defaultValue: "Tu Marca",
    },
    slogan: {
      label: "properties.slogan_label",
      type: "textarea",
      defaultValue: "Tu eslogan memorable aquí.",
    },
    copyrightText: {
      label: "properties.copyrightText_label",
      type: "text",
      defaultValue: `© ${new Date().getFullYear()} Tu Marca. Todos los derechos reservados.`,
    },
    productLinks: {
      label: "properties.productLinks_label",
      type: "array",
      defaultValue: initialLinks,
      itemSchema: {
        text: { label: "properties.linkText_label", type: "text" },
        href: { label: "properties.linkHref_label", type: "text" },
      },
    },
    companyLinks: {
      label: "properties.companyLinks_label",
      type: "array",
      defaultValue: initialLinks,
      itemSchema: {
        text: { label: "properties.linkText_label", type: "text" },
        href: { label: "properties.linkHref_label", type: "text" },
      },
    },
    legalLinks: {
      label: "properties.legalLinks_label",
      type: "array",
      defaultValue: initialLinks,
      itemSchema: {
        text: { label: "properties.linkText_label", type: "text" },
        href: { label: "properties.linkHref_label", type: "text" },
      },
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
      defaultValue: "#9CA3AF",
    },
  },
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical (SRP)**: ((Implementada)) Este aparato aísla la configuración del bloque `Footer1`, el más complejo hasta ahora, demostrando la escalabilidad del patrón.
 *
 * @subsection Melhorias Futuras
 * 1. **Iconos de Redes Sociales**: ((Vigente)) Añadir una propiedad de tipo `array` para gestionar enlaces a redes sociales, incluyendo un campo `icon` en el `itemSchema`.
 *
 * =====================================================================
 */
// src/lib/builder/definitions/footer1.definition.ts
