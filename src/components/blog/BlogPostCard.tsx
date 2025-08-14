// src/components/blog/BlogPostCard.tsx
/**
 * @file BlogPostCard.tsx
 * @description Componente de presentación atómico para una tarjeta de artículo de blog.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import Image from "next/image";
import Link from "next/link"; // Usar Link de Next.js para rutas internas
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  author: string;
  date: string;
}

export function BlogPostCard({ post }: { post: Post }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="h-full overflow-hidden rounded-lg"
    >
      <Card className="h-full flex flex-col">
        <CardHeader className="p-0">
          <Link
            href={`/blog/${post.slug}`}
            className="block aspect-video relative"
          >
            <Image
              src={post.imageUrl}
              alt={`Imagen para el artículo "${post.title}"`}
              fill
              className="object-cover"
            />
          </Link>
        </CardHeader>
        <CardContent className="p-6 flex flex-col flex-grow">
          <Badge variant="secondary" className="mb-2 w-fit">
            {post.category}
          </Badge>
          <h3 className="text-xl font-bold mb-2">
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </h3>
          <p className="text-muted-foreground flex-grow">{post.excerpt}</p>
          <div className="text-sm text-muted-foreground mt-4">
            <span>{post.author}</span> &middot; <span>{post.date}</span>
          </div>
          <Link
            href={`/blog/${post.slug}`}
            className="text-primary font-semibold mt-4 inline-flex items-center group"
          >
            Read More
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Componente Puro y Atómico**: ((Implementada)) Encapsula la presentación de un artículo.
 * @subsection Melhorias Futuras
 * 1. **Hover Effect**: ((Vigente)) Añadir un efecto de zoom sutil a la imagen al pasar el cursor.
 * =====================================================================
 */
// src/components/blog/BlogPostCard.tsx
