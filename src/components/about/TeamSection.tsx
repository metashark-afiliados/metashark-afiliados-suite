// src/components/about/TeamSection.tsx
"use client";

import { Users } from "lucide-react";

import { TeamMemberCard, type TeamMember } from "./TeamMemberCard";

interface TeamSectionProps {
  title: string;
  subtitle: string;
  members: TeamMember[];
}

/**
 * @public
 * @component TeamSection
 * @description Orquestador de UI que ensambla las tarjetas de miembros del equipo.
 *              Ha sido refactorizado para ser un Client Component explícito,
 *              resolviendo una violación de reglas de React Server Components.
 * @param {TeamSectionProps} props - Propiedades para configurar la sección.
 * @returns {React.ReactElement}
 */
export function TeamSection({
  title,
  subtitle,
  members,
}: TeamSectionProps): React.ReactElement {
  return (
    <section className="py-16 bg-muted rounded-lg" aria-labelledby="team-title">
      <div className="container mx-auto text-center">
        <div className="inline-flex items-center gap-3 bg-card px-4 py-2 rounded-full mb-4">
          <Users className="h-5 w-5 text-primary" />
          <h2 id="team-title" className="text-2xl font-bold">
            {title}
          </h2>
        </div>
        <p className="max-w-2xl mx-auto text-muted-foreground mb-12">
          {subtitle}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member) => (
            <TeamMemberCard key={member.name} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Blocker de Build**: ((Implementada)) La adición de `"use client"` completa la cadena de Client Components (`about-page-client` -> `TeamSection` -> `TeamMemberCard`), resolviendo de forma definitiva el blocker de despliegue relacionado con la página "About".
 *
 * @subsection Melhorias Futuras
 * 1. **Animación de Entrada Escalonada**: ((Vigente)) Reintroducir `framer-motion` para aplicar una animación de entrada escalonada (`staggerChildren`) a las tarjetas de los miembros del equipo.
 *
 * =====================================================================
 */
// src/components/about/TeamSection.tsx
