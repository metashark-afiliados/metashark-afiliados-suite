// src/app/[locale]/about/about-page-client.tsx
/**
 * @file about-page-client.tsx
 * @description Orquestador de cliente que ensambla las secciones de la página
 *              "Sobre Nosotros". Este componente está marcado como `"use client"`
 *              y es el responsable de renderizar todos los componentes que
 *              utilizan `framer-motion` u otros hooks de cliente.
 * @author Raz Podestá
 * @version 2.0.0
 */
"use client";

import { motion } from "framer-motion";

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

/**
 * @public
 * @component AboutPageClient
 * @description Ensambla la UI interactiva y animada para la página "Sobre Nosotros".
 * @param {{ data: AboutPageData }} props - Los datos de la página obtenidos del Server Component.
 * @returns {React.ReactElement}
 */
export function AboutPageClient({
  data,
}: {
  data: AboutPageData;
}): React.ReactElement {
  return (
    <main className="container mx-auto max-w-5xl py-12 px-4 space-y-16">
      <header className="text-center py-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-extrabold tracking-tighter text-primary"
        >
          {data.hero.title}
        </motion.h1>
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
 *
 * @subsection Melhorias Adicionadas
 * 1. **Frontera Servidor-Cliente Clara**: ((Implementada)) La reintroducción de este componente con la directiva `"use client"` establece una frontera clara y correcta, resolviendo el error de manifiesto de cliente de `framer-motion`.
 *
 * @subsection Melhorias Futuras
 * 1. **Animaciones de Entrada Escalonadas**: ((Vigente)) Se podría envolver el `<main>` en un `<motion.div>` con `variants` para orquestar una animación de entrada escalonada para el `header`, `MissionSection` y `TeamSection`.
 *
 * =====================================================================
 */
// src/app/[locale]/about/about-page-client.tsx
