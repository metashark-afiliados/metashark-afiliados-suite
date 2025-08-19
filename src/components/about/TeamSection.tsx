// src/components/about/TeamSection.tsx
/**
 * @file TeamSection.tsx
 * @description Orquestador de UI que ensambla las tarjetas de miembros del equipo
 *              con una animación de entrada escalonada. Es un Client Component
 *              que consume el componente atómico `TeamMemberCard`.
 * @author Raz Podestá
 * @version 1.1.0
 */
"use client";

import { motion } from "framer-motion";
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
 * @description Renderiza la sección del equipo, orquestando la animación
 *              escalonada de las tarjetas de los miembros.
 * @param {TeamSectionProps} props - Propiedades para configurar la sección.
 * @returns {React.ReactElement}
 */
export function TeamSection({
  title,
  subtitle,
  members,
}: TeamSectionProps): React.ReactElement {
  const FADE_UP = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const STAGGER_CONTAINER = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={FADE_UP}
      className="py-16 bg-muted rounded-lg"
      aria-labelledby="team-title"
    >
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
        <motion.div
          variants={STAGGER_CONTAINER}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {members.map((member) => (
            <TeamMemberCard
              key={member.name}
              member={member}
              animationVariants={FADE_UP}
            />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Accesibilidad (a11y)**: ((Implementada)) Se ha añadido `aria-labelledby` y un `id` al título (`<h2>`), mejorando la estructura semántica.
 * 2. **Animación Escalonada**: ((Implementada)) El componente utiliza `staggerChildren` para un efecto visual de élite, mejorando la experiencia de usuario.
 *
 * @subsection Melhorias Futuras
 * 1. **Ordenamiento Dinámico**: ((Vigente)) Añadir controles (ej. botones) que permitan al usuario ordenar la lista de miembros del equipo por nombre o rol, manipulando el array `members` antes de pasarlo al `.map()`.
 *
 * =====================================================================
 */
// src/components/about/TeamSection.tsx
