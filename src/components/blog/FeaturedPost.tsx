// src/components/blog/FeaturedPost.tsx
/**
 * @file FeaturedPost.tsx
 * @description Componente de presentación puro para el artículo destacado del blog.
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
import { ArrowRight, Megaphone } from "lucide-react";
import { useTranslations } from "next-intl"; // <-- Añadido useTranslations

import { type Post } from "./BlogPostCard";
import { Badge } from "@/components/ui/badge";

export function FeaturedPost({ post }: { post: Post }) {
  const t = useTranslations("pages.BlogPage"); // <-- Consumir namespace de BlogPage

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
    >
      <Link
        href={`/blog/${post.slug}`}
        className="block relative aspect-video rounded-lg overflow-hidden"
      >
        <Image
          src={post.imageUrl}
          alt={`Imagen para el artículo "${post.title}"`}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      </Link>
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Megaphone className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-primary">
            {t("featuredPostTitle")} {/* <-- Texto internacionalizado */}
          </h3>
        </div>
        <Badge variant="secondary" className="mb-2">
          {post.category}
        </Badge>
        <h2 className="text-3xl font-extrabold tracking-tight mb-4">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>
        <p className="text-muted-foreground mb-6">{post.excerpt}</p>
        <div className="text-sm text-muted-foreground mb-6">
          <span>{post.author}</span> &middot; <span>{post.date}</span>
        </div>
        <Link
          href={`/blog/${post.slug}`}
          className="text-primary font-semibold inline-flex items-center group"
        >
          {t("readFullStory")} {/* <-- Texto internacionalizado */}
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.section>
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
 * 1. **Full Internacionalización (Textos)**: ((Implementada)) Los textos "Featured Post" y "Read Full Story" han sido reemplazados por `t("featuredPostTitle")` y `t("readFullStory")`, consumiendo claves de traducción desde el namespace `pages.BlogPage`. Esto resuelve la brecha de textos hardcodeados.
 * 2. **Componente Puro y Atómico**: ((Implementada)) El componente mantiene su responsabilidad única de presentar el artículo destacado, ahora con soporte completo para i18n.
 *
 * @subsection Melhorias Futuras
 * 1. **Dinámica de Megaphone Icon**: ((Vigente)) El icono `Megaphone` es estático. Podría ser un `DynamicIcon` con un nombre configurable desde el `BlogPage.json`.
 *
 * =====================================================================
 */
