// src/components/ui/button/primitives/Slot.tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { buttonVariants, type ButtonVariantsProps } from "../variants";

// --- CORRECCIÓN: El contrato ahora incluye las variantes de estilo ---
export type ButtonSlotProps = React.HTMLAttributes<HTMLElement> &
  ButtonVariantsProps & { children: React.ReactElement };

export const ButtonSlot = React.forwardRef<HTMLElement, ButtonSlotProps>(
  ({ className, variant, size, colorScheme, children, ...props }, ref) => (
    <Slot
      ref={ref}
      className={cn(buttonVariants({ variant, size, colorScheme, className }))}
      {...props}
    >
      {children}
    </Slot>
  )
);
ButtonSlot.displayName = "ButtonSlot";
// src/components/ui/button/primitives/Slot.tsx
