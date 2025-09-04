// src/components/builder/BlocksPalette.tsx
/**
 * @file BlocksPalette.tsx
 * @description Orquestador de UI que muestra la lista de bloques de construcción
 *              disponibles. Es un componente declarativo que se auto-configura
 *              leyendo el manifiesto `blockEditorDefinitions`.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @see .docs-espejo/components/builder/BlocksPalette.tsx.md
 */
"use client";

import { useTranslations } from "next-intl";
import React from "react";

import { blockEditorDefinitions } from "@/lib/builder/block-editor-definitions";
import { clientLogger } from "@/lib/logger";
import { PaletteItem } from "@/components/builder/panels/PaletteItem";

/**
 * @public
 * @component BlocksPalette
 * @description Orquesta el renderizado de la lista de bloques de construcción.
 * @returns {React.ReactElement}
 */
export function BlocksPalette(): React.ReactElement {
  const t = useTranslations("components.builder.BlocksPalette");
  const availableBlockTypes = Object.keys(blockEditorDefinitions);

  clientLogger.trace(
    { count: availableBlockTypes.length },
    "[BlocksPalette] Renderizando paleta."
  );

  return (
    <div className="p-4 space-y-4 relative">
      <h3 className="font-bold text-lg border-b pb-2">{t("title")}</h3>
      <div className="grid grid-cols-2 gap-2">
        {availableBlockTypes.map((type) => (
          <PaletteItem key={type} blockType={type} />
        ))}
      </div>
    </div>
  );
}
// src/components/builder/BlocksPalette.tsx
