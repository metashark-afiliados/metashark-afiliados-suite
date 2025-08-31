// src/components/landing/Hero.tsx
/**
 * @file src/components/landing/Hero.tsx
 * @description Componente de presentación puro para la sección "Hero".
 *              Ha sido refactorizado para ser 100% agnóstico al contenido,
 *              recibiendo todos sus textos a través de props desde el
 *              orquestador de servidor.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 3.0.0
 */
"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { clientLogger } from "@/lib/logging";
import { Link } from "@/lib/navigation";

/**
 * @public
 * @interface HeroProps
 * @description Define el contrato de props para el componente de presentación Hero.
 */
export interface HeroProps {
  title: string;
  subtitle: string;
  ctaPrimaryText: string;
  ctaSecondaryText: string;
}

/**
 * @public
 * @component Hero
 * @description Renderiza la sección "Hero" de la landing page. Es un componente de
 *              presentación puro que recibe todo su contenido como props.
 * @param {HeroProps} props - Propiedades para configurar el componente.
 * @returns {React.ReactElement}
 */
export function Hero({
  title,
  subtitle,
  ctaPrimaryText,
  ctaSecondaryText,
}: HeroProps): React.ReactElement {
  const FADE_IN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } },
  };

  const handleCTAClick = (ctaName: string) => {
    clientLogger.info(`[Hero] CTA Clicked: ${ctaName}`);
  };

  return (
    <section className="relative w-full overflow-hidden py-20 md:py-32">
      <motion.div
        initial="hidden"
        animate="show"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.15, delayChildren: 0.5 } },
        }}
        className="container mx-auto flex flex-col items-center px-4 text-center md:px-6"
      >
        <motion.h1
          variants={FADE_IN_ANIMATION_VARIANTS}
          className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl"
        >
          {title}
        </motion.h1>
        <motion.p
          variants={FADE_IN_ANIMATION_VARIANTS}
          className="mx-auto mt-6 max-w-[700px] text-muted-foreground md:text-xl"
        >
          {subtitle}
        </motion.p>
        <motion.div
          variants={FADE_IN_ANIMATION_VARIANTS}
          className="mt-8 flex flex-col justify-center gap-4 sm:flex-row"
        >
          <Button asChild size="lg" onClick={() => handleCTAClick("Primary")}>
            <Link href="/login">
              {ctaPrimaryText} <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            onClick={() => handleCTAClick("Secondary")}
          >
            <a href="#features">{ctaSecondaryText}</a>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
// src/components/landing/Hero.tsx
