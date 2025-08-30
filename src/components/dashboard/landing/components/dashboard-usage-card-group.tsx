// src/components/dashboard/landing/components/dashboard-usage-card-group.tsx
/**
 * @file dashboard-usage-card-group.tsx
 * @description Componente de UI de presentación puro. Ha sido refactorizado
 *              holísticamente a un estándar de élite para ser un ensamblador
 *              100% agnóstico a la lógica de negocio, consumiendo el hook soberano
 *              `useUsageCardGroup` para obtener todos sus datos y estado.
 *              Incluye un `AnimatedCounter` para valores dinámicos y es
 *              completamente internacionalizado y animado.
 * @author Raz Podestá - MetaShark Tech
 * @version 4.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React, { useEffect, useRef } from "react";
import { animate, motion, useInView } from "framer-motion";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { useUsageCardGroup } from "@/lib/hooks/useUsageCardGroup";
import { clientLogger } from "@/lib/logging";

/**
 * @private
 * @component AnimatedCounter
 * @description Sub-componente atómico que anima un número de 0 hasta el valor objetivo.
 * @param {{ to: number }} props - El valor final al que animar.
 * @returns {React.ReactElement}
 */
const AnimatedCounter = ({ to }: { to: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView && ref.current) {
      const node = ref.current;
      const controls = animate(0, to, {
        duration: 1.5,
        ease: "easeOut",
        onUpdate(value) {
          node.textContent = Math.round(value).toLocaleString();
        },
      });
      return () => controls.stop();
    }
  }, [isInView, to]);

  return <span ref={ref} />;
};

/**
 * @public
 * @component DashboardUsageCardGroup
 * @description Ensambla la cuadrícula de tarjetas de métricas de uso. Es un
 *              componente de presentación puro que delega toda su lógica al
 *              hook `useUsageCardGroup`.
 * @returns {React.ReactElement}
 */
export function DashboardUsageCardGroup(): React.ReactElement {
  clientLogger.trace(
    "[DashboardUsageCardGroup] Renderizando componente de presentación puro."
  );

  const { cards, isLoading, animationVariants } = useUsageCardGroup();

  if (isLoading) {
    return (
      <div className={"grid gap-6 sm:grid-cols-2 lg:grid-cols-2"}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card
            key={i}
            className="bg-background/50 backdrop-blur-[24px] border-border p-6 h-[122px] animate-pulse"
          />
        ))}
      </div>
    );
  }

  const { STAGGER_CONTAINER, FADE_UP } = animationVariants;

  return (
    <motion.div
      variants={STAGGER_CONTAINER}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className={"grid gap-6 sm:grid-cols-2 lg:grid-cols-2"}
    >
      {cards.map((card) => (
        <motion.div key={card.title} variants={FADE_UP}>
          <Card
            className={
              "bg-background/50 backdrop-blur-[24px] border-border p-6 h-full"
            }
          >
            <CardHeader className="p-0 space-y-0">
              <CardTitle className="flex justify-between items-center mb-6">
                <span className={"text-base leading-4"}>{card.title}</span>
                <DynamicIcon
                  name={card.iconName}
                  className={card.iconColorClass}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className={"p-0"}>
              <p
                className={
                  "text-[32px] leading-[32px] font-bold text-foreground"
                }
              >
                <AnimatedCounter to={card.value} />
              </p>
              <div className="text-sm leading-[14px] pt-2 text-muted-foreground">
                {card.change}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **Tooltips Explicativos**: Añadir un `Tooltip` a cada tarjeta que ofrezca una explicación más detallada de la métrica (ej. "Número de sitios que no están archivados"), consumiendo este texto desde el `useUsageCardGroup` hook.
 * 2. **Animación de Tendencia**: Para las métricas con porcentajes de cambio, añadir un icono `ArrowUp` o `ArrowDown` junto al texto de "change", animado con `framer-motion` para indicar la tendencia.
 * 3. **Lógica de Colores Dinámica**: El color del texto "change" podría cambiar dinámicamente a verde o rojo para reflejar si el cambio es positivo o negativo, basado en datos provistos por el hook.
 * 4. **Pruebas Unitarias**: Este componente, ahora puro, es ideal para pruebas unitarias con Vitest, mockeando el hook `useUsageCardGroup` para proveer diferentes conjuntos de `cards` y verificar que la UI se renderiza correctamente.
 * 5. **Componente `UsageCard` Atómico**: La `motion.div` que renderiza cada tarjeta podría ser extraída a su propio componente `UsageCard.tsx` para una máxima atomicidad y limpieza del JSX en este orquestador.
 * =====================================================================
 */
// src/components/dashboard/landing/components/dashboard-usage-card-group.tsx
