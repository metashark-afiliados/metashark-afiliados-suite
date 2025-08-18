// src/components/builder/SettingsField.tsx
/**
 * @file SettingsField.tsx
 * @description Aparato de UI atómico y especializado ("Obrero"). Su única
 *              responsabilidad es renderizar un único par de Label-Input para
 *              una propiedad de bloque específica. Es la pieza fundamental de la
 *              "Arquitectura de Panel Atómico".
 * @author Raz Podestá
 * @version 1.0.0
 */
import React from "react";

import {
  BuilderBooleanSwitch,
  BuilderColorPicker,
  BuilderTextAreaInput,
  BuilderTextInput,
} from "@/components/builder/ui";
import { Label } from "@/components/ui/label";
import {
  type BlockPropertyType,
  type EditablePropertyDefinition,
  type PageBlock,
} from "@/lib/builder/types.d";
import { logger } from "@/lib/logging";

const propertyComponentMap: Record<BlockPropertyType, React.ElementType> = {
  text: BuilderTextInput,
  textarea: BuilderTextAreaInput,
  color: BuilderColorPicker,
  boolean: BuilderBooleanSwitch,
  number: BuilderTextInput, // Placeholder
  select: BuilderTextInput, // Placeholder
  image: BuilderTextInput, // Placeholder
};

export interface SettingsFieldProps {
  block: PageBlock;
  propertyKey: string;
  definition: EditablePropertyDefinition;
  value: any;
  updateFn: (blockId: string, propertyKey: string, value: any) => void;
}

/**
 * @public
 * @component SettingsField
 * @description Renderiza un campo de configuración dinámicamente basado en su definición.
 * @param {SettingsFieldProps} props - Propiedades para configurar el campo.
 * @returns {React.ReactElement}
 */
export function SettingsField({
  block,
  propertyKey,
  definition,
  value,
  updateFn,
}: SettingsFieldProps): React.ReactElement {
  const InputComponent = propertyComponentMap[definition.type];

  if (!InputComponent) {
    logger.warn(
      `[SettingsField] Componente de input no mapeado para el tipo: "${definition.type}"`
    );
    return (
      <div className="text-xs text-destructive">
        Error: Componente de UI no implementado para el tipo '{definition.type}'
      </div>
    );
  }

  const commonProps = {
    id: `${block.id}-${propertyKey}`,
    "aria-label": definition.label,
    placeholder: definition.placeholder,
  };

  const eventHandlerProps = {
    text: {
      value: value ?? "",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        updateFn(block.id, propertyKey, e.target.value),
    },
    textarea: {
      value: value ?? "",
      onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
        updateFn(block.id, propertyKey, e.target.value),
    },
    color: {
      value: value ?? "",
      onChange: (color: string) => updateFn(block.id, propertyKey, color),
    },
    boolean: {
      checked: !!value,
      onCheckedChange: (checked: boolean) =>
        updateFn(block.id, propertyKey, checked),
    },
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={commonProps.id}>{definition.label}</Label>
      <InputComponent
        {...commonProps}
        {...eventHandlerProps[
          definition.type as keyof typeof eventHandlerProps
        ]}
      />
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical (SRP)**: ((Implementada)) Este nuevo aparato encapsula perfectamente la lógica de renderizar un único campo de configuración.
 * 2. **Desacoplamiento Total**: ((Implementada)) Es un componente de presentación puro, controlado al 100% por sus props (`value`, `updateFn`), lo que lo hace predecible y fácil de probar.
 * 3. **Arquitectura Declarativa**: ((Implementada)) Utiliza un mapa (`propertyComponentMap`) para renderizar dinámicamente el componente de UI correcto, adhiriéndose al principio de "Configuración sobre Código".
 *
 * @subsection Melhorias Futuras
 * 1. **Manejo de Tipos de Input Faltantes**: ((Vigente)) El fallback actual para un tipo de input no mapeado es un mensaje de error. Podría renderizar un `BuilderTextInput` genérico por defecto para una mayor resiliencia.
 */
// src/components/builder/SettingsField.tsx
