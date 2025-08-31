// src/lib/validators/i18n/FAQ.schema.ts
/**
 * @file FAQ.schema.ts
 * @description Define el contrato de datos atómico para el namespace 'FAQ'
 *              dentro de `landing.json`. Valida la estructura del contenido
 *              para la sección de Preguntas Frecuentes.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
import { z } from "zod";

export const FAQSchema = z.object({
  /** Etiqueta de la sección, ej. "FAQs". */
  tag: z.string(),
  /** Título principal de la sección. */
  title: z.string(),
  /** Subtítulo o descripción de la sección. */
  subtitle: z.string(),
  /** Array de objetos, donde cada objeto es una pregunta y su respuesta. */
  items: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    })
  ),
  /** Placeholder para el campo de búsqueda de preguntas. */
  searchPlaceholder: z.string(),
  /** Texto a mostrar cuando la búsqueda no devuelve resultados. */
  noResultsText: z.string(),
  /** Aria-label para el botón de limpiar la búsqueda. */
  clearSearchAriaLabel: z.string(),
});
// src/lib/validators/i18n/FAQ.schema.ts