// src/app/[locale]/blog/blog-page-client.tsx
/**
 * @file blog-page-client.tsx
 * @description Orquestador de cliente principal que ensambla las secciones de
 *              la página de Blog y maneja la lógica de búsqueda.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import { FeaturedPost } from "@/components/blog/FeaturedPost";
import { BlogPostCard, type Post } from "@/components/blog/BlogPostCard";
import { SearchInput } from "@/components/ui/SearchInput";
import { useDebounce } from "@/lib/hooks/use-debounce";

export interface BlogPageData {
  hero: {
    title: string;
    subtitle: string;
  };
  searchPlaceholder: string;
  allPostsTitle: string;
  posts: Post[];
}

export function BlogPageClient({ data }: { data: BlogPageData }) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const featuredPost = data.posts[0];
  const otherPosts = data.posts.slice(1);

  const filteredPosts = useMemo(() => {
    if (!debouncedSearchTerm) {
      return otherPosts;
    }
    return otherPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        post.excerpt
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()) ||
        post.category.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [debouncedSearchTerm, otherPosts]);

  const STAGGER_CONTAINER = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const FADE_UP = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <main className="container mx-auto max-w-6xl py-12 px-4 space-y-16">
      <motion.header
        initial="hidden"
        animate="show"
        variants={FADE_UP}
        className="text-center py-16"
      >
        <h1 className="text-5xl font-extrabold tracking-tighter text-primary">
          {data.hero.title}
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          {data.hero.subtitle}
        </p>
      </motion.header>

      {featuredPost && <FeaturedPost post={featuredPost} />}

      <section className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-3xl font-bold">{data.allPostsTitle}</h2>
          <div className="w-full md:w-auto md:max-w-xs">
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={data.searchPlaceholder}
              clearAriaLabel="Clear search"
            />
          </div>
        </div>

        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredPosts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </motion.div>
      </section>
    </main>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Lógica de Búsqueda del Lado del Cliente**: ((Implementada)) Usa `useDebounce` para una experiencia de búsqueda fluida y performante.
 * =====================================================================
 */
// src/app/[locale]/blog/blog-page-client.tsx
