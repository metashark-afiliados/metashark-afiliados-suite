// src/components/about/MissionSection.tsx
/**
 * @file MissionSection.tsx
 * @description Componente de presentación puro para la sección de Misión.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import { motion } from "framer-motion";
import { Target } from "lucide-react";

interface MissionSectionProps {
  title: string;
  content: string[];
}

export function MissionSection({ title, content }: MissionSectionProps) {
  const FADE_UP = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      variants={FADE_UP}
      className="py-16 text-center"
    >
      <div className="inline-flex items-center gap-3 bg-muted px-4 py-2 rounded-full mb-4">
        <Target className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <div className="prose prose-invert max-w-3xl mx-auto text-lg text-muted-foreground">
        {content.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </motion.section>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Componente Puro y Atómico**: ((Implementada)) Encapsula la presentación de la sección de misión.
 * =====================================================================
 */
// src/components/about/MissionSection.tsx
