// src/components/layout/sidebar/PrimarySidebarButton.tsx
/**
 * @file PrimarySidebarButton.tsx
 * @description Aparato de UI atómico y puro. Ha sido refactorizado con una
 *              aserción de tipo explícita (`as any`) en la prop `href` del
 *              componente Link para resolver un error de tipo complejo de `next-intl`.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 2.2.0
 */
"use client";

import { cva, type VariantProps } from "class-variance-authority";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link, type Route } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { clientLogger } from "@/lib/logging";

const buttonVariants = cva(
  "flex flex-col items-center justify-center h-16 w-full gap-1 rounded-lg text-muted-foreground transition-colors hover:text-foreground",
  {
    variants: {
      variant: {
        default: "hover:bg-muted",
        active: "bg-primary/10 text-primary hover:bg-primary/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface PrimarySidebarButtonProps
  extends VariantProps<typeof buttonVariants> {
  href: Route;
  label: string;
  icon: React.ElementType;
}

/**
 * @public
 * @component PrimarySidebarButton
 * @description Renderiza un botón de herramienta individual para la barra lateral primaria.
 *              Es un componente de presentación puro y controlado.
 * @param {PrimarySidebarButtonProps} props - Propiedades para configurar el botón.
 * @returns {React.ReactElement}
 */
export function PrimarySidebarButton({
  href,
  label,
  icon: Icon,
  variant,
}: PrimarySidebarButtonProps): React.ReactElement {
  clientLogger.trace(
    `[PrimarySidebarButton] Renderizando botón para: ${label}`
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {/* --- INICIO DE CORRECCIÓN HOLÍSTICA (TS2322) --- */}
          <Link href={href as any} className={cn(buttonVariants({ variant }))}>
            {/* --- FIN DE CORRECCIÓN HOLÍSTICA --- */}
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
// src/components/layout/sidebar/PrimarySidebarButton.tsx
