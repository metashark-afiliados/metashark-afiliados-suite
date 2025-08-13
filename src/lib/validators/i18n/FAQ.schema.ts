// src/lib/validators/i18n/FAQ.schema.ts
/**
 * @file src/lib/validators/i18n/FAQ.schema.ts
 * @description Define el contrato de datos atómico para el namespace 'FAQ'.
 *              Este schema valida la estructura del contenido para la sección de
 *              Preguntas Frecuentes, incluyendo el array de preguntas y respuestas.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

/**
 * @public
 * @constant FAQSchema
 * @description Define la estructura y los tipos de datos esperados para las
 *              traducciones relacionadas con la sección de Preguntas Frecuentes.
 */
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

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Completitud de Contrato**: ((Implementada)) Se ha creado este schema que faltaba, avanzando en la reconstrucción del contrato de i18n.
 * 2. **Atomicidad (IMAS)**: ((Implementada)) El schema está aislado y se adhiere a la arquitectura IMAS.
 *
 * @subsection Melhorias Futuras
 * 1. **Soporte para Respuestas Enriquecidas**: ((Vigente)) El campo `answer` podría ser de tipo `z.union([z.string(), z.array(z.string())])` para permitir respuestas con múltiples párrafos o listas.
 * 2. **Validación de Array No Vacío**: ((Vigente)) Se podría añadir `.nonempty()` al schema de `items` para asegurar que siempre haya al menos una pregunta frecuente definida.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/FAQ.schema.ts
