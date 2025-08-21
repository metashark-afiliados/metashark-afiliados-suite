// src/components/dashboard/ActionDockButton.tsx
/**
 * @file ActionDockButton.tsx
 * @description Aparato de UI atómico y de presentación puro. Renderiza un
 *              único botón de acción para el `ActionDock`, encapsulando
 *              la lógica de Tooltip, animación y enlace.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";

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
 * @interface ActionDockButtonProps
 * @description Contrato de props para el componente.
 */
export interface ActionDockButtonProps {
  id: string;
  label: string;
  iconName: string | LucideIcon;
  href: any; // any para compatibilidad con next-intl
  colorClass: string;
}

/**
 * @public
 * @component ActionDockButton
 * @description Renderiza un botón de acción individual del dock.
 * @param {ActionDockButtonProps} props - Propiedades para configurar el botón.
 * @returns {React.ReactElement}
 */
export function ActionDockButton({
  id,
  label,
  iconName,
  href,
  colorClass,
}: ActionDockButtonProps): React.ReactElement {
  const FADE_UP = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div variants={FADE_UP}>
            <Link
              href={href}
              className="flex flex-col items-center gap-2 group w-20"
            >
              <div
                className={cn(
                  "flex h-16 w-16 items-center justify-center rounded-2xl transition-all group-hover:scale-110",
                  colorClass
                )}
              >
                <DynamicIcon name={iconName as string} className="h-7 w-7" />
              </div>
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground text-center">
                {label}
              </span>
            </Link>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical (SRP)**: ((Implementada)) Este nuevo aparato encapsula perfectamente la lógica de renderizado de un único botón, mejorando la cohesión y adhiriéndose a la "Filosofía LEGO".
 * 2. **Componente Puro y Controlado**: ((Implementada)) Es 100% agnóstico al contenido, recibiendo todos sus datos y comportamiento a través de props.
 *
 * @subsection Melhorias Futuras
 * 1. **Manejo de Clics**: ((Vigente)) Se podría añadir una prop `onClick` opcional para manejar acciones que no son de navegación (ej. abrir un modal) sin necesidad de un `href`.
 *
 * =====================================================================
 */
// src/components/dashboard/ActionDockButton.tsx
