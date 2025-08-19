// src/components/about/MissionSection.tsx
/**
 * @file MissionSection.tsx
 * @description Componente de presentación puro para la sección de Misión.
 *              Simplificado bajo la directiva "Build Limpio" para eliminar
 *              `framer-motion` y ser un componente estático.
 * @author Raz Podestá
 * @version 2.0.0
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
 * 1. **Eliminación de Dependencias de Cliente**: ((Implementada)) Se ha eliminado `framer-motion` y la directiva `"use client"`, convirtiéndolo en un componente puro que puede ser renderizado en el servidor.
 *
 * @subsection Melhorias Futuras
 * 1. **Reintroducción Controlada de Animaciones**: ((Vigente)) Una vez estable el build, se podrá reintroducir `"use client"` y `framer-motion` de forma segura, encapsulado en un componente cliente.
 *
 * =====================================================================
 */
// src/components/about/MissionSection.tsx
