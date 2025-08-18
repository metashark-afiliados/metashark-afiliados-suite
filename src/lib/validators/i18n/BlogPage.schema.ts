// src/lib/validators/i18n/BlogPage.schema.ts
/**
 * @file BlogPage.schema.ts
 * @description Define el contrato de datos para el namespace 'BlogPage'.
 *              Sincronizado para reflejar la estructura anidada del contenido.
 * @author Raz Podestá
 * @version 2.0.0
 */
import { z } from "zod";

export const BlogPageSchema = z.object({
  hero: z.object({
    title: z.string(),
    subtitle: z.string(),
  }),
  searchPlaceholder: z.string(),
  allPostsTitle: z.string(),
  posts: z.array(
    z.object({
      slug: z.string(),
      title: z.string(),
      excerpt: z.string(),
      imageUrl: z.string(),
      category: z.string(),
      author: z.string(),
      date: z.string(),
    })
  ),
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Contrato**: ((Implementada)) El schema ahora refleja la estructura anidada real del archivo de mensajes, resolviendo el `IntlError`.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/BlogPage.schema.ts
