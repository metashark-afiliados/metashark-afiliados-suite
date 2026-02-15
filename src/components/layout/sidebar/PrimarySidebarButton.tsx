// src/components/layout/sidebar/PrimarySidebarButton.tsx
/**
 * @file PrimarySidebarButton.tsx
 * @description Aparato de UI atómico y puro para los botones de la barra de
 *              navegación primaria. Utiliza CVA para una gestión de variantes
 *              de élite y `Tooltip` para una UX superior.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { cva, type VariantProps } from "class-variance-authority";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "flex flex-col items-center justify-center h-16 w-full gap-1 rounded-lg text-muted-foreground transition-colors hover:text-foreground",
  {
    variants: {
      variant: {
        default: "hover:bg-muted",
        active: "bg-primary/10 text-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface PrimarySidebarButtonProps
  extends VariantProps<typeof buttonVariants> {
  href: any;
  label: string;
  icon: React.ElementType;
}

export function PrimarySidebarButton({
  href,
  label,
  icon: Icon,
  variant,
}: PrimarySidebarButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={href} className={cn(buttonVariants({ variant }))}>
            <Icon className="h-5 w-5" />
            <span className="text-xs font-medium">{label}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">
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
 * 1. **Componente de UI Atómico (LEGO)**: ((Implementada)) Este componente encapsula perfectamente la presentación de un botón de herramienta, cumpliendo con la "Filosofía LEGO".
 * 2. **Estilo Declarativo con CVA**: ((Implementada)) Utiliza `class-variance-authority` para gestionar los estados visuales, creando una API de props limpia y escalable.
 *
 * @subsection Melhorias Futuras
 * 1. **Indicador "PRO"**: ((Vigente)) Añadir una prop `isPro: boolean` que, si es `true`, renderice un pequeño "badge" sobre el icono para indicar que es una característica premium.
 *
 * =====================================================================
 */
// src/components/layout/sidebar/PrimarySidebarButton.tsx
