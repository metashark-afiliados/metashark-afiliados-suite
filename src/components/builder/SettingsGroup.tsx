// src/components/builder/SettingsGroup.tsx
/**
 * @file SettingsGroup.tsx
 * @description Aparato de UI de ensamblaje. Refactorizado para usar el
 *              `clientLogger` con la firma correcta.
 * @author L.I.A. Legacy
 * @version 2.0.0
 */
import React from "react";

import {
  type BlockPropertiesSchema,
  type PageBlock,
} from "@/lib/builder/types.d";
import { clientLogger } from "@/lib/logger";
import { SettingsField } from "./SettingsField";

export interface SettingsGroupProps {
  block: PageBlock;
  definitions: BlockPropertiesSchema;
  values: Record<string, any>;
  updateFn: (blockId: string, propertyKey: string, value: any) => void;
}

export function SettingsGroup({
  block,
  definitions,
  values,
  updateFn,
}: SettingsGroupProps): React.ReactElement {
  clientLogger.trace("[SettingsGroup] Renderizando grupo de ajustes.", {
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
// src/components/builder/SettingsGroup.tsx
