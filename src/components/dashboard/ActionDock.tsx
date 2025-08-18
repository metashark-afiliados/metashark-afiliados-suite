// src/components/dashboard/ActionDock.tsx
/**
 * @file src/components/dashboard/ActionDock.tsx
 * @description Aparato de UI atómico para el "Dock de Acciones". Ha sido
 *              refactorizado para la arquitectura v12.0 "Navegación Directa",
 *              utilizando el componente <Link> para la navegación directa a las
 *              páginas de creación, eliminando la dependencia de modales.
 * @author Raz Podestá
 * @version 3.0.0
 */
"use client";

import { motion } from "framer-motion";
import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { Button } from "@/components/ui/button";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/**
 * @public
 * @component ActionDock
 * @description Renderiza una serie de botones de acción rápida para las
 *              funcionalidades principales de la aplicación.
 * @returns {React.ReactElement}
 */
export function ActionDock(): React.ReactElement {
  const t = useTranslations("ActionDock");
  const services = t.raw("services" as any);

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
    <TooltipProvider>
      <motion.div
        variants={STAGGER_CONTAINER}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="flex flex-col items-center justify-center gap-6"
      >
        <div className="flex items-center justify-center flex-wrap gap-4 md:gap-8">
          {services.slice(0, 7).map((service: any) => (
            <Tooltip key={service.id}>
              <TooltipTrigger asChild>
                <motion.div variants={FADE_UP}>
                  <Link
                    href={service.href as any}
                    className="flex flex-col items-center gap-2 group w-20"
                  >
                    <div
                      className={cn(
                        "flex h-16 w-16 items-center justify-center rounded-2xl transition-all group-hover:scale-110",
                        service.colorClass
                      )}
                    >
                      <DynamicIcon
                        name={service.iconName}
                        className="h-7 w-7"
                      />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground text-center">
                      {service.label}
                    </span>
                  </Link>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{service.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        <div className="flex items-center justify-center flex-wrap gap-4 md:gap-8">
          {services.slice(7).map((service: any) => (
            <Tooltip key={service.id}>
              <TooltipTrigger asChild>
                <motion.div variants={FADE_UP}>
                  <Link
                    href={service.href as any}
                    className="flex flex-col items-center gap-2 group w-20"
                  >
                    <div
                      className={cn(
                        "flex h-16 w-16 items-center justify-center rounded-2xl transition-all group-hover:scale-110",
                        service.colorClass
                      )}
                    >
                      <DynamicIcon
                        name={service.iconName}
                        className="h-7 w-7"
                      />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground text-center">
                      {service.label}
                    </span>
                  </Link>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{service.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
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
        </div>
      </motion.div>
    </TooltipProvider>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Navegación Directa y Desacoplada**: ((Implementada)) Los iconos ahora son componentes `<Link>` que navegan directamente a las páginas de creación (`/builder/new?type=...`), implementando la arquitectura de "Navegación Directa" y eliminando la dependencia de modales.
 * 2. **Animaciones de Élite**: ((Implementada)) Se ha añadido una animación de entrada escalonada (`staggerChildren`) para una experiencia de usuario superior.
 * 3. **Consumo de SSoT de i18n**: ((Implementada)) El componente es 100% agnóstico al contenido, consumiendo el array de servicios, incluyendo las rutas `href`, desde la capa de internacionalización.
 *
 * @subsection Melhorias Futuras
 * 1. **Personalización de Dock**: ((Vigente)) Permitir al usuario reordenar o anclar los iconos del dock, guardando su preferencia en la base de datos a través de la tabla `profiles`.
 * 2. **Arnés de Pruebas**: ((Vigente)) Crear una suite de pruebas unitarias para este componente para validar su renderizado y la correcta asignación de las rutas `href`.
 *
 * =====================================================================
 */
// src/components/dashboard/ActionDock.tsx
