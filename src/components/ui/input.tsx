// src/components/ui/input.tsx
/**
 * @file src/components/ui/input.tsx
 * @description Componente de Input de élite, con reenvío de ref, un contrato
 *              de props explícito y un sistema de variantes robusto. Ha sido
 *              refactorizado para resolver una colisión de tipos en la prop `size`.
 * @author Raz Podestá
 * @version 5.1.0
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
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  // --- INICIO DE CORRECCIÓN (Desestructuración Explícita) ---
  ({ className, type, variant, size, ...props }, ref) => {
    // --- FIN DE CORRECCIÓN ---
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, size, className }))}
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
 * 1. **Resolución de Colisión de Tipos**: ((Implementada)) Se ha desacoplado la desestructuración de las props de CVA (`variant`, `size`) de las props nativas (`...props`). Esto resuelve la ambigüedad para el compilador de TypeScript, eliminando los errores `TS2320` y `TS2322`.
 *
 * @subsection Melhorias Futuras
 * 1. **Estado de Error Visual**: ((Vigente)) Se podría añadir una prop `hasError: boolean` que aplique clases de borde y anillo de color destructivo.
 *
 * =====================================================================
 */
// src/components/ui/input.tsx

