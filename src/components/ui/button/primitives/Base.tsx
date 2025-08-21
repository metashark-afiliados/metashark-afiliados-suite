// src/components/ui/button/primitives/Base.tsx
import * as React from "react";
import { cn } from "@/lib/utils";
import { buttonVariants, type ButtonVariantsProps } from "../variants";

// --- CORRECCIÓN: El contrato ahora incluye las variantes de estilo ---
export type ButtonBaseProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonVariantsProps;

export const ButtonBase = React.forwardRef<HTMLButtonElement, ButtonBaseProps>(
  ({ className, variant, size, colorScheme, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, colorScheme, className }))}
      {...props}
    />
  )
);
ButtonBase.displayName = "ButtonBase";
// src/components/ui/button/primitives/Base.tsx
