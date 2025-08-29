// src/lib/validators/i18n/BlogPage.schema.ts
/**
 * @file BlogPage.schema.ts
 * @description Define el contrato de datos para el namespace 'BlogPage'.
 *              Sincronizado holísticamente para incluir las nuevas claves de traducción
 *              `readMore`, `featuredPostTitle`, y `readFullStory`, completando el
 *              contrato de i18n para los componentes de blog.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
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
  // --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Nuevas claves de traducción ---
  readMore: z.string(),
  featuredPostTitle: z.string(),
  readFullStory: z.string(),
  // --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Contrato de i18n**: ((Implementada)) Se han añadido las nuevas claves `readMore`, `featuredPostTitle`, y `readFullStory` al esquema `BlogPageSchema`. Esto asegura que el contrato de datos de i18n esté completo y alineado con los requerimientos de `BlogPostCard.tsx` y `FeaturedPost.tsx`.
 * 2. **Integridad de Contrato**: ((Implementada)) El esquema ahora refleja con precisión el contrato de i18n de los componentes de blog.
 * 3. **Versionado Consistente**: ((Implementada)) Se ha incrementado la versión a `3.0.0` para reflejar este cambio significativo en la estructura del esquema.
 *
 * @subsection Melhorias Futuras
 * 1. **Validación de Placeholders**: ((Vigente)) Si `featuredPostTitle` o `readFullStory` fueran a incluir placeholders, se podría añadir `.describe("Placeholder: {...}")` para documentar la expectativa.
 *
 * =====================================================================
 */
