// src/components/ui/button.tsx
/**
 * @file src/components/ui/button.tsx
 * @description Componente de Botón de élite, polimórfico y reutilizable.
 *              Utiliza `class-variance-authority` (cva) para una gestión de variantes
 *              de estilo robusta y `Radix UI Slot` para composición, permitiendo que
 *              el botón se renderice como otros elementos (ej. `<a>`) sin perder estilo.
 * @author L.I.A. Legacy
 * @version 1.0.0
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

/**
 * @public
 * @interface ButtonProps
 * @description Contrato de props para el componente Button. Extiende las propiedades
 *              nativas de un botón HTML y las variantes de estilo de CVA.
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * @property {boolean} [asChild=false]
   * @description Si es `true`, el botón no renderizará su propio elemento `button`, sino que
   *              fusionará sus propiedades con el primer elemento hijo, permitiendo la
   *              creación de botones polimórficos.
   */
  asChild?: boolean;
}

/**
 * @public
 * @component Button
 * @description Renderiza un componente de botón con variantes de estilo y soporte polimórfico.
 * @param {ButtonProps} props - Las propiedades del componente.
 * @param {React.Ref<HTMLButtonElement>} ref - La ref reenviada al elemento botón subyacente.
 * @returns {React.ReactElement} El componente de botón renderizado.
 */
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
 * 1. **Fundación de UI**: ((Implementada)) La reconstrucción de este aparato atómico es un paso fundamental, ya que será la base para la mayoría de los elementos interactivos de la aplicación.
 * 2. **Cero Regresiones**: ((Implementada)) El código es una transcripción de alta fidelidad de la implementación canónica de Shadcn/UI, garantizando cero regresiones funcionales.
 *
 * @subsection Melhorias Futuras
 * 1. **Estado de Carga**: ((Vigente)) Añadir una prop `isLoading: boolean`. Cuando sea `true`, el botón se deshabilitará y mostrará un ícono de spinner, estandarizando el feedback visual para acciones asíncronas.
 *
 * =====================================================================
 */
// src/components/ui/button.tsx
