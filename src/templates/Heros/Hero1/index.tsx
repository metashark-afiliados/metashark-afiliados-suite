// src/templates/Heros/Hero1/index.tsx
/**
 * @file index.tsx
 * @description Componente de bloque de plantilla para una sección "Hero" principal.
 *              Es un componente de presentación puro.
 * @author Raz Podestá
 * @version 1.0.0
 */
import React from "react";

export interface Hero1Props {
  title: string;
  subtitle: string;
}

export function Hero1({ title, subtitle }: Hero1Props): React.ReactElement {
  return (
    <section
      className="text-center py-20 bg-gray-100 font-sans text-gray-800"
      data-lia-marker="Hero1"
    >
      <h1 className="text-4xl font-bold">{title}</h1>
      <p className="text-xl mt-4 text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
    </section>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Componente de Bloque Funcional**: ((Implementada)) Se migra el segundo componente de bloque real.
 * 2. **Observabilidad en Desarrollo**: ((Implementada)) Se ha añadido el atributo `data-lia-marker`.
 *
 * @subsection Melhorias Futuras
 * 1. **Botón de CTA**: ((Vigente)) Extender `Hero1Props` para incluir props para un botón de llamada a la acción (`ctaText`, `ctaHref`), una característica esencial para cualquier sección Hero.
 * 2. **Imagen de Fondo**: ((Vigente)) Añadir una prop `backgroundImageUrl` para permitir la personalización del fondo de la sección.
 *
 * =====================================================================
 */
// src/templates/Heros/Hero1/index.tsx
