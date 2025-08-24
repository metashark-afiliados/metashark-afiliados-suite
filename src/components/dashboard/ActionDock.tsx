// src/components/dashboard/ActionDock.tsx
/**
 * @file src/components/dashboard/ActionDock.tsx
 * @description Orquestador de UI refactorizado a un estándar de élite. Ahora
 *              renderiza una cuadrícula de 3x7, aplicando estilos alternos
 *              e inyectando la prop `isEven` a los botones hijos.
 * @author Raz Podestá
 * @version 6.0.0
 */
"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import React from "react";

import {
  ActionDockButton,
  type ActionDockButtonProps,
} from "./ActionDockButton";

export function ActionDock(): React.ReactElement {
  const t = useTranslations("ActionDock");
  const services: ActionDockButtonProps[] = t.raw("services");

  const STAGGER_CONTAINER = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <motion.div
      variants={STAGGER_CONTAINER}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      // --- INICIO DE REFACTORIZACIÓN A CUADRÍCULA ---
      className="grid grid-cols-7 gap-x-4 gap-y-6"
      // --- FIN DE REFACTORIZACIÓN A CUADRÍCULA ---
    >
      {services.map((service, index) => (
        <ActionDockButton
          key={service.id}
          {...service}
          // Inyecta la prop para el estilo alterno
          isEven={index % 2 === 0}
        />
      ))}
    </motion.div>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Layout de Cuadrícula Densa**: ((Implementada)) El componente ahora renderiza una cuadrícula de 7 columnas, cumpliendo con la directiva de no requerir scroll.
 * 2. **Estilo Alterno**: ((Implementada)) Se ha añadido la lógica para pasar la prop `isEven`, activando el estilo de "grafito" alterno en los botones.
 *
 * =====================================================================
 */
// src/components/dashboard/ActionDock.tsx
