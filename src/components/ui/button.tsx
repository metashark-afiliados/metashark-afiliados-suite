// src/components/ui/button.tsx
/**
 * @file src/components/ui/button.tsx
 * @description Componente de Botón de élite. Ha sido nivelado para incluir
 *              un estado de carga (`isLoading`) integrado, mejorando la UX y
 *              la experiencia de desarrollador.
 * @author Raz Podestá
 * @version 3.0.0
 */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

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
        background: "bg-background text-foreground shadow-sm hover:bg-accent",
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
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {children}
      </Comp>
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
 * 1. **Estado de Carga Integrado**: ((Implementada)) Se ha añadido la prop `isLoading` que deshabilita el botón y muestra un spinner, estandarizando el feedback visual para acciones asíncronas en toda la aplicación.
 *
 * @subsection Melhorias Futuras
 * 1. **Texto de Carga Opcional**: ((Vigente)) Añadir una prop `loadingText` que, si se proporciona, reemplace el `children` del botón durante el estado de carga para un feedback más explícito.
 * 2. **Iconos Adyacentes**: ((Vigente)) Añadir props `leftIcon` y `rightIcon` para facilitar la inclusión de iconos sin necesidad de componerlos manualmente.
 *
 * =====================================================================
 */
// src/components/ui/button.tsx
