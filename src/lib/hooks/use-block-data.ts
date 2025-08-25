// src/lib/hooks/use-block-data.ts
/**
 * @file use-block-data.ts
 * @description Hook Soberano que encapsula la lógica para obtener y computar
 *              los datos contextuales para un único bloque del constructor. Actúa
 *              como la SSoT de lógica para el ecosistema de componentes de bloque.
 *              Sincronizado con la arquitectura de estado canónica.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-24
 */
"use client";

import * as React from "react";
import { shallow } from "zustand/shallow";

import { type BlockContextValue } from "@/components/builder/BlockContextProvider";
// --- INICIO DE CORRECCIÓN DE IMPORTACIONES ---
import { type BuilderState } from "@/lib/builder/core";
import { type PageBlock } from "@/lib/builder/types.d";
import { useBuilderStore } from "@/lib/hooks/use-builder-store";
// --- FIN DE CORRECCIÓN DE IMPORTACIONES ---

const blockDataSelector = (state: BuilderState) => ({
  selectedBlockId: state.selectedBlockId,
  setSelectedBlockId: state.setSelectedBlockId,
  deleteBlock: state.deleteBlock,
  duplicateBlock: state.duplicateBlock,
  moveBlockByStep: state.moveBlockByStep,
  campaignConfig: state.campaignConfig,
  updateBlockProp: state.updateBlockProp,
});

/**
 * @public
 * @function useBlockData
 * @description Obtiene los datos del store global, los computa para un bloque
 *              específico y devuelve el valor del contexto memoizado.
 * @param {PageBlock} block - El objeto de datos del bloque para el cual se computa el contexto.
 * @returns {BlockContextValue} El valor completo y computado para el `BlockContext`.
 */
export function useBlockData(block: PageBlock): BlockContextValue {
  const {
    selectedBlockId,
    setSelectedBlockId,
    deleteBlock,
    duplicateBlock,
    moveBlockByStep,
    campaignConfig,
    updateBlockProp,
  } = useBuilderStore(blockDataSelector, shallow);

  const blockIndex =
    campaignConfig?.blocks.findIndex((b: PageBlock) => b.id === block.id) ?? -1;
  const totalBlocks = campaignConfig?.blocks.length ?? 0;

  const contextValue = React.useMemo(
    (): BlockContextValue => ({
      block,
      isSelected: block.id === selectedBlockId,
      isFirst: blockIndex === 0,
      isLast: blockIndex === totalBlocks - 1,
      selectBlock: () => setSelectedBlockId(block.id),
      deleteBlock: () => deleteBlock(block.id),
      duplicateBlock: () => duplicateBlock(block.id),
      moveBlockUp: () => moveBlockByStep(block.id, "up"),
      moveBlockDown: () => moveBlockByStep(block.id, "down"),
      updateProp: (propName: string, value: any) =>
        updateBlockProp(block.id, propName, value),
    }),
    [
      block,
      selectedBlockId,
      blockIndex,
      totalBlocks,
      setSelectedBlockId,
      deleteBlock,
      duplicateBlock,
      moveBlockByStep,
      updateBlockProp,
    ]
  );

  return contextValue;
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Errores de Compilación**: ((Implementada)) Se han corregido las rutas de importación para que apunten a `@/lib/hooks/use-builder-store` y `@/lib/builder/core`, resolviendo los errores `TS2459` y `TS7006`.
 * 2. **Seguridad de Tipos Mejorada**: ((Implementada)) Al importar los tipos correctos, la inferencia de tipos dentro del hook es ahora robusta, y el parámetro `b` en `findIndex` ya no es implícitamente `any`.
 *
 * @subsection Melhorias Futuras
 * 1. **Inyección de Dependencias para Pruebas**: ((Vigente)) El hook podría ser refactorizado para aceptar opcionalmente un `useStore` mockeado, facilitando las pruebas unitarias aisladas.
 *
 * =====================================================================
 */
// src/lib/hooks/use-block-data.ts
