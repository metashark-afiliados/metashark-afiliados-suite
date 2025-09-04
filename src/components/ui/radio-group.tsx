// src/components/ui/radio-group.tsx
/**
 * @file radio-group.tsx
 * @description Ecosistema de componentes Radio Group de élite. Ha sido
 *              refactorizado holísticamente para incluir variantes de tamaño (CVA),
 *              control de layout (orientation), y un estado `disabled` propagado
 *              por contexto para una DX superior.
 * @author Metashark (adaptado de Shadcn/UI) & Raz Podestá
 * @version 3.0.0
 * @date 2025-08-26
 */
"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cva, type VariantProps } from "class-variance-authority";
import { Circle } from "lucide-react";
import * as React from "react";

import { Label } from "@/components/ui/label";
import { clientLogger } from "@/lib/logger";
import { cn } from "@/lib/utils";

// --- Contexto para Propagación de Estado ---
interface RadioGroupContextValue {
  disabled?: boolean;
}
const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(
  null
);
const useRadioGroupContext = () => {
  return React.useContext(RadioGroupContext) || {};
};

// --- Componente Raíz y Proveedor de Contexto ---
interface RadioGroupProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  orientation?: "vertical" | "horizontal";
}

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(
  (
    { className, orientation = "vertical", disabled, children, ...props },
    ref
  ) => {
    const contextValue = React.useMemo(() => ({ disabled }), [disabled]);

    clientLogger.trace("[RadioGroup] Renderizando grupo.", {
      orientation,
      disabled,
    });

    return (
      <RadioGroupContext.Provider value={contextValue}>
        <RadioGroupPrimitive.Root
          className={cn(
            "flex",
            orientation === "vertical"
              ? "flex-col space-y-2"
              : "flex-row space-x-4",
            className
          )}
          disabled={disabled}
          {...props}
          ref={ref}
        >
          {children}
        </RadioGroupPrimitive.Root>
      </RadioGroupContext.Provider>
    );
  }
);
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

// --- Primitivas y Componentes Compuestos ---

const radioGroupItemVariants = cva(
  "aspect-square rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: { sm: "h-3.5 w-3.5", default: "h-4 w-4", lg: "h-5 w-5" },
    },
    defaultVariants: { size: "default" },
  }
);

const indicatorVariants = cva("fill-current text-current", {
  variants: {
    size: { sm: "h-2 w-2", default: "h-2.5 w-2.5", lg: "h-3 w-3" },
  },
  defaultVariants: { size: "default" },
});

export interface RadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
    VariantProps<typeof radioGroupItemVariants> {}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, size, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(radioGroupItemVariants({ size, className }))}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className={cn(indicatorVariants({ size }))} />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export interface RadioGroupOptionProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  size?: VariantProps<typeof radioGroupItemVariants>["size"];
}

const RadioGroupOption = React.forwardRef<
  HTMLDivElement,
  RadioGroupOptionProps
>(({ className, value, size, children, ...props }, ref) => {
  const id = React.useId();
  const { disabled } = useRadioGroupContext();

  return (
    <div
      ref={ref}
      className={cn("flex items-center space-x-2", className)}
      {...props}
    >
      <RadioGroupItem value={value} id={id} size={size} />
      <Label
        htmlFor={id}
        className={cn(
          "font-normal cursor-pointer",
          disabled && "cursor-not-allowed opacity-70"
        )}
      >
        {children}
      </Label>
    </div>
  );
});
RadioGroupOption.displayName = "RadioGroupOption";

export { RadioGroup, RadioGroupItem, RadioGroupOption };

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Estado Deshabilitado por Grupo**: ((Implementada)) El componente `RadioGroup` ahora acepta una prop `disabled` que se propaga a todos los hijos a través de React Context, mejorando drásticamente la DX.
 * 2. **Control de Orientación (Layout)**: ((Implementada)) Se ha añadido la prop `orientation` al `RadioGroup`, permitiendo un control declarativo del layout.
 * 3. **Componente Compuesto de Élite**: ((Implementada)) Se ha creado el componente `RadioGroupOption` que integra el `Item` y el `Label` para una accesibilidad y DX superiores.
 *
 * @subsection Melhorias Futuras
 * 1. **Integración con Estado de Formulario**: ((Vigente)) El `RadioGroup` raíz podría aceptar una prop `hasError: boolean` que se propague por contexto para aplicar estilos de error, permitiendo una integración visual completa con `react-hook-form`.
 * 2. **Variantes Visuales**: ((Pendiente)) Se podría añadir una prop `variant` en `RadioGroupOption` (ej. `variant="card"`) para transformar cada opción en una tarjeta seleccionable.
 *
 * =====================================================================
 */
// src/components/ui/radio-group.tsx
