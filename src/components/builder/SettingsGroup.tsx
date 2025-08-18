// src/components/builder/SettingsGroup.tsx
/**
 * @file SettingsGroup.tsx
 * @description Aparato de UI de ensamblaje ("Capataz"). Su única responsabilidad
 *              es renderizar un grupo de campos de configuración, iterando sobre
 *              un objeto de definiciones y delegando el renderizado de cada campo
 *              individual al átomo `SettingsField`.
 * @author Raz Podestá
 * @version 1.0.0
 */
import React from "react";

import {
  type BlockPropertiesSchema,
  type PageBlock,
} from "@/lib/builder/types.d";
import { SettingsField } from "./SettingsField";

export interface SettingsGroupProps {
  block: PageBlock;
  definitions: BlockPropertiesSchema;
  values: Record<string, any>;
  updateFn: (blockId: string, propertyKey: string, value: any) => void;
}

/**
 * @public
 * @component SettingsGroup
 * @description Renderiza una lista de campos de configuración para una sección (ej. 'Contenido' o 'Estilo').
 * @param {SettingsGroupProps} props - Propiedades para configurar el grupo.
 * @returns {React.ReactElement}
 */
export function SettingsGroup({
  block,
  definitions,
  values,
  updateFn,
}: SettingsGroupProps): React.ReactElement {
  return (
    <div className="space-y-4">
      {Object.entries(definitions).map(([key, def]) => (
        <SettingsField
          key={key}
          block={block}
          propertyKey={key}
          definition={def}
          value={values[key]}
          updateFn={updateFn}
        />
      ))}
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Componente de Ensamblaje (LEGO)**: ((Implementada)) Este nuevo aparato actúa como un ensamblador de nivel medio, consumiendo el átomo `SettingsField` para construir una sección completa de UI.
 * 2. **Desacoplamiento y Reutilización**: ((Implementada)) Al ser un componente puro, `SettingsGroup` puede ser utilizado para renderizar cualquier conjunto de definiciones (contenido, estilo, etc.), promoviendo la reutilización de código.
 * 3. **Principio de Responsabilidad Única (SRP)**: ((Implementada)) Su única responsabilidad es la iteración y delegación, manteniendo el código simple y cohesivo.
 *
 * @subsection Melhorias Futuras
 * 1. **Renderizado Condicional de Grupos**: ((Vigente)) Se podría añadir una prop `title` opcional. Si se proporciona, el componente renderizaría un título (`<h3>`) y envolvería los campos en un `<fieldset>`, mejorando la estructura semántica.
 * 2. **Agrupación Visual**: ((Vigente)) La `EditablePropertyDefinition` podría incluir una propiedad `group: string`. Este componente podría agrupar visualmente los campos que compartan el mismo `group` usando un `<Separator>` entre ellos.
 *
 * =====================================================================
 */
// src/components/builder/SettingsGroup.tsx