// src/components/builder/ui/BuilderColorPicker.tsx
/**
 * @file BuilderColorPicker.tsx
 * @description Componente de UI atómico y puro para la selección de color en el constructor.
 *              Encapsula el `SketchPicker` de `react-color` dentro de un `Popover`,
 *              proporcionando una interfaz consistente para la edición de colores.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import React from "react";
import { type ColorResult, SketchPicker } from "react-color";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/**
 * @public
 * @interface BuilderColorPickerProps
 * @description Contrato de props para el componente.
 */
export interface BuilderColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  "aria-label"?: string;
}

/**
 * @public
 * @component BuilderColorPicker
 * @description Renderiza un selector de color dentro de un popover.
 * @param {BuilderColorPickerProps} props - Propiedades del componente.
 * @returns {React.ReactElement}
 */
export function BuilderColorPicker({
  value,
  onChange,
  placeholder = "No establecido",
  className,
  id,
  "aria-label": ariaLabel,
}: BuilderColorPickerProps): React.ReactElement {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start", className)}
          aria-label={ariaLabel || `Seleccionar color: ${value || placeholder}`}
          id={id}
        >
          <div
            className="w-4 h-4 rounded-full mr-2 border"
            style={{ backgroundColor: value }}
          />
          {value || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-0">
        <SketchPicker
          color={value}
          onChangeComplete={(color: ColorResult) => onChange(color.hex)}
        />
      </PopoverContent>
    </Popover>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical (SRP)**: ((Implementada)) Componente puro que encapsula la selección de color.
 * 2. **Full Internacionalización**: ((Implementada)) Es agnóstico al contenido; el `placeholder` es inyectado desde el padre.
 * 3. **Accesibilidad (a11y)**: ((Implementada)) Incluye `id` y `aria-label`.
 *
 * @subsection Melhorias Futuras
 * 1. **Soporte para Otros Formatos de Color**: ((Vigente)) Añadir una prop `colorFormat` para permitir que el componente devuelva colores en formatos como `rgb` o `hsl`.
 * 2. **Integración con Variables de Tema**: ((Vigente)) Opcionalmente, permitir que el selector de color muestre una paleta de colores predefinida basada en las variables de tema globales de la aplicación, para mantener la consistencia del diseño.
 *
 * =====================================================================
 */
// src/components/builder/ui/BuilderColorPicker.tsx
