// src/components/about/MissionSection.tsx
/**
 * @file MissionSection.tsx
 * @description Componente de presentación puro para la sección de la misión. Al no
 *              utilizar hooks de cliente, se renderiza como un Server Component por
 *              defecto, optimizando el rendimiento.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { Target } from "lucide-react";

interface MissionSectionProps {
  title: string;
  content: string[];
}

/**
 * @public
 * @component MissionSection
 * @description Renderiza la sección de la misión de la empresa.
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
 * 1. **Alineación con Arquitectura RSC**: ((Implementada)) Se ha eliminado la directiva `"use client"` innecesaria. El componente ahora es un Server Component puro por defecto, adhiriéndose a las mejores prácticas de Next.js para un rendimiento óptimo.
 *
 * @subsection Melhorias Futuras
 * 1. **Animación Delegada**: ((Vigente)) Para añadir animaciones, este componente debería ser importado y envuelto en un tag `<motion.div>` dentro de su componente padre de cliente (`about-page-client.tsx`), manteniendo este aparato puro y desacoplado de la lógica de animación.
 *
 * =====================================================================
 */
// src/components/about/MissionSection.tsx
