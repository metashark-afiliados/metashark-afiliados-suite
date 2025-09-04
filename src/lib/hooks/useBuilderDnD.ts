// src/lib/hooks/useBuilderDnD.ts
/**
 * @file useBuilderDnD.ts
 * @description Hook de React atómico y soberano. Encapsula TODA la lógica de estado y
 *              eventos para la funcionalidad de arrastrar y soltar (Drag and Drop)
 *              del constructor de campañas. Refactorizado para alinear el logging
 *              con la firma canónica.
 * @author Raz Podestá - MetaShark Tech
 * @version 6.0.0
 */
"use client";

import {
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";
import { shallow } from "zustand/shallow";

import { type BuilderState } from "@/lib/builder/core";
import { useBuilderStore } from "@/lib/hooks/use-builder-store";
import { logger } from "@/lib/logger";

const dndSelector = (state: BuilderState) => ({
  addBlock: state.addBlock,
  moveBlock: state.moveBlock,
});

/**
 * @public
 * @function useBuilderDnD
 * @description Hook soberano que encapsula la lógica de arrastrar y soltar.
 * @returns {{
 *   sensors: ReturnType<typeof useSensors>;
 *   activeId: UniqueIdentifier | null;
 *   handleDragStart: (event: DragStartEvent) => void;
 *   handleDragOver: (event: DragOverEvent) => void;
 *   handleDragEnd: (event: DragEndEvent) => void;
 * }} La API completa para gestionar el D&D.
 */
export function useBuilderDnD() {
  const { addBlock, moveBlock } = useBuilderStore(dndSelector, shallow);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    logger.trace({ id: event.active.id }, "[useBuilderDnD] Drag Start");
    setActiveId(event.active.id);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Lógica futura para previsualización de drop
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    logger.trace(
      { activeId: active.id, overId: over?.id },
      "[useBuilderDnD] Drag End"
    );
    setActiveId(null);

    if (!over) return;

    const isFromPalette = active.data.current?.fromPalette === true;
    const blockType = active.data.current?.blockType;
    const initialProps = active.data.current?.initialProps;

    if (isFromPalette && blockType) {
      addBlock(blockType, initialProps);
      return;
    }

    if (active.id !== over.id) {
      moveBlock(String(active.id), String(over.id));
    }
  };

  return {
    sensors,
    activeId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
// src/lib/hooks/useBuilderDnD.ts
