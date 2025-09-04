// src/components/ui/Checkbox.tsx
/**
 * @file src/components/ui/Checkbox.tsx
 * @description Componente de Checkbox reutilizable. Refactorizado para incluir
 *              la prop `hasError` para una consistencia visual con otros
 *              componentes de formulario en estados de validación.
 * @author RaZ Podestá - MetaShark Tech
 * @version 2.0.0
 * @see .docs-espejo/components/ui/Checkbox.tsx.md
 */
"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import * as React from "react";

import { clientLogger } from "@/lib/logger";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  /**
   * Si es `true`, aplica estilos de error al borde y al anillo de foco.
   * @default false
   */
  hasError?: boolean;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, hasError, ...props }, ref) => {
  clientLogger.trace("[Checkbox] Renderizando componente.", { hasError });
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        hasError && "border-destructive focus-visible:ring-destructive",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn("flex items-center justify-center text-current")}
      >
        <Check className="h-4 w-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
// src/components/ui/Checkbox.tsx
