// src/components/dashboard/ActionDock.tsx
/**
 * @file src/components/dashboard/ActionDock.tsx
 * @description Orquestador de UI para el "Dock de Acciones". Su única
 *              responsabilidad es consumir los datos de i18n y ensamblar
 *              los componentes atómicos `ActionDockButton`.
 * @author Raz Podestá
 * @version 4.0.0
 */
"use client";

import { motion } from "framer-motion";
import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ActionDockButton,
  type ActionDockButtonProps,
} from "./ActionDockButton";

/**
 * @public
 * @component ActionDock
 * @description Renderiza una serie de botones de acción rápida para las
 *              funcionalidades principales de la aplicación.
 * @returns {React.ReactElement}
 */
export function ActionDock(): React.ReactElement {
  const t = useTranslations("ActionDock");
  const services: ActionDockButtonProps[] = t.raw("services");

  const FADE_UP = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

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
      className="flex flex-col items-center justify-center gap-6"
    >
      <div className="flex items-center justify-center flex-wrap gap-4 md:gap-8">
        {services.slice(0, 7).map((service) => (
          <ActionDockButton key={service.id} {...service} />
        ))}
      </div>
      <div className="flex items-center justify-center flex-wrap gap-4 md:gap-8">
        {services.slice(7).map((service) => (
          <ActionDockButton key={service.id} {...service} />
        ))}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div variants={FADE_UP}>
                <Button
                  variant="ghost"
                  className="flex flex-col items-center justify-center h-auto p-0 gap-2 group w-20"
                  aria-label={t("more_button_label")}
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted transition-all group-hover:scale-110">
                    <MoreHorizontal className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground text-center">
                    {t("more_button_label")}
                  </span>
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("more_button_label")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </motion.div>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Arquitectura de Ensamblaje (LEGO)**: ((Implementada)) El `ActionDock` ahora es un orquestador puro que compone el nuevo átomo `ActionDockButton`, mejorando la legibilidad, mantenibilidad y adhiriéndose a la "Filosofía LEGO".
 * 2. **Contrato de Datos Estricto**: ((Implementada)) Se utiliza el tipo `ActionDockButtonProps` para asegurar que los datos consumidos de `t.raw("services")` tengan la forma correcta, mejorando la seguridad de tipos.
 *
 * @subsection Melhorias Futuras
 * 1. **Renderizado Dinámico Basado en Permisos**: ((Vigente)) Este orquestador podría ser mejorado para consumir el `useDashboard` hook, obtener los módulos a los que el usuario tiene acceso, y renderizar dinámicamente solo los `ActionDockButton` permitidos.
 *
 * =====================================================================
 */
// src/components/dashboard/ActionDock.tsx
