// src/components/about/TeamSection.tsx
/**
 * @file TeamSection.tsx
 * @description Orquestador de UI que ensambla las tarjetas de miembros del equipo.
 *              Simplificado bajo la directiva "Build Limpio" para eliminar
 *              `framer-motion` y ser un componente estático.
 * @author Raz Podestá
 * @version 2.0.0
 */
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
 * @description Renderiza la sección del equipo.
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
 * 1. **Eliminación de Dependencias de Cliente**: ((Implementada)) Se ha eliminado `framer-motion` y la directiva `"use client"`.
 *
 * @subsection Melhorias Futuras
 * 1. **Reintroducción Controlada de Animaciones**: ((Vigente)) Reintroducir `"use client"` y `framer-motion` post-despliegue.
 *
 * =====================================================================
 */
// src/components/about/TeamSection.tsx
