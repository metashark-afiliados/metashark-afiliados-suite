// src/components/landing/SocialProof.tsx
/**
 * @file src/components/landing/SocialProof.tsx
 * @description Componente de presentación para la sección de "Prueba Social".
 *              Ha sido nivelado a un estándar de élite, eliminando la dependencia
 *              de activos locales, desacoplando su contenido y añadiendo
 *              microinteracciones y animaciones sutiles para una UX superior.
 * @author Raz Podestá
 * @version 2.0.0
 */
"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * @public
 * @interface LogoItem
 * @description Define el contrato de datos para un único logo.
 */
export interface LogoItem {
  name: string;
  src: string;
}

/**
 * @public
 * @interface SocialProofProps
 * @description Define el contrato de props para el componente `SocialProof`.
 */
export interface SocialProofProps {
  title: string;
  logos: LogoItem[];
}

/**
 * @public
 * @component SocialProof
 * @description Orquesta el renderizado de la sección de prueba social.
 * @param {SocialProofProps} props - Propiedades para configurar la sección.
 * @returns {React.ReactElement}
 */
export function SocialProof({
  title,
  logos,
}: SocialProofProps): React.ReactElement {
  const FADE_IN_VARIANTS = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section className="py-12 section-delimiter-top">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
        variants={FADE_IN_VARIANTS}
        className="container mx-auto px-4 md:px-6"
      >
        <h2 className="text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </h2>
        <div className="mx-auto mt-10 grid max-w-lg grid-cols-2 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-3 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
          {logos.map((logo) => (
            <motion.div
              key={logo.name}
              className="col-span-1"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <img
                className="max-h-12 w-full object-contain opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                src={logo.src}
                alt={logo.name}
                width={158}
                height={48}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Cero Activos Locales**: ((Implementada)) El componente ya no depende de imágenes en `public/`. Ahora recibe un array de `logos` a través de props, haciendo que la `HomePage` sea responsable de proveer las URLs (de placeholders o de un futuro CMS).
 * 2. **Componente Puro y Desacoplado**: ((Implementada)) Al recibir todo su contenido vía props, el componente se convierte en una pieza de "Lego" 100% reutilizable.
 * 3. **Microinteracciones de Élite**: ((Implementada)) Se ha añadido una animación `whileHover` de `framer-motion` y transiciones de CSS para `opacity` y `grayscale`. Esto añade "vida" y feedback visual, alineándose con la nueva directiva de diseño.
 * 4. **Animación de Entrada**: ((Implementada)) La sección completa ahora tiene una animación de `fade-in` al hacer scroll, mejorando el dinamismo de la página.
 * 5. **Delimitación de Sección**: ((Implementada)) Se ha añadido la clase `section-delimiter-top` para crear una separación visual sutil y profesional con la sección `Hero`, como se solicitó.
 *
 * @subsection Melhorias Futuras
 * 1. **Logos desde CMS**: ((Vigente)) La mejora de élite para este componente es que la `HomePage` obtenga el array de `logos` desde un CMS Headless, permitiendo al equipo de marketing actualizar la prueba social sin necesidad de un despliegue.
 *
 * =====================================================================
 */
// src/components/landing/SocialProof.tsx
