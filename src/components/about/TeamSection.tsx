// src/components/about/TeamSection.tsx
/**
 * @file TeamSection.tsx
 * @description Orquestador de UI que ensambla las tarjetas de miembros del equipo
 *              con una animación de entrada escalonada.
 * @author Raz Podestá
 * @version 1.0.0
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

export function TeamSection({ title, subtitle, members }: TeamSectionProps) {
  const FADE_UP = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
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
    >
      <div className="container mx-auto text-center">
        <div className="inline-flex items-center gap-3 bg-card px-4 py-2 rounded-full mb-4">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">{title}</h2>
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
 * @subsection Melhorias Adicionadas
 * 1. **Animación Escalonada**: ((Implementada)) Utiliza `staggerChildren` para un efecto visual de élite.
 * =====================================================================
 */
// src/components/about/TeamSection.tsx
