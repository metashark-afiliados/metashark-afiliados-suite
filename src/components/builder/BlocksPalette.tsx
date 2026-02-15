// src/components/builder/BlocksPalette.tsx
/**
 * @file BlocksPalette.tsx
 * @description Orquestador de UI que muestra la lista de bloques de construcción
 *              disponibles. Es un componente declarativo que se auto-configura
 *              leyendo el manifiesto `blockEditorDefinitions`. Es la SSoT para
 *              la interfaz de "Añadir Bloques".
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useDraggable } from "@dnd-kit/core";
import { GripVertical } from "lucide-react";

import { blockRegistry } from "@/components/templates";
import { blockEditorDefinitions } from "@/lib/builder/block-editor-definitions";
import { initializeNewBlock } from "@/lib/builder/block-initializer.helper";
import { logger } from "@/lib/logging";

/**
 * @public
 * @component PaletteItemPreview
 * @description Renderiza una previsualización de un bloque cuando está siendo arrastrado
 *              desde la paleta. Es utilizado por el `DragOverlay` en el `BuilderLayout`.
 * @param {object} props - Propiedades del componente.
 * @param {string} props.blockType - El tipo de bloque a previsualizar.
 * @returns {React.ReactElement}
 */
export function PaletteItemPreview({
  blockType,
}: {
  blockType: string;
}): React.ReactElement {
  const t = useTranslations("components.builder.BlocksPalette");
  const newBlock = initializeNewBlock(blockType);

  logger.trace(
    "[PaletteItemPreview] Renderizando previsualización de arrastre.",
    { blockType }
  );

  if (newBlock) {
    const BlockComponent = blockRegistry[blockType];
    if (BlockComponent) {
      return (
        <div className="bg-card p-2 rounded-md shadow-lg opacity-70 w-80">
          {React.createElement(BlockComponent, newBlock.props)}
        </div>
      );
    }
  }

  return (
    <div className="flex items-center gap-2 p-2 bg-muted rounded-md cursor-grabbing ring-2 ring-primary">
      <GripVertical className="h-5 w-5 text-muted-foreground" />
      <span className="font-medium text-sm">
        {t("unknown_block_preview", { blockType })}
      </span>
    </div>
  );
}

/**
 * @private
 * @component PaletteItem
 * @description Renderiza un único ítem arrastrable en la paleta de bloques.
 * @param {object} props - Propiedades del componente.
 * @param {string} props.blockType - El tipo de bloque que este ítem representa.
 * @returns {React.ReactElement}
 */
function PaletteItem({ blockType }: { blockType: string }): React.ReactElement {
  const t = useTranslations("components.builder.BlocksPalette");
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `palette-${blockType}`,
    data: {
      blockType: blockType,
      fromPalette: true,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="flex items-center gap-2 p-2 bg-muted rounded-md cursor-grab active:cursor-grabbing hover:bg-accent transition-colors"
    >
      <GripVertical className="h-5 w-5 text-muted-foreground" />
      <span className="font-medium text-sm">
        {t(`block_name_${blockType}` as any, { defaultValue: blockType })}
      </span>
    </div>
  );
}

/**
 * @public
 * @component BlocksPalette
 * @description Orquesta el renderizado de la lista completa de bloques de construcción
 *              disponibles, obtenidos del manifiesto `blockEditorDefinitions`.
 * @returns {React.ReactElement}
 */
export function BlocksPalette(): React.ReactElement {
  const t = useTranslations("components.builder.BlocksPalette");
  const availableBlockTypes = Object.keys(blockEditorDefinitions);

  logger.trace("[BlocksPalette] Renderizando paleta de bloques.", {
    count: availableBlockTypes.length,
  });

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
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Arquitectura Declarativa**: ((Implementada)) El componente es 100% declarativo; su contenido se deriva automáticamente del manifiesto `blockEditorDefinitions`.
 *
 * @subsection Melhorias Futuras
 * 1. **Categorización y Búsqueda**: ((Vigente)) Añadir un `Accordion` para agrupar bloques y un `SearchInput` para filtrarlos.
 *
 * =====================================================================
 */
// src/components/builder/BlocksPalette.tsx
