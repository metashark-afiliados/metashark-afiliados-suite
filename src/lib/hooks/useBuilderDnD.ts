// src/lib/hooks/useBuilderDnD.ts
/**
 * @file useBuilderDnD.ts
 * @description Hook de React atómico y soberano. Encapsula TODA la lógica de estado y
 *              eventos para la funcionalidad de arrastrar y soltar (Drag and Drop)
 *              del constructor de campañas. Sincronizado con la arquitectura de
 *              consumo de estado canónica.
 * @author Raz Podestá - MetaShark Tech
 * @version 5.0.0
 * @date 2025-08-24
 */
"use client";

import { useState } from "react";
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
import { shallow } from "zustand/shallow";

import { useBuilderStore } from "@/lib/hooks/use-builder-store";
import { logger } from "@/lib/logging";

const dndSelector = (
  state: import("@/lib/builder/core/store.types").BuilderState
) => ({
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
    logger.trace("[useBuilderDnD] Drag Start", { id: event.active.id });
    setActiveId(event.active.id);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Lógica futura para previsualización de drop
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    logger.trace("[useBuilderDnD] Drag End", {
      activeId: active.id,
      overId: over?.id,
    });
    setActiveId(null);

    if (!over) return;

    const isFromPalette = active.data.current?.fromPalette === true;
    if (isFromPalette) {
      const blockType = active.data.current?.blockType;
      if (blockType) {
        addBlock(blockType);
      }
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

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización con SSoT de Estado**: ((Implementada)) El hook ahora consume el store a través de la SSoT `useBuilderStore`, resolviendo el error de dependencia crítico y alineándose con la arquitectura de estado de élite.
 * 2. **Full Observabilidad**: ((Implementada)) Se han añadido logs de `trace` para `handleDragStart` y `handleDragEnd`, proporcionando visibilidad completa del ciclo de vida de D&D para una depuración más eficiente.
 * 3. **Cero Regresiones**: ((Implementada)) La lógica de negocio para diferenciar entre añadir desde la paleta y mover bloques existentes se ha preservado intacta.
 *
 * @subsection Melhorias Futuras
 * 1. **Previsualización de Drop (`handleDragOver`)**: ((Vigente)) Implementar la lógica en `handleDragOver` para mostrar un "placeholder" visual en el canvas donde el bloque se insertará, mejorando la UX.
 * 2. **Restricciones de Drop**: ((Vigente)) Añadir lógica para prevenir que ciertos bloques se puedan soltar dentro de otros, si las reglas de negocio futuras lo requieren.
 *
 * =====================================================================
 */
// src/lib/hooks/useBuilderDnD.ts
