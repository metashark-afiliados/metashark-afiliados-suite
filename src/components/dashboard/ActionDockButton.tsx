// src/components/dashboard/ActionDockButton.tsx
/**
 * @file ActionDockButton.tsx
 * @description Aparato de UI atómico y de presentación puro. Ha sido
 *              re-arquitecturado a un botón de formulario que envía el 'type'
 *              de creación. Su contrato de props ha sido sincronizado para
 *              incluir 'id', resolviendo el error de tipo TS2339.
 * @author Raz Podestá
 * @version 5.2.0
 */
"use client";

import { motion } from "framer-motion";

import { type LucideIconName } from "@/config/lucide-icon-names";
import { Button } from "@/components/ui/button";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/**
 * @public
 * @interface ActionDockButtonProps
 * @description Contrato de props para el componente. Es la SSoT para la forma
 *              de los datos de servicio consumidos desde `ActionDock.json`.
 */
export interface ActionDockButtonProps {
  /**
   * Identificador único del servicio, utilizado como `key` en React.
   */
  id: string;
  /**
   * Texto visible para el usuario y `aria-label`.
   */
  label: string;
  /**
   * Nombre del icono de `lucide-react` a renderizar.
   */
  iconName: LucideIconName;
  /**
   * El tipo de creación a iniciar (ej. "landing-page").
   */
  type: string;
  /**
   * Clase de Tailwind para el color del icono.
   */
  colorClass: string;
  /**
   * Clase de Tailwind para el color del texto del icono (no utilizado actualmente).
   */
  textColor: string;
  /**
   * Inyectado por el orquestador para aplicar estilos alternos.
   */
  isEven?: boolean;
}

/**
 * @public
 * @component ActionDockButton
 * @description Renderiza un botón de acción dentro de un formulario.
 * @param {ActionDockButtonProps} props - Propiedades para configurar el botón.
 * @returns {React.ReactElement}
 */
export function ActionDockButton({
  label,
  iconName,
  type,
  colorClass,
  textColor,
  isEven,
}: ActionDockButtonProps): React.ReactElement {
  const FADE_UP = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const alternateBgClass = isEven ? "dark:bg-slate-800" : "dark:bg-slate-900";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div variants={FADE_UP} className="flex flex-col items-center">
            <input type="hidden" name="type" value={type} />
            <Button
              type="submit"
              variant="ghost"
              className="flex flex-col items-center gap-2 group w-20 h-auto p-0"
              aria-label={label}
            >
              <div
                className={cn(
                  "flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-lg",
                  "shadow-md",
                  alternateBgClass
                )}
              >
                <DynamicIcon
                  name={iconName}
                  className={cn("h-8 w-8", colorClass)} // textColor es redundante si colorClass afecta al texto
                />
              </div>
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
                {label}
              </span>
            </Button>
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
 * 1. **Resolución de Error de Compilación (TS2339)**: ((Implementada)) Se ha añadido la propiedad `id: string` a la interfaz `ActionDockButtonProps`, sincronizando el contrato de TypeScript con la estructura de datos de `ActionDock.json`.
 *
 * @subsection Melhorias Futuras
 * 1. **Simplificación de Props de Estilo**: ((Vigente)) Las props `colorClass` y `textColor` son redundantes. Se podrían unificar en una única prop `colorClass` que se aplique tanto al fondo como al color del icono/texto para simplificar el manifiesto `ActionDock.json`.
 *
 * =====================================================================
 */
// src/components/dashboard/ActionDockButton.tsx
