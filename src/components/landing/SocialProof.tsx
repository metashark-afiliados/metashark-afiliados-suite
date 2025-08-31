// src/components/landing/SocialProof.tsx
/**
 * @file src/components/landing/SocialProof.tsx
 * @description Componente de presentación para la sección de "Prueba Social".
 *              Ha sido nivelado a un estándar de élite para ser 100% puro,
 *              desacoplado de activos locales, y enriquecido con microinteracciones
 *              y animaciones para una UX superior.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 2.1.0
 */
"use client";

import React from "react";
import { motion } from "framer-motion";
import { clientLogger } from "@/lib/logging";

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
  clientLogger.trace(
    "[SocialProof] Renderizando componente de presentación puro."
  );

  const FADE_IN_VARIANTS = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section className="py-12">
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
          {(logos || []).map((logo) => (
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
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
// src/components/landing/SocialProof.tsx
