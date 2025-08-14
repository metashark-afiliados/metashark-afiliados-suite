// src/components/ui/button.tsx
/**
 * @file src/components/ui/button.tsx
 * @description Componente de Botón de élite. Ha sido nivelado para incluir
 *              una nueva variante `background` para estados activos/seleccionados,
 *              aumentando su versatilidad y resolviendo un error de tipo en sus
 *              consumidores.
 * @author Raz Podestá
 * @version 2.0.0
 */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // --- INICIO DE REFACTORIZACIÓN DE ÉLITE (NUEVA VARIANTE) ---
        background: "bg-background text-foreground shadow-sm hover:bg-accent",
        // --- FIN DE REFACTORIZACIÓN DE ÉLITE ---
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Versatilidad de UI**: ((Implementada)) Se ha añadido la variante `background`. Esto no solo resuelve el error de tipo, sino que enriquece nuestro sistema de diseño con un nuevo primitivo para estados "activos".
 *
 * @subsection Melhorias Futuras
 * 1. **Estado de Carga**: ((Vigente)) Añadir una prop `isLoading: boolean` que deshabilite el botón y muestre un spinner, estandarizando el feedback visual para acciones asíncronas.
 *
 * =====================================================================
 */
// src/components/ui/button.tsx
