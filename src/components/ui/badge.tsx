/**
 * @file src/components/ui/badge.tsx
 * @description Componente de Badge (etiqueta) de élite y reutilizable. Utiliza
 *              `class-variance-authority` para una gestión robusta de variantes de
 *              estilo, proporcionando un primitivo de UI consistente para mostrar
 *              estados, categorías u otra información concisa.
 * @author Raz Podestá
 * @version 1.0.0
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * @public
 * @component Badge
 * @description Renderiza un componente de insignia o etiqueta.
 * @param {BadgeProps} props - Las propiedades para configurar el badge.
 * @returns {React.ReactElement}
 */
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge };
