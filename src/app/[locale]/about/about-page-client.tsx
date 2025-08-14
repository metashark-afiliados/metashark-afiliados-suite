// src/app/[locale]/about/about-page-client.tsx
/**
 * @file about-page-client.tsx
 * @description Orquestador de cliente principal que ensambla las secciones de
 *              la página "Sobre Nosotros".
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import { MissionSection } from "@/components/about/MissionSection";
import { TeamSection } from "@/components/about/TeamSection";
import { type TeamMember } from "@/components/about/TeamMemberCard";

export interface AboutPageData {
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

export function AboutPageClient({ data }: { data: AboutPageData }) {
  return (
    <main className="container mx-auto max-w-5xl py-12 px-4 space-y-16">
      <header className="text-center py-16">
        <h1 className="text-5xl font-extrabold tracking-tighter text-primary">
          {data.hero.title}
        </h1>
      </header>
      <MissionSection {...data.mission} />
      <TeamSection {...data.team} />
    </main>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Ensamblaje Puro**: ((Implementada)) Componente de cliente que solo ensambla, sin lógica de negocio.
 * =====================================================================
 */
// src/app/[locale]/about/about-page-client.tsx
