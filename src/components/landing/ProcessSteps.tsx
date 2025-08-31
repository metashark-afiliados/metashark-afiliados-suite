// src/components/landing/ProcessSteps.tsx
/**
 * @file src/components/landing/ProcessSteps.tsx
 * @description Componente de presentación para la sección "Pasos del Proceso".
 *              Es un componente de cliente puro, animado y completamente
 *              agnóstico al contenido, que recibe sus datos vía props.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 2.0.0
 */
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { clientLogger } from "@/lib/logging";

/**
 * @public
 * @interface Step
 * @description Define el contrato de datos para un único paso en el proceso.
 */
export interface Step {
  stepNumber: string;
  iconName: string;
  title: string;
  description: string;
  checklist: string[];
}

/**
 * @public
 * @interface ProcessStepsProps
 * @description Define el contrato de props para el componente `ProcessSteps`.
 */
export interface ProcessStepsProps {
  tag: string;
  title: string;
  description: string;
  steps: Step[];
}

/**
 * @private
 * @component StepCard
 * @description Renderiza una tarjeta para un único paso del proceso.
 * @param {object} props - Propiedades del sub-componente.
 * @returns {React.ReactElement}
 */
const StepCard = ({
  step,
  index,
}: {
  step: Step;
  index: number;
}): React.ReactElement => {
  const isEven = index % 2 === 0;
  const FADE_IN_VARIANTS = {
    hidden: { opacity: 0, x: isEven ? 50 : -50 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const textContent = (
    <div className="flex-1">
      <div className="inline-flex items-center gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
          {step.stepNumber}
        </span>
        <h3 className="text-2xl font-bold">{step.title}</h3>
      </div>
      <p className="mt-4 text-muted-foreground">{step.description}</p>
      <ul className="mt-6 space-y-3">
        {(step.checklist || []).map((item, itemIndex) => (
          <li key={itemIndex} className="flex items-start gap-3">
            <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const imageContent = (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="flex h-48 w-full items-center justify-center rounded-xl bg-muted shadow-inner">
        <DynamicIcon
          name={step.iconName}
          className="h-16 w-16 text-muted-foreground"
        />
      </div>
    </div>
  );

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      variants={FADE_IN_VARIANTS}
      className={`flex flex-col gap-8 md:flex-row md:items-center ${
        isEven ? "" : "md:flex-row-reverse"
      }`}
    >
      {textContent}
      {imageContent}
    </motion.div>
  );
};

/**
 * @public
 * @component ProcessSteps
 * @description Orquesta el renderizado de la sección completa del proceso.
 * @param {ProcessStepsProps} props - Propiedades para configurar la sección.
 * @returns {React.ReactElement}
 */
export function ProcessSteps({
  tag,
  title,
  description,
  steps,
}: ProcessStepsProps): React.ReactElement {
  clientLogger.trace(
    "[ProcessSteps] Renderizando componente de presentación puro."
  );

  return (
    <section id="process" className="py-20">
      <div className="container mx-auto flex flex-col items-center gap-4 px-4 text-center md:px-6">
        <span className="rounded-full bg-secondary/10 px-3 py-1 text-sm font-medium text-secondary">
          {tag}
        </span>
        <h2 className="text-3xl font-bold">{title}</h2>
        <p className="max-w-2xl text-muted-foreground">{description}</p>
      </div>

      <div className="container mx-auto mt-16 flex flex-col gap-16 px-4 md:px-6">
        {(steps || []).map((step, index) => (
          <StepCard key={step.stepNumber} step={step} index={index} />
        ))}
      </div>
    </section>
  );
}
// src/components/landing/ProcessSteps.tsx
