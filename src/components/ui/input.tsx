// src/components/ui/input.tsx
/**
 * @file src/components/ui/input.tsx
 * @description Componente de Input de élite. Ha sido nivelado para incluir un
 *              estado de error visual (`hasError`), estandarizando el feedback
 *              de validación en toda la aplicación.
 * @author Raz Podestá
 * @version 6.0.0
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const inputVariants = cva(
  "flex w-full rounded-md border text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input bg-background",
        ghost:
          "border-transparent bg-transparent hover:bg-accent focus-visible:bg-accent focus-visible:ring-transparent",
      },
      size: {
        default: "h-10 px-3 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  hasError?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, size, hasError = false, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          inputVariants({ variant, size, className }),
          hasError &&
            "border-destructive text-destructive focus-visible:ring-destructive"
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Estado de Error Visual**: ((Implementada)) Se ha añadido la prop `hasError` que aplica clases de estilo destructivas, estandarizando el feedback de validación de errores.
 *
 * @subsection Melhorias Futuras
 * 1. **Iconos de Estado**: ((Vigente)) Añadir props `leftIcon` y `rightIcon` para renderizar iconos dentro del campo de entrada, útiles para mostrar iconos de validación (check, x) o decorativos.
 *
 * =====================================================================
 */
// src/components/ui/input.tsx
