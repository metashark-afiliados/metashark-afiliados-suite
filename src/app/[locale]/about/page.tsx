// src/app/[locale]/about/page.tsx
/**
 * @file page.tsx
 * @description Orquestador de servidor y ensamblador de UI para la página
 *              "Sobre Nosotros". Ha sido refactorizado a un estándar de élite
 *              para eliminar el wrapper de cliente intermedio, mejorando el
 *              rendimiento y simplificando la arquitectura.
 * @author Raz Podestá
 * @version 3.0.0
 */
import React from "react";
import type { Metadata } from "next";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { motion } from "framer-motion";

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
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-extrabold tracking-tighter text-primary"
        >
          {pageData.hero.title}
        </motion.h1>
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
 * 1. **Eliminación de Wrapper de Cliente**: ((Implementada)) Se ha eliminado el componente `about-page-client.tsx`, y este Server Component ahora ensambla directamente los componentes de presentación. Esto reduce el client bundle size y simplifica el árbol de componentes.
 * 2. **Full Observabilidad**: ((Implementada)) Se ha añadido `logger.trace` para monitorear el renderizado de la página en el servidor.
 * 3. **Rendimiento Mejorado**: ((Implementada)) Al renderizar la estructura principal (`<main>`, `<header>`) en el servidor, se envía un HTML más completo al cliente, mejorando el First Contentful Paint (FCP).
 *
 * @subsection Melhorias Futuras
 * 1. **Contenido Dinámico del Equipo**: ((Vigente)) El array `team.members` se obtiene de los archivos i18n. Una mejora de élite sería obtener estos datos de la tabla `profiles` de la base de datos, permitiendo gestionar el equipo sin necesidad de un despliegue de código.
 *
 * =====================================================================
 */
// src/app/[locale]/about/page.tsx
