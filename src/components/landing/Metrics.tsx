// src/components/landing/Metrics.tsx
/**
 * @file src/components/landing/Metrics.tsx
 * @description Componente de presentación para la sección de métricas.
 *              Implementa contadores animados e iconos contextuales para una
 *              experiencia de usuario dinámica y visualmente atractiva.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 2.1.0
 */
"use client";

import React, { useEffect, useRef } from "react";
import { animate, motion, useInView } from "framer-motion";

import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { clientLogger } from "@/lib/logging";

/**
 * @public
 * @interface MetricItem
 * @description Define el contrato de datos para una única métrica.
 */
export interface MetricItem {
  iconName: string;
  prefix?: string;
  value: number;
  suffix: string;
  label: string;
}

/**
 * @public
 * @interface MetricsProps
 * @description Define el contrato de props para el componente `Metrics`.
 */
export interface MetricsProps {
  metrics: MetricItem[];
}

/**
 * @private
 * @component AnimatedCounter
 * @description Sub-componente atómico que anima un número desde 0 hasta el valor objetivo
 *              cuando entra en el viewport.
 * @param {{ to: number, prefix?: string, suffix: string }} props - El valor final y los afijos.
 * @returns {React.ReactElement}
 */
const AnimatedCounter = ({
  to,
  prefix,
  suffix,
}: {
  to: number;
  prefix?: string;
  suffix: string;
}) => {
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView && ref.current) {
      const node = ref.current;
      const controls = animate(0, to, {
        duration: 2,
        ease: "easeOut",
        onUpdate(value) {
          node.textContent = `${prefix || ""}${Math.round(
            value
          ).toLocaleString()}${suffix}`;
        },
      });
      return () => controls.stop();
    }
  }, [isInView, to, prefix, suffix]);

  return <span ref={ref} />;
};

/**
 * @public
 * @component Metrics
 * @description Orquesta el renderizado de la sección de métricas.
 * @param {MetricsProps} props - Propiedades para configurar la sección.
 * @returns {React.ReactElement}
 */
export function Metrics({ metrics }: MetricsProps): React.ReactElement {
  clientLogger.trace("[Metrics] Renderizando componente de presentación puro.");

  const FADE_UP_VARIANTS = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-20 bg-muted/50">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.2 } },
        }}
        className="container mx-auto grid grid-cols-1 gap-8 px-4 text-center md:grid-cols-3 md:px-6"
      >
        {(metrics || []).map((metric) => (
          <motion.div
            key={metric.label}
            variants={FADE_UP_VARIANTS}
            className="flex flex-col items-center justify-center"
          >
            <DynamicIcon
              name={metric.iconName}
              className="h-10 w-10 text-primary mb-4"
            />
            <div className="text-4xl font-bold text-foreground md:text-5xl">
              <AnimatedCounter
                to={metric.value}
                prefix={metric.prefix}
                suffix={metric.suffix}
              />
            </div>
            <p className="mt-2 text-muted-foreground">{metric.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
// src/components/landing/Metrics.tsx
