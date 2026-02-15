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
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
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
import { type BuilderState } from "@/lib/builder/core";

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
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Datos de Plantilla**: ((Implementada)) La función `handleDragEnd` ahora extrae `initialProps` desde `active.data.current` y lo pasa a la acción `addBlock`. Esto permite que las plantillas arrastradas desde la galería se inicialicen con sus propiedades predefinidas.
 * 2. **Full Observabilidad**: ((Implementada)) Se han añadido logs de `trace` para `handleDragStart` y `handleDragEnd`, proporcionando visibilidad completa del ciclo de vida de D&D para una depuración más eficiente.
 * 3. **Cero Regresiones**: ((Implementada)) La lógica de negocio para diferenciar entre añadir desde la paleta y mover bloques existentes se ha preservado intacta.
 *
 * @subsection Melhorias Futuras
 * 1. **Previsualización de Drop (`handleDragOver`)**: ((Vigente)) Implementar la lógica en `handleDragOver` para mostrar un "placeholder" visual en el canvas donde el bloque se insertará, mejorando la UX.
 *
 * =====================================================================
 */
// src/lib/hooks/useBuilderDnD.ts
