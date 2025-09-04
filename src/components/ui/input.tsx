// src/components/ui/input.tsx
/**
 * @file input.tsx
 * @description Componente de Input de UI atómico. Refactorizado a un estándar de
 *              élite para ser un componente compuesto que soporta un `statusIcon`
 *              para feedback de validación visual, y utiliza un wrapper para un
 *              posicionamiento robusto del icono.
 * @author RaZ Podestá - MetaShark Tech
 * @version 3.0.0
 * @see .docs-espejo/components/ui/input.tsx.md
 */
import * as React from "react";
import { AlertTriangle, Check } from "lucide-react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Si es `true`, aplica estilos de error al borde del campo.
   * @default false
   */
  hasError?: boolean;
  /**
   * Muestra un icono de estado de validación a la derecha del campo.
   */
  statusIcon?: "success" | "error";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, hasError, statusIcon, ...props }, ref) => {
    const icon =
      statusIcon === "success" ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : statusIcon === "error" ? (
        <AlertTriangle className="h-4 w-4 text-destructive" />
      ) : null;

    // El div contenedor es esencial para posicionar el icono sin romper el layout.
    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            hasError &&
              "border-destructive ring-destructive focus-visible:ring-destructive",
            statusIcon && "pr-9", // Añadir padding para hacer espacio al icono
            className
          )}
          ref={ref}
          {...props}
        />
        {icon && (
          <div
            className="absolute inset-y-0 right-3 flex items-center pointer-events-none"
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
// src/components/ui/input.tsx
