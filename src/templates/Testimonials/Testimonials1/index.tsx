// src/templates/Testimonials/Testimonials1/index.tsx
/**
 * @file index.tsx
 * @description Componente de bloque de plantilla para una sección de "Testimonios".
 *              Es un componente de presentación puro, editable y full internacionalizado,
 *              que renderiza una cuadrícula de testimonios con contenido editable en vivo.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import React from "react";
import Image from "next/image";

import { EditableText } from "@/components/builder/ui/EditableText";
import { type TestimonialItem } from "@/lib/builder/types.d";
import { clientLogger } from "@/lib/logging";

/**
 * @public
 * @interface Testimonials1Props
 * @description Contrato de props para el componente. Incluye las props inyectadas
 *              por el `DraggableBlockWrapper` para la edición en vivo.
 */
export interface Testimonials1Props {
  blockId: string;
  title: string;
  subtitle: string;
  testimonials: TestimonialItem[];
  onUpdate: (propName: string, newValue: any) => void;
}

/**
 * @public
 * @component Testimonials1
 * @description Renderiza una sección de testimonios con título, subtítulo y
 *              una cuadrícula de testimonios, todo editable.
 * @param {Testimonials1Props} props - Las propiedades para configurar el componente.
 * @returns {React.ReactElement}
 */
export function Testimonials1({
  blockId,
  title,
  subtitle,
  testimonials,
  onUpdate,
}: Testimonials1Props): React.ReactElement {
  clientLogger.trace(
    `[Testimonials1:Render] Renderizando bloque con ID: ${blockId}`
  );

  const handleTestimonialUpdate = (
    index: number,
    field: keyof TestimonialItem,
    value: string
  ) => {
    const newTestimonials = [...testimonials];
    newTestimonials[index] = { ...newTestimonials[index], [field]: value };
    onUpdate("testimonials", newTestimonials);
  };

  return (
    <section
      className="py-20 bg-muted/50 font-sans text-foreground"
      data-lia-marker="Testimonials1"
    >
      <div className="container mx-auto flex flex-col items-center gap-8 px-4 md:px-6">
        <EditableText
          tag="h2"
          value={title}
          onSave={(newValue) => onUpdate("title", newValue)}
          className="text-3xl font-bold text-center"
          placeholder="Título de Testimonios"
        />
        <EditableText
          tag="p"
          value={subtitle}
          onSave={(newValue) => onUpdate("subtitle", newValue)}
          className="max-w-2xl text-center text-muted-foreground"
          placeholder="Subtítulo para la sección de testimonios."
        />

        <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-3 w-full">
          {(testimonials || []).map((testimonial, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-lg bg-card border"
            >
              <EditableText
                tag="p"
                value={testimonial.quote}
                onSave={(newValue) =>
                  handleTestimonialUpdate(index, "quote", newValue)
                }
                className="italic text-muted-foreground mb-6"
                placeholder={`"Cita inspiradora del cliente ${index + 1}"`}
              />
              <div className="flex items-center gap-4">
                <Image
                  src={testimonial.authorImage}
                  alt={`Avatar de ${testimonial.authorName}`}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div className="text-left">
                  <EditableText
                    tag="p"
                    value={testimonial.authorName}
                    onSave={(newValue) =>
                      handleTestimonialUpdate(index, "authorName", newValue)
                    }
                    className="font-semibold"
                    placeholder={`Nombre del Autor ${index + 1}`}
                  />
                  <EditableText
                    tag="p"
                    value={testimonial.authorTitle}
                    onSave={(newValue) =>
                      handleTestimonialUpdate(index, "authorTitle", newValue)
                    }
                    className="text-sm text-muted-foreground"
                    placeholder={`Cargo del Autor ${index + 1}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Componente de Prueba Social**: ((Implementada)) Se ha creado un nuevo bloque de construcción esencial para cualquier landing page de alta conversión.
 * 2. **Lógica de Actualización Anidada Robusta**: ((Implementada)) La función `handleTestimonialUpdate` valida la capacidad de la arquitectura para manejar la edición de arrays de objetos complejos.
 *
 * @subsection Melhorias Futuras
 * 1. **Selector de Imagen de Avatar**: ((Vigente)) Una mejora de élite sería reemplazar el componente `Image` por un `EditableImage` que, al hacer clic, abra un modal de la `AssetLibrary`.
 * 2. **Componente de Calificación (Estrellas)**: ((Vigente)) Se podría añadir una prop `rating: number` al `TestimonialItem` y un componente `StarRating` para mostrar una calificación visual.
 *
 * =====================================================================
 */
// src/templates/Testimonials/Testimonials1/index.tsx
