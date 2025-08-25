// src/lib/builder/definitions/testimonials1.definition.ts
/**
 * @file testimonials1.definition.ts
 * @description Manifiesto de edición atómico y SSoT para las propiedades
 *              editables del bloque `Testimonials1`.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { type BlockEditableDefinition, type TestimonialItem } from "../types.d";

const initialTestimonials: TestimonialItem[] = [
  {
    authorImage: "/images/avatars/avatar-1.png",
    quote:
      "Este producto ha transformado completamente mi flujo de trabajo. ¡Absolutamente esencial!",
    authorName: "Jane Doe",
    authorTitle: "CEO, Innovate Inc.",
  },
  {
    authorImage: "/images/avatars/avatar-1.png",
    quote:
      "El soporte al cliente es de otro nivel. Resolvieron mi problema en minutos.",
    authorName: "John Smith",
    authorTitle: "Marketer Digital",
  },
];

export const Testimonials1Definition: BlockEditableDefinition = {
  properties: {
    title: {
      label: "properties.title_label",
      type: "text",
      defaultValue: "Lo que dicen nuestros clientes",
    },
    subtitle: {
      label: "properties.subtitle_label",
      type: "textarea",
      defaultValue: "Resultados reales de gente real.",
    },
    testimonials: {
      label: "properties.testimonials_label",
      type: "array",
      defaultValue: initialTestimonials,
      itemSchema: {
        authorImage: { label: "properties.authorImage_label", type: "image" },
        quote: { label: "properties.quote_label", type: "textarea" },
        authorName: { label: "properties.authorName_label", type: "text" },
        authorTitle: { label: "properties.authorTitle_label", type: "text" },
      },
    },
  },
  styles: {
    backgroundColor: {
      label: "properties.backgroundColor_label",
      type: "color",
      defaultValue: "#F3F4F6",
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
 * 1. **Atomicidad Radical (SRP)**: ((Implementada)) Este aparato aísla la configuración del bloque `Testimonials1`, mejorando la mantenibilidad.
 *
 * @subsection Melhorias Futuras
 * 1. **Propiedad de Calificación (Rating)**: ((Vigente)) Añadir una propiedad `rating` al `itemSchema` de tipo `number` para permitir al usuario añadir una calificación de estrellas.
 *
 * =====================================================================
 */
// src/lib/builder/definitions/testimonials1.definition.ts
