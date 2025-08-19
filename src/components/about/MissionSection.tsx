// src/components/about/MissionSection.tsx
/**
 * @file MissionSection.tsx
 * @description Componente de presentación puro para la sección de Misión.
 *              Es un Client Component que utiliza `framer-motion` para animaciones
 *              de entrada y es completamente agnóstico al contenido.
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

/**
 * @public
 * @component MissionSection
 * @description Renderiza la sección de la misión de la empresa con una
 *              animación de entrada al hacerse visible en el viewport.
 * @param {MissionSectionProps} props - Propiedades para configurar la sección.
 * @returns {React.ReactElement}
 */
export function MissionSection({
  title,
  content,
}: MissionSectionProps): React.ReactElement {
  const FADE_UP = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      variants={FADE_UP}
      className="py-16 text-center"
      aria-labelledby="mission-title"
    >
      <div className="inline-flex items-center gap-3 bg-muted px-4 py-2 rounded-full mb-4">
        <Target className="h-5 w-5 text-primary" />
        <h2 id="mission-title" className="text-2xl font-bold">
          {title}
        </h2>
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
 *
 * @subsection Melhorias Adicionadas
 * 1. **Accesibilidad (a11y)**: ((Implementada)) Se ha añadido `aria-labelledby` y un `id` al título (`<h2>`), mejorando la estructura semántica para los lectores de pantalla.
 * 2. **Componente Puro y Atómico**: ((Implementada)) El componente se mantiene puro, encapsulando únicamente la presentación de la sección de misión.
 *
 * @subsection Melhorias Futuras
 * 1. **Animaciones de Texto**: ((Vigente)) Se podría implementar una animación de entrada escalonada para cada párrafo del contenido, mejorando aún más el impacto visual.
 *
 * =====================================================================
 */
// src/components/about/MissionSection.tsx
