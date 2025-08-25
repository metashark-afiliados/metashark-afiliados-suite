// src/components/builder/SettingsField.tsx
/**
 * @file SettingsField.tsx
 * @description Orquestador de UI atómico. Su única responsabilidad es leer la
 *              definición de una propiedad y delegar su renderizado al
 *              componente especialista apropiado (`ArrayField`, `IconField`, `SimpleField`).
 *              Esta es una implementación de élite de la "Filosofía LEGO".
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import React from "react";
import { useTranslations } from "next-intl";

import {
  type EditablePropertyDefinition,
  type PageBlock,
} from "@/lib/builder/types.d";
import { logger } from "@/lib/logging";
import { ArrayField } from "./settings-fields/ArrayField";
import { IconField } from "./settings-fields/IconField";
import { SimpleField } from "./settings-fields/SimpleField";

export interface SettingsFieldProps {
  block: PageBlock;
  propertyKey: string;
  definition: EditablePropertyDefinition;
  value: any;
  updateFn: (blockId: string, propertyKey: string, value: any) => void;
}

export function SettingsField(props: SettingsFieldProps): React.ReactElement {
  const t = useTranslations("components.builder.SettingsPanel");
  const { definition, ...rest } = props;

  const label = t(definition.label as any);
  const placeholder = definition.placeholder
    ? t(definition.placeholder as any, {
        defaultValue: definition.placeholder,
      })
    : undefined;

  switch (definition.type) {
    case "array":
      return <ArrayField {...props} />;
    case "icon":
      return <IconField {...rest} label={label} />;
    case "text":
    case "textarea":
    case "color":
    case "boolean":
    case "number":
    case "select":
    case "image":
      return (
        <SimpleField
          {...rest}
          type={definition.type}
          label={label}
          placeholder={placeholder}
        />
      );
    default:
      logger.error(
        `[SettingsField:Orchestrator] Tipo de propiedad desconocido: "${definition.type}"`
      );
      return (
        <div className="text-xs text-destructive">
          Error: Tipo de UI desconocido '{definition.type}'
        </div>
      );
  }
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomización Radical Completa**: ((Implementada)) El componente ha sido transformado exitosamente en un orquestador puro. Su lógica ahora es trivialmente simple, mejorando drásticamente la legibilidad, mantenibilidad y el cumplimiento del SRP.
 * 2. **Internacionalización Centralizada**: ((Implementada)) La lógica de traducción ahora reside únicamente en el orquestador, que pasa las etiquetas ya traducidas a los componentes hijos puros.
 *
 * @subsection Melhorias Futuras
 * 1. **Mapeo Declarativo de Componentes**: ((Vigente)) El `switch` statement es funcional, pero un mapeo de objeto (`Record<BlockPropertyType, React.ElementType>`) sería una solución aún más declarativa y extensible, adhiriéndose al principio de "Configuración sobre Código".
 *
 * =====================================================================
 */
// src/components/builder/SettingsField.tsx
