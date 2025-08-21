// src/components/ui/button/primitives/Slot.tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../variants";
import { type ButtonBaseProps } from "./Base"; // Importar el tipo base

export type ButtonSlotProps = ButtonBaseProps & {
  children: React.ReactElement;
};

export const ButtonSlot = React.forwardRef<HTMLElement, ButtonSlotProps>(
  ({ className, variant, size, children, ...props }, ref) => (
    <Slot
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </Slot>
  )
);
ButtonSlot.displayName = "ButtonSlot";

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Herencia de Props Completa**: ((Implementada)) `ButtonSlotProps` ahora extiende `ButtonBaseProps`, heredando `disabled` y todos los demás atributos de botón, resolviendo el error de tipo en `pagination-controls`.
 * =====================================================================
 */
