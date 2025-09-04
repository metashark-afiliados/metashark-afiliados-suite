// src/lib/validators/i18n/BlogPage.schema.ts
/**
 * @file BlogPage.schema.ts
 * @description Define el contrato de datos para el namespace 'pages.BlogPage'.
 *              Sincronizado con la Directiva 3.4 (IMAS), validando el array `posts`
 *              como un objeto con claves numéricas.
 * @author L.I.A Legacy
 * @version 4.0.0
 */
import { z } from "zod";

/**
 * @private
 * @constant PostSchema
 * @description Define el contrato de datos para un único artículo del blog.
 */
const PostSchema = z.object({
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  imageUrl: z.string().url(),
  category: z.string(),
  author: z.string(),
  date: z.string(),
});

/**
 * @public
 * @constant BlogPageSchema
 * @description El schema Zod que valida la estructura completa del archivo de
 *              mensajes para la página del Blog.
 */
export const BlogPageSchema = z.object({
  hero: z.object({
    title: z.string(),
    subtitle: z.string(),
  }),
  searchPlaceholder: z.string(),
  allPostsTitle: z.string(),
  // Validación de array de posts como un record (objeto)
  posts: z.record(PostSchema),
  readMore: z.string(),
  featuredPostTitle: z.string(),
  readFullStory: z.string(),
});
// src/lib/validators/i18n/BlogPage.schema.ts
