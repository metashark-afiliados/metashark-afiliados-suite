// src/lib/validators/i18n/Testimonials.schema.ts
/**
 * @file Testimonials.schema.ts
 * @description Define el contrato de datos atómico para el namespace 'Testimonials'
 *              dentro de `landing.json`. Valida la estructura completa de la
 *              sección de testimonios, incluyendo un array de objetos de testimonios.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
import { z } from "zod";

export const TestimonialsSchema = z.object({
  /** Etiqueta de la sección, ej. "Testimonios". */
  tag: z.string(),
  /** Título principal de la sección. */
  title: z.string(),
  /** Subtítulo o descripción de la sección. */
  subtitle: z.string(),
  /** Array de objetos, donde cada objeto es un testimonio individual. */
  testimonials: z.array(
    z.object({
      quote: z.string(),
      authorName: z.string(),
      authorTitle: z.string(),
      // La imagen puede ser una URL completa o una ruta relativa local
      authorImage: z.string().url().or(z.string().startsWith("/")),
    })
  ),
});
// src/lib/validators/i18n/Testimonials.schema.ts
