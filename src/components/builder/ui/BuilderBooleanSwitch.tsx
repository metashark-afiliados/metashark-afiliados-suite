// src/components/builder/ui/BuilderBooleanSwitch.tsx
/**
 * @file BuilderBooleanSwitch.tsx
 * @description Componente de UI atómico y puro para la alternancia de valores booleanos en el constructor.
 *              Encapsula el componente `Switch` base, proporcionando una interfaz
 *              consistente para la edición de propiedades de tipo booleano.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

/**
 * @public
 * @interface BuilderBooleanSwitchProps
 * @description Contrato de props para el componente.
 */
export interface BuilderBooleanSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  className?: string;
  id?: string;
  "aria-label"?: string;
}

/**
 * @public
 * @component BuilderBooleanSwitch
 * @description Renderiza un interruptor controlado. Es 100% agnóstico al contenido,
 *              recibiendo su `label` y `aria-label` del componente padre.
 * @param {BuilderBooleanSwitchProps} props - Propiedades del componente.
 * @returns {React.ReactElement}
 */
export function BuilderBooleanSwitch({
  checked,
  onCheckedChange,
  label,
  className,
  id,
  "aria-label": ariaLabel,
}: BuilderBooleanSwitchProps): React.ReactElement {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-label={ariaLabel || label || "Alternar"}
      />
      {label && <Label htmlFor={id}>{label}</Label>}
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical (SRP)**: ((Implementada)) Componente puro que encapsula la edición de valores booleanos.
 * 2. **Full Internacionalización**: ((Implementada)) Completamente agnóstico al contenido. El `label` es inyectado desde el padre.
 * 3. **Accesibilidad (a11y)**: ((Implementada)) Incluye `id`, `aria-label` y asocia el `<Label>` con el `<Switch>` para una correcta implementación.
 *
 * @subsection Melhorias Futuras
 * 1. **Variantes de Estilo (CVA)**: ((Vigente)) Añadir props para variantes visuales (ej. `size`, `color`) para una mayor flexibilidad de diseño sin necesidad de sobrescribir clases.
 * 2. **Iconos en el Interruptor**: ((Vigente)) Permitir la adición de pequeños iconos para los estados "on" y "off" dentro del interruptor, mejorando la comunicación visual.
 *
 * =====================================================================
 */
// src/components/builder/ui/BuilderBooleanSwitch.tsx
