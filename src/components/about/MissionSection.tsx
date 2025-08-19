// src/components/about/MissionSection.tsx
"use client";

import { Target } from "lucide-react";

interface MissionSectionProps {
  title: string;
  content: string[];
}

/**
 * @public
 * @component MissionSection
 * @description Renderiza la sección de la misión de la empresa. Ha sido refactorizado
 *              para ser un Client Component explícito, resolviendo una violación de
 *              reglas de React Server Components que impedía el build.
 * @param {MissionSectionProps} props - Propiedades para configurar la sección.
 * @returns {React.ReactElement}
 */
export function MissionSection({
  title,
  content,
}: MissionSectionProps): React.ReactElement {
  return (
    <section className="py-16 text-center" aria-labelledby="mission-title">
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
    </section>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Blocker de Build**: ((Implementada)) Se ha añadido la directiva `"use client"`, declarando explícitamente este aparato como un Client Component. Esto resuelve la violación de reglas de RSC, ya que ahora puede ser importado y renderizado legalmente por su padre, `about-page-client.tsx`.
 *
 * @subsection Melhorias Futuras
 * 1. **Animación de Entrada**: ((Vigente)) Reintroducir `framer-motion` para animar la entrada de esta sección cuando se haga visible en el viewport, mejorando el dinamismo de la página.
 *
 * =====================================================================
 */
// src/components/about/MissionSection.tsx
