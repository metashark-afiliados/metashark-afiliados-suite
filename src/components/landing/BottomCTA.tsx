// src/components/landing/BottomCTA.tsx
/**
 * @file src/components/landing/BottomCTA.tsx
 * @description Componente de presentación de élite para la sección de Llamada a la Acción
 *              principal. Compone el aparato lógico `NewsletterForm` y recibe todo
 *              su contenido dinámicamente a través de props para una máxima
 *              flexibilidad e internacionalización.
 * @author Raz Podestá
 * @version 3.1.0
 */
"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

import { NewsletterForm, type NewsletterFormProps } from "./NewsletterForm";

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
 * @description Renderiza la sección de CTA inferior con un resumen de precios.
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
              {features.map((feature, index) => (
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

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Consistencia de Diseño**: ((Implementada)) Se pasa explícitamente el icono `ArrowRight` al `NewsletterForm`, asegurando que el diseño de este CTA coincida con el de la sección `Hero` y el diseño de referencia.
 * 2. **Contenido Dinámico de Features**: ((Implementada)) La lista de características (`features`) se recibe como prop, haciendo el componente más puro.
 * 3. **Composición Atómica (SRP)**: ((Implementada)) El componente delega la lógica del formulario al `NewsletterForm`, actuando como un orquestador de layout puro.
 *
 * @subsection Melhorias Futuras
 * 1. **Componente de Lista de Características (`Checklist.tsx`)**: ((Vigente)) La `<ul>` de características sigue siendo un patrón ideal para abstraer a su propio componente atómico y reutilizable.
 *
 * =====================================================================
 */
// src/components/landing/BottomCTA.tsx
