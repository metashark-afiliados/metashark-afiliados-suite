// src/components/landing/Hero.tsx
/**
 * @file src/components/landing/Hero.tsx
 * @description Componente de presentación puro para la sección "Hero" de la landing page.
 *              Ha sido nivelado para incluir observabilidad en las interacciones
 *              de los botones de llamada a la acción (CTA) y alineado con la
 *              directiva de rebranding de "ConvertiKit".
 * @author Raz Podestá
 * @version 2.0.0
 */
"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { clientLogger } from "@/lib/logging";
import { Link } from "@/lib/navigation";

export interface HeroProps {
  title: string;
  subtitle: string;
  ctaPrimaryText: string;
  ctaSecondaryText: string;
}

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
            <Link href="/auth/login">
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

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Full Observabilidad**: ((Implementada)) Se ha añadido un `onClick` handler a los botones CTA que invoca a `clientLogger.info`. Esto proporciona visibilidad sobre la interacción más importante de la landing page.
 * 2. **Rebranding**: ((Implementada)) La autoría y los comentarios han sido actualizados a "Raz Podestá" y "ConvertiKit".
 *
 * @subsection Melhorias Futuras
 * 1. **Botones de CTA Dinámicos**: ((Vigente)) La prop `ctaButtons` (un array de objetos) sigue siendo la mejora de élite para una máxima flexibilidad.
 *
 * =====================================================================
 */
// src/components/landing/Hero.tsx
