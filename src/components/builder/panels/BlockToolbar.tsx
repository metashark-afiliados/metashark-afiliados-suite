// src/components/builder/BlockToolbar.tsx
/**
 * @file BlockToolbar.tsx
 * @description Orquestador de UI atómico y puro. Sincronizado con la nueva
 *              arquitectura de contexto atomizada y su ruta canónica.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.1.0
 * @date 2025-08-24
 * @license MIT
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import * as React from "react";
import { type DraggableSyntheticListeners } from "@dnd-kit/core";

import { BlockActionsMenu } from "@/components/builder/BlockActionsMenu";
import { BlockDragHandle } from "@/components/builder/BlockDragHandle";
import { cn } from "@/lib/utils";
// --- INICIO DE CORRECCIÓN DE RUTA ---
import { useBlockContext } from "@/components/builder/BlockContextProvider";
// --- FIN DE CORRECCIÓN DE RUTA ---

/**
 * @public
 * @interface BlockToolbarProps
 * @description Contrato de props para el componente. Recibe los atributos y
 *              listeners de `dnd-kit` desde el `BlockContainer`.
 */
export interface BlockToolbarProps {
  dndAttributes: Record<string, any>;
  dndListeners: DraggableSyntheticListeners | undefined;
}

/**
 * @public
 * @component BlockToolbar
 * @description Renderiza las barras de herramientas laterales (arrastre y acciones)
 *              que aparecen al pasar el cursor o seleccionar un bloque.
 * @param {BlockToolbarProps} props - Propiedades para configurar la barra de herramientas.
 * @returns {React.ReactElement}
 */
export function BlockToolbar({
  dndAttributes,
  dndListeners,
}: BlockToolbarProps): React.ReactElement {
  const {
    isSelected,
    isFirst,
    isLast,
    moveBlockUp,
    moveBlockDown,
    duplicateBlock,
    deleteBlock,
  } = useBlockContext();

  return (
    <>
      <div
        className={cn(
          "absolute top-1/2 -translate-y-1/2 -left-12 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-1",
          isSelected && "opacity-100"
        )}
      >
        <BlockDragHandle attributes={dndAttributes} listeners={dndListeners} />
      </div>

      <div
        className={cn(
          "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20",
          isSelected && "opacity-100"
        )}
      >
        <BlockActionsMenu
          isFirst={isFirst}
          isLast={isLast}
          onMoveUp={moveBlockUp}
          onMoveDown={moveBlockDown}
          onDuplicate={duplicateBlock}
          onDelete={deleteBlock}
        />
      </div>
    </>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error de Compilación (TS2307)**: ((Implementada)) Se ha corregido la ruta de importación de `useBlockContext`, resolviendo el error de módulo no encontrado.
 *
 * =====================================================================
 */
// src/components/builder/BlockToolbar.tsx
