// src/app/[locale]/about/page.tsx
/**
 * @file page.tsx
 * @description Orquestador de servidor para la página "Sobre Nosotros".
 *              Ha sido refactorizado a su arquitectura canónica, donde su única
 *              responsabilidad es obtener los datos de i18n y pasarlos como
 *              props al componente de cliente (`AboutPageClient`), que manejará
 *              el renderizado y las animaciones.
 * @author Raz Podestá
 * @version 4.0.0
 */
import React from "react";
import type { Metadata } from "next";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { type TeamMember } from "@/components/about/TeamMemberCard";
import { logger } from "@/lib/logging";

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
  logger.trace(`[AboutPage] Obteniendo datos para el locale: ${locale}`);
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
 *
 * @subsection Melhorias Adicionadas
 * 1. **Restauración de Arquitectura RSC**: ((Implementada)) El componente vuelve a ser un orquestador de datos puro, cumpliendo con las reglas de los Server Components y resolviendo la causa raíz del fallo de build.
 *
 * @subsection Melhorias Futuras
 * 1. **Contenido Dinámico del Equipo**: ((Vigente)) Obtener los `team.members` desde la base de datos sigue siendo la mejora de élite para este aparato.
 *
 * =====================================================================
 */
// src/app/[locale]/about/page.tsx
