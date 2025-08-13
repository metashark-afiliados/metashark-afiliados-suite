// src/components/landing/Metrics.tsx
/**
 * @file src/components/landing/Metrics.tsx
 * @description Componente de presentación de élite para la sección de métricas.
 *              Ha sido refactorizado para incluir contadores animados con
 *              `framer-motion` e iconos contextuales, proporcionando una
 *              experiencia de usuario dinámica y visualmente atractiva.
 * @author Raz Podestá
 * @version 2.0.0
 */
"use client";

import React, { useEffect } from "react";
import { animate, motion, useInView } from "framer-motion";

import { DynamicIcon } from "@/components/ui/DynamicIcon";

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
 * @description Componente hijo que se encarga de la lógica de animación del contador.
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
          node.textContent = `${prefix || ""}${Math.round(value).toLocaleString()}${suffix}`;
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
        {metrics.map((metric) => (
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

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Contador Animado**: ((Implementada)) Se ha creado el sub-componente `AnimatedCounter` que utiliza el hook `animate` de Framer Motion junto con `useInView`. Esto crea un efecto visual de alto impacto donde los números "cuentan hacia arriba" cuando la sección se hace visible.
 * 2. **Iconos Contextuales**: ((Implementada)) El contrato de datos `MetricItem` ahora incluye `iconName`, y el componente renderiza un `DynamicIcon` para cada métrica, mejorando la comunicación visual.
 * 3. **Contrato de Datos Flexible**: ((Implementada)) La interfaz `MetricItem` ahora soporta `prefix` y `suffix` para manejar métricas que no son solo números (ej. `+`, `%`, `$`).
 * 4. **Atomicidad Mejorada**: ((Implementada)) La lógica de animación se ha aislado en su propio componente, manteniendo el componente principal `Metrics` como un orquestador limpio.
 *
 * @subsection Melhorias Futuras
 * 1. **Formateo de Números Localizado**: ((Vigente)) La función `toLocaleString()` utilizada en `AnimatedCounter` usará por defecto el locale del servidor o del navegador. Para una consistencia total, se podría pasar el `locale` actual desde la `HomePage` y usarlo explícitamente: `value.toLocaleString(locale)`.
 *
 * =====================================================================
 */
// src/components/landing/Metrics.tsx
