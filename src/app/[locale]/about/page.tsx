// src/app/[locale]/about/page.tsx
/**
 * @file page.tsx
 * @description Orquestador de servidor para la página "Sobre Nosotros".
 *              Obtiene todo el contenido estructurado de la capa de i18n y
 *              lo pasa al componente de cliente para su renderizado.
 * @author Raz Podestá
 * @version 2.0.0
 */
import React from "react";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import { AboutPageClient, type AboutPageData } from "./about-page-client";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "pages.AboutPage" });
  return { title: t("hero.title") };
}

export default async function AboutPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("pages.AboutPage");

  const pageData: AboutPageData = {
    hero: {
      title: t("hero.title"),
    },
    mission: {
      title: t("mission.title"),
      content: t.raw("mission.content"),
    },
    team: {
      title: t("team.title"),
      subtitle: t("team.subtitle"),
      members: t.raw("team.members"),
    },
  };

  return <AboutPageClient data={pageData} />;
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Patrón Servidor-Cliente**: ((Implementada)) El Server Component es ahora un orquestador de datos puro.
 * =====================================================================
 */
// src/app/[locale]/about/page.tsx
