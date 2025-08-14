// src/components/blog/FeaturedPost.tsx
/**
 * @file FeaturedPost.tsx
 * @description Componente de presentación puro para el artículo destacado del blog.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Megaphone } from "lucide-react";

import { type Post } from "./BlogPostCard";
import { Badge } from "@/components/ui/badge";

export function FeaturedPost({ post }: { post: Post }) {
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
          <h3 className="font-semibold text-primary">Featured Post</h3>
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
          Read Full Story
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.section>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Componente Puro y Atómico**: ((Implementada)) Encapsula la presentación del artículo destacado.
 * =====================================================================
 */
// src/components/blog/FeaturedPost.tsx
