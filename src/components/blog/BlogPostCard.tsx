// src/components/blog/BlogPostCard.tsx
/**
 * @file BlogPostCard.tsx
 * @description Componente de presentación atómico para una tarjeta de artículo de blog.
 *              Ha sido refactorizado holísticamente para consumir sus textos visibles
 *              desde la capa de internacionalización, cumpliendo con el protocolo
 *              `Full Internacionalización`.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl"; // <-- Añadido useTranslations

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
  const t = useTranslations("pages.BlogPage"); // <-- Consumir namespace de BlogPage

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
            {t("readMore")} {/* <-- Texto internacionalizado */}
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
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Full Internacionalización (Textos)**: ((Implementada)) El texto "Read More" ha sido reemplazado por `t("readMore")`, consumiendo una clave de traducción desde el namespace `pages.BlogPage`. Esto resuelve la brecha de textos hardcodeados.
 * 2. **Componente Puro y Atómico**: ((Implementada)) El componente mantiene su responsabilidad única de presentar un artículo del blog, ahora con soporte completo para i18n.
 *
 * @subsection Melhorias Futuras
 * 1. **Hover Effect en Imagen**: ((Vigente)) Añadir un efecto de zoom sutil a la imagen al pasar el cursor, similar al que ya se aplica en `FeaturedPost.tsx`.
 *
 * =====================================================================
 */
