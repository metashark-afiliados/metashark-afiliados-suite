// src/app/[locale]/about/page.tsx
/**
 * @file page.tsx
 * @description Orquestador y ensamblador de la página "Sobre Nosotros".
 *              Ha sido refactorizado bajo la directiva "Build Limpio" para
 *              eliminar todas las dependencias de `framer-motion` y el wrapper
 *              de cliente, con el objetivo de resolver el blocker de despliegue.
 * @author Raz Podestá
 * @version 5.0.0
 */
import React from "react";
import type { Metadata } from "next";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { MissionSection } from "@/components/about/MissionSection";
import { TeamSection } from "@/components/about/TeamSection";
import { type TeamMember } from "@/components/about/TeamMemberCard";
import { logger } from "@/lib/logging";

interface AboutPageData {
  hero: {
    title: string;
  };
  mission: {
    title: string;
    content: string[];
  };
  team: {
    title: string;
    subtitle: string;
    members: TeamMember[];
  };
}

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
  logger.trace(`[AboutPage] Renderizando página para el locale: ${locale}`);
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

  return (
    <main className="container mx-auto max-w-5xl py-12 px-4 space-y-16">
      <header className="text-center py-16">
        <h1 className="text-5xl font-extrabold tracking-tighter text-primary">
          {pageData.hero.title}
        </h1>
      </header>
      <MissionSection {...pageData.mission} />
      <TeamSection {...pageData.team} />
    </main>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Simplificación Radical**: ((Implementada)) Se ha eliminado la dependencia de `framer-motion` y el wrapper de cliente. El componente es ahora un Server Component puro que ensambla otros componentes puros, eliminando la causa sospechosa del fallo de build.
 *
 * @subsection Melhorias Futuras
 * 1. **Reintroducción Controlada de Animaciones**: ((Vigente)) Una vez que el despliegue sea estable, se podrá reintroducir `framer-motion` de forma controlada, asegurando que todos los componentes animados estén correctamente encapsulados en un Client Component.
 *
 * =====================================================================
 */
// src/app/[locale]/about/page.tsx
