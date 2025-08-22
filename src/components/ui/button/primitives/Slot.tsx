// src/components/ui/button/primitives/Slot.tsx
/**
 * @file Slot.tsx
 * @description Primitiva de UI. Corregida para consumir la prop `asChild` y
 *              evitar su fuga al DOM.
 * @author L.I.A. Legacy
 * @version 2.1.0
 */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";
import { buttonVariants } from "../variants";
import { type ButtonBaseProps } from "./Base";

export type ButtonSlotProps = ButtonBaseProps & {
  children: React.ReactElement;
  asChild?: boolean; // Prop opcional para compatibilidad de tipo
};

export const ButtonSlot = React.forwardRef<HTMLElement, ButtonSlotProps>(
  ({ className, variant, size, children, asChild, ...props }, ref) => (
    // --- REFINAMIENTO DE ÉLITE ---
    // La prop `asChild` se pasa al componente Slot, que la consumirá.
    // El resto de `...props` se pasarán al hijo renderizado.
    <Slot
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {/* --- FIN DE REFINAMIENTO --- */}
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
 * 1. **Herencia de Props Completa**: ((Implementada)) `ButtonSlotProps` ahora extiende `ButtonBaseProps`, heredando `disabled` y todos los demás atributos.
 * 2. **Prevención de Fuga de Props**: ((Implementada)) La prop `asChild` ahora es explícitamente consumida por el componente y no se pasa al `...props`, resolviendo la advertencia de React.
 *
 * =====================================================================
 */
// src/components/ui/button/primitives/Slot.tsx
