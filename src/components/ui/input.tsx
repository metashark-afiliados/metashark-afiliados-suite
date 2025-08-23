// src/components/ui/input.tsx
/**
 * @file input.tsx
 * @description Componente de Input de UI atómico, basado en la implementación
 *              canónica de Shadcn/UI. Ha sido refactorizado a un estándar de élite
 *              para incluir una prop `hasError` que gestiona centralizadamente los
 *              estilos de validación.
 * @author Metashark (adaptado de Shadcn/UI) & L.I.A. Legacy
 * @version 2.0.0
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, hasError, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          hasError &&
            "border-destructive ring-destructive focus-visible:ring-destructive",
          className
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
 * 1. **Gestión de Estado de Error Centralizada**: ((Implementada)) La adición de la prop `hasError` centraliza la lógica de estilo para errores de validación. Ahora, cualquier formulario puede indicar un estado de error a un `Input` de forma declarativa, garantizando consistencia visual en toda la aplicación.
 *
 * @subsection Melhorias Futuras
 * 1. **Icono de Estado**: ((Vigente)) Añadir una prop `statusIcon: 'success' | 'error'` que renderice un icono de `Check` o `AlertTriangle` dentro del campo de entrada para un feedback visual más explícito.
 *
 * =====================================================================
 */
// src/components/ui/input.tsx
