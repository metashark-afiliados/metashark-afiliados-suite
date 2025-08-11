// src/components/landing/Hero.tsx
/**
 * @file src/components/landing/Hero.tsx
 * @description Componente de presentación puro para la sección "Hero" de la landing page.
 *              Es 100% agnóstico al contenido, recibiendo todos sus textos y datos de
 *              llamada a la acción (CTA) a través de su contrato de props. Esto garantiza
 *              una completa internacionalización y reutilización. Utiliza `framer-motion`
 *              para animaciones de entrada sutiles y de alto rendimiento.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";

/**
 * @public
 * @interface HeroProps
 * @description Define el contrato de props para el componente Hero.
 */
export interface HeroProps {
  /** El titular principal que se mostrará en la sección. */
  title: string;
  /** El texto secundario o eslogan debajo del titular. */
  subtitle: string;
  /** El texto para el botón de llamada a la acción principal (ej. "Empezar Ahora"). */
  ctaPrimaryText: string;
  /** El texto para el botón de llamada a la acción secundario (ej. "Ver Características"). */
  ctaSecondaryText: string;
}

/**
 * @public
 * @component Hero
 * @description Renderiza la sección principal de bienvenida de la landing page.
 * @param {HeroProps} props - Propiedades para configurar la sección Hero.
 * @returns {React.ReactElement}
 */
export function Hero({
  title,
  subtitle,
  ctaPrimaryText,
  ctaSecondaryText,
}: HeroProps) {
  const FADE_IN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } },
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
          <Button size="lg" asChild>
            <Link href="/auth/login">
              {ctaPrimaryText} <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
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
 * @subsection Melhorias Futuras
 * 1. **Botões de CTA Dinâmicos**: ((Vigente)) Adicionar uma prop opcional `ctaButtons` (um array de objetos com `text`, `href` e `variant`) para permitir a total customização dos botões de Call to Action a partir do componente pai (`HomePage`).
 * 2. **Vídeo de Fundo**: ((Vigente)) Adicionar suporte para uma prop `backgroundVideoUrl` que renderizaria um vídeo em loop como fundo da seção Hero, com sobreposição para garantir a legibilidade do texto.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Componente Puro e Internacionalizável**: ((Implementada)) O componente é 100% agnóstico ao conteúdo, recebendo todos os seus textos via props, o que o torna totalmente traduzível e reutilizável. É uma dependência chave para a `HomePage`.
 * 2. **Animações de Alto Desempenho**: ((Implementada)) A utilização de `framer-motion` para animações de entrada garante uma experiência de usuário fluida e moderna sem comprometer o desempenho.
 *
 * =====================================================================
 */
// src/components/landing/Hero.tsx
