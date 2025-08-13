// src/lib/validators/i18n/Testimonials.schema.ts
/**
 * @file src/lib/validators/i18n/Testimonials.schema.ts
 * @description Define el contrato de datos atómico para el namespace 'Testimonials'.
 *              Valida la estructura completa de la sección de testimonios.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

/**
 * @public
 * @constant TestimonialsSchema
 * @description Define la estructura y los tipos de datos esperados para las
 *              traducciones de la sección de Testimonios, incluyendo un array
 *              de objetos de testimonios.
 */
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

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Contrato de Datos**: ((Implementada)) Se ha definido la estructura correcta para la clave `testimonials` como `z.array(z.object(...))`, alineando el schema con el archivo de mensajes.
 * 2. **Validación de Imagen**: ((Implementada)) El campo `authorImage` ahora valida que el valor sea una URL completa válida o una ruta relativa que comience con `/`, mejorando la integridad de los datos de activos.
 *
 * @subsection Melhorias Futuras
 * 1. **ID de Testimonio**: ((Vigente)) Añadir un `id` a cada objeto de testimonio para usarlo como `key` en React, lo cual es más robusto que usar el índice del array.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/Testimonials.schema.ts
