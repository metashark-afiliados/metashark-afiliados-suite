// src/components/ui/Checkbox.tsx
/**
 * @file src/components/ui/Checkbox.tsx
 * @description Componente de Checkbox reutilizable, basado en Radix UI y estilizado
 *              para coincidir con Shadcn/UI. Es un control de formulario esencial
 *              para selecciones booleanas, como la aceptación de términos.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
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
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Componente de Formulario Esencial**: ((Implementada)) Proporciona un control de formulario fundamental requerido para el cumplimiento legal y las opciones de suscripción en el nuevo `SignUpForm`.
 *
 * @subsection Melhorias Futuras
 * 1. **Estado Indeterminado**: ((Vigente)) Radix UI soporta un estado "indeterminate". El componente podría ser mejorado para aceptar una prop `checked="indeterminate"` y aplicar estilos para este estado.
 *
 * =====================================================================
 */
