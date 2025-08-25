// src/components/builder/settings-fields/SimpleField.tsx
/**
 * @file SimpleField.tsx
 * @description Aparato de UI atómico y especializado. Su única responsabilidad
 *              es renderizar y gestionar la UI para todos los tipos de
 *              propiedades simples (texto, color, booleano, etc.).
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";

import {
  BuilderBooleanSwitch,
  BuilderColorPicker,
  BuilderTextAreaInput,
  BuilderTextInput,
} from "@/components/builder/ui";
import { Label } from "@/components/ui/label";
import { type BlockPropertyType, type PageBlock } from "@/lib/builder/types.d";
import { logger } from "@/lib/logging";

const propertyComponentMap: Record<
  Exclude<BlockPropertyType, "array" | "icon">,
  React.ElementType
> = {
  text: BuilderTextInput,
  textarea: BuilderTextAreaInput,
  color: BuilderColorPicker,
  boolean: BuilderBooleanSwitch,
  number: BuilderTextInput, // Placeholder
  select: BuilderTextInput, // Placeholder
  image: BuilderTextInput, // Placeholder
};

export interface SimpleFieldProps {
  block: PageBlock;
  propertyKey: string;
  type: BlockPropertyType;
  label: string;
  placeholder?: string;
  value: any;
  updateFn: (blockId: string, propertyKey: string, value: any) => void;
}

export function SimpleField({
  block,
  propertyKey,
  type,
  label,
  placeholder,
  value,
  updateFn,
}: SimpleFieldProps) {
  const InputComponent =
    propertyComponentMap[type as keyof typeof propertyComponentMap];

  if (!InputComponent) {
    logger.error(
      `[SimpleField] Componente de input no mapeado para el tipo: "${type}"`
    );
    return (
      <div className="text-xs text-destructive">
        Error: Tipo de UI no implementado '{type}'
      </div>
    );
  }

  // Se construye un objeto de props común para todos los componentes de input.
  // Cada componente de input consumirá solo las props que necesita.
  const commonInputProps = {
    id: `${block.id}-${propertyKey}`,
    value: value ?? "",
    checked: !!value,
    placeholder: placeholder,
    onChange: (e: React.ChangeEvent<HTMLInputElement> | string) => {
      const newValue = typeof e === "string" ? e : e.target.value;
      updateFn(block.id, propertyKey, newValue);
    },
    onCheckedChange: (checked: boolean) => {
      updateFn(block.id, propertyKey, checked);
    },
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={commonInputProps.id}>{label}</Label>
      <InputComponent {...commonInputProps} />
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical (SRP)**: ((Implementada)) Este componente tiene la única responsabilidad de gestionar la UI para tipos de propiedades simples.
 * 2. **Arquitectura Declarativa**: ((Implementada)) Utiliza un mapa de configuración (`propertyComponentMap`) para renderizar el componente de UI correcto, adhiriéndose al principio de "Configuración sobre Código".
 *
 * @subsection Melhorias Futuras
 * 1. **Componentes Especializados**: ((Vigente)) Crear componentes `BuilderNumberInput`, `BuilderSelect`, y `BuilderImagePicker` para reemplazar los placeholders actuales y proporcionar una UX de edición más rica.
 *
 * =====================================================================
 */
// src/components/builder/settings-fields/SimpleField.tsx
