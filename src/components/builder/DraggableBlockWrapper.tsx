// src/components/builder/DraggableBlockWrapper.tsx
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useBuilderStore } from "@/lib/builder/core/store";
import { type PageBlock } from "@/lib/builder/types.d";
import { logger } from "@/lib/logging";
import { cn } from "@/lib/utils";
import { BlockActionsMenu } from "./BlockActionsMenu";
import { BlockDragHandle } from "./BlockDragHandle";

/**
 * @public
 * @component DraggableBlockWrapper
 * @description Orquestador que envuelve cada bloque en el canvas, proveyendo
 *              interactividad (selección, D&D) y ensamblando los átomos de UI
 *              para la manija de arrastre y el menú de acciones.
 * @param {object} props - Propiedades del componente.
 * @returns {React.ReactElement}
 * @version 2.1.0
 * @author Raz Podestá
 */
export function DraggableBlockWrapper({
  block,
  children,
}: {
  block: PageBlock;
  children: React.ReactNode;
}): React.ReactElement {
  const t = useTranslations("components.builder.BlockActions");
  const {
    selectedBlockId,
    setSelectedBlockId,
    deleteBlock,
    duplicateBlock,
    moveBlockByStep,
    campaignConfig,
  } = useBuilderStore();

  const isSelected = block.id === selectedBlockId;
  const blockIndex =
    campaignConfig?.blocks.findIndex((b) => b.id === block.id) ?? -1;
  const totalBlocks = campaignConfig?.blocks.length ?? 0;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const dndStyles: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : "auto",
    opacity: isDragging ? 0.5 : 1,
  };

  const combinedStyles: React.CSSProperties = { ...dndStyles, ...block.styles };

  const handleAction = (action: () => void, actionName: string) => {
    logger.trace(`[BlockActions] Acción ejecutada: ${actionName}`, {
      blockId: block.id,
    });
    action();
  };

  return (
    <div
      ref={setNodeRef}
      style={combinedStyles}
      onClick={() => handleAction(() => setSelectedBlockId(block.id), "select")}
      role="button"
      tabIndex={0}
      aria-label={t("block_aria_label", { blockType: block.type })}
      className={cn(
        "relative group p-1 transition-shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring",
        isSelected && "ring-2 ring-primary z-10"
      )}
    >
      <div
        className={cn(
          "absolute top-1/2 -translate-y-1/2 -left-12 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-1",
          isSelected && "opacity-100"
        )}
      >
        <BlockDragHandle attributes={attributes} listeners={listeners} />
      </div>

      <div
        className={cn(
          "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20",
          isSelected && "opacity-100"
        )}
      >
        <BlockActionsMenu
          isFirst={blockIndex === 0}
          isLast={blockIndex === totalBlocks - 1}
          onMoveUp={() =>
            handleAction(() => moveBlockByStep(block.id, "up"), "move_up")
          }
          onMoveDown={() =>
            handleAction(() => moveBlockByStep(block.id, "down"), "move_down")
          }
          onDuplicate={() =>
            handleAction(() => duplicateBlock(block.id), "duplicate")
          }
          onDelete={() => handleAction(() => deleteBlock(block.id), "delete")}
        />
      </div>

      <div className={cn(isSelected && "pointer-events-none")}>{children}</div>
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Alineación de Módulo**: ((Implementada)) Las importaciones han sido corregidas para consumir los átomos desde su manifiesto, completando la refactorización.
 *
 * =====================================================================
 */
