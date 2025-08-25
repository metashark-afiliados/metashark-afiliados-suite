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
import { logger } from "@/lib/logging";
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
  logger.trace("[SettingsGroup] Renderizando grupo de ajustes.", {
    blockId: block.id,
    definitionKeys: Object.keys(definitions),
  });

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
 * 1. **Composición Atómica (LEGO)**: ((Implementada)) Este aparato es un ensamblador puro, cumpliendo la "Filosofía LEGO".
 * 2. **Full Observabilidad**: ((Implementada)) Incluye logging para trazar su renderizado.
 *
 * @subsection Melhorias Futuras
 * 1. **Renderizado Condicional de Grupos**: ((Vigente)) Añadir una prop `title` opcional.
 *
 * =====================================================================
 */
// src/components/builder/SettingsGroup.tsx
