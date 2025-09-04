// src/components/landing/BottomCTA.tsx
/**
 * @file src/components/landing/BottomCTA.tsx
 * @description Componente de presentación para la sección de Llamada a la Acción
 *              principal. Ha sido refactorizado para aceptar y propagar
 *              props al `NewsletterForm`, alineándose con la arquitectura
 *              de componentes puros.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 3.2.0
 */
"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import React from "react";

import { clientLogger } from "@/lib/logger";
import { NewsletterForm } from "./NewsletterForm";

/**
 * @public
 * @interface BottomCTAProps
 * @description Define el contrato de props para el componente `BottomCTA`.
 */
export interface BottomCTAProps {
  title: string;
  subtitle: string;
  featuresTitle: string;
  features: string[];
  ctaPrimaryText: string;
  ctaPlaceholderText: string;
  pricingNote: string;
  guaranteeNote: string;
  creditCardNote: string;
}

/**
 * @public
 * @component BottomCTA
 * @description Renderiza la sección de CTA inferior con un resumen de beneficios.
 * @param {BottomCTAProps} props - Propiedades para configurar la sección.
 * @returns {React.ReactElement}
 */
export function BottomCTA({
  title,
  subtitle,
  featuresTitle,
  features,
  ctaPrimaryText,
  ctaPlaceholderText,
  pricingNote,
  guaranteeNote,
  creditCardNote,
}: BottomCTAProps): React.ReactElement {
  clientLogger.trace(
    "[BottomCTA] Renderizando componente de presentación puro."
  );

  const FADE_UP_VARIANTS = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section id="pricing" className="py-20 bg-muted">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
        variants={FADE_UP_VARIANTS}
        className="container mx-auto max-w-5xl rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-8 shadow-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col space-y-4">
            <h2 className="text-3xl font-bold">{title}</h2>
            <p className="text-muted-foreground">{subtitle}</p>
            <NewsletterForm
              ctaText={ctaPrimaryText}
              placeholderText={ctaPlaceholderText}
              ctaIcon={ArrowRight}
            />
            <div className="text-sm text-muted-foreground">
              <span className="mr-4">{creditCardNote}</span>
              <span>{guaranteeNote}</span>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6">
            <h3 className="text-lg font-semibold">{featuresTitle}</h3>
            <ul className="mt-4 space-y-2">
              {(features || []).map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-sm">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 text-center">
              <span className="text-2xl font-bold">{pricingNote}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
// src/components/landing/BottomCTA.tsx
