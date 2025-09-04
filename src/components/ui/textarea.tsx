// src/components/ui/textarea.tsx
/**
 * @file textarea.tsx
 * @description Componente de área de texto reutilizable. Refactorizado para
 *              incluir la prop `hasError` para una consistencia visual con el
 *              componente Input en estados de validación.
 * @author RaZ Podestá - MetaShark Tech
 * @version 2.0.0
 * @see .docs-espejo/components/ui/textarea.tsx.md
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Si es `true`, aplica estilos de error al borde del campo.
   * @default false
   */
  hasError?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, hasError, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
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
Textarea.displayName = "Textarea";

export { Textarea };
// src/components/ui/textarea.tsx
