// src/components/dashboard/ActionDockButton.tsx
/**
 * @file ActionDockButton.tsx
 * @description Aparato de UI atómico. Sincronizado para aceptar la prop `isEven`
 *              y aplicar estilos de fondo alternos.
 * @author Raz Podestá
 * @version 3.1.0
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

export interface ActionDockButtonProps {
  id: string;
  label: string;
  iconName: string | LucideIcon;
  href: any;
  colorClass: string;
  textColor: string;
  isEven?: boolean; // <-- PROP AÑADIDA
}

export function ActionDockButton({
  label,
  iconName,
  href,
  colorClass,
  textColor,
  isEven,
}: ActionDockButtonProps): React.ReactElement {
  const FADE_UP = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // --- LÓGICA DE ESTILO ALTERNO ---
  const alternateBgClass = isEven ? "dark:bg-slate-800" : "dark:bg-slate-900";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div variants={FADE_UP}>
            <Link
              href={href}
              className="flex flex-col items-center gap-2 group w-20 text-center"
            >
              <div
                className={cn(
                  "flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-lg",
                  "shadow-md", // Sombra base
                  alternateBgClass // Fondo de grafito
                )}
              >
                <DynamicIcon
                  name={iconName as string}
                  className={cn("h-8 w-8", textColor, colorClass)} // Color vivo aplicado al icono
                />
              </div>
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
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
