// src/lib/hooks/useBuilderDnD.ts
/**
 * @file useBuilderDnD.ts
 * @description Hook de React atómico que encapsula TODA la lógica de estado y
 *              eventos para la funcionalidad de arrastrar y soltar (Drag and Drop)
 *              del constructor de campañas. Es la única fuente de verdad para
 *              manejar la interacción D&D.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import { useState } from "react";
import {
  type DragEndEvent,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { useBuilderStore } from "@/lib/builder/core/store";

/**
 * @public
 * @function useBuilderDnD
 * @description Encapsula la lógica de Drag and Drop para el constructor.
 * @returns Un objeto con sensores, el ID del elemento activo y los manejadores de eventos.
 */
export function useBuilderDnD() {
  const { addBlock, moveBlock } = useBuilderStore();
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const isFromPalette = active.data.current?.fromPalette === true;

    if (isFromPalette) {
      const blockType = active.data.current?.blockType;
      if (blockType) {
        addBlock(blockType);
      }
    } else if (active.id !== over.id) {
      moveBlock(String(active.id), String(over.id));
    }
  };

  return {
    sensors,
    activeId,
    handleDragStart,
    handleDragEnd,
  };
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error de Compilación**: ((Implementada)) La creación de este archivo resuelve el último error `TS2307` en `BuilderLayout.tsx`.
 * 2. **Lógica Centralizada (SRP)**: ((Implementada)) Toda la lógica de D&D está ahora encapsulada en este hook, desacoplando el `BuilderLayout`.
 *
 * @subsection Melhorias Futuras
 * 1. **Gestos Complejos**: ((Vigente)) Integrar `useSensor(TouchSensor)` para una mejor experiencia en dispositivos táctiles.
 *
 * =====================================================================
 */
// src/lib/hooks/useBuilderDnD.ts
