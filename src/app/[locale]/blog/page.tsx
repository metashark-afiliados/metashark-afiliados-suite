// src/app/[locale]/blog/page.tsx
/**
 * @file page.tsx
 * @description Orquestador de servidor para la página de Blog.
 * @author Raz Podestá
 * @version 1.0.0
 */
import React from "react";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import { BlogPageClient, type BlogPageData } from "./blog-page-client";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "pages.BlogPage" });
  return { title: t("hero.title") };
}

export default async function BlogPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("pages.BlogPage");

  const pageData: BlogPageData = {
    hero: {
      title: t("hero.title"),
      subtitle: t("hero.subtitle"),
    },
    searchPlaceholder: t("searchPlaceholder"),
    allPostsTitle: t("allPostsTitle"),
    posts: t.raw("posts"),
  };

  return <BlogPageClient data={pageData} />;
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Patrón Servidor-Cliente**: ((Implementada)) El Server Component es un orquestador de datos puro.
 * =====================================================================
 */
// src/app/[locale]/blog/page.tsx
