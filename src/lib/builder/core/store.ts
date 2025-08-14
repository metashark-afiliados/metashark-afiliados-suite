// src/lib/builder/core/store.ts
/**
 * @file store.ts
 * @description Orquestador de estado global de Zustand para el constructor.
 *              Ensambla los slices atómicos (`uiSlice`, `historySlice`, etc.)
 *              y coordina las interacciones entre ellos, como registrar el
 *              historial antes de ejecutar una mutación.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { create, type StateCreator } from "zustand";
import { type CampaignConfig } from "@/lib/builder/types.d";
import { logger } from "@/lib/logging";

import {
  createBlockMutationSlice,
  type BlockMutationSlice,
} from "./blockMutationSlice";
import {
  createCampaignStructureSlice,
  type CampaignStructureSlice,
} from "./campaignStructureSlice";
import { createHistorySlice, type HistorySlice } from "./historySlice";
import { createUISlice, type UISlice } from "./uiSlice";

/**
 * @public
 * @typedef BuilderState
 * @description El tipo de estado completo y unificado para el store del constructor.
 */
export type BuilderState = UISlice &
  BlockMutationSlice &
  CampaignStructureSlice &
  HistorySlice & {
    isSaving: boolean;
    setIsSaving: (isSaving: boolean) => void;
  };

/**
 * @public
 * @function builderStoreCreator
 * @description La factoría principal que ensambla todos los slices en un único store.
 *              Sobrescribe las acciones de mutación para añadir la lógica de historial.
 */
export const builderStoreCreator: StateCreator<BuilderState> = (
  set,
  get,
  store
) => {
  const uiSlice = createUISlice(set, get, store);
  const blockMutationSlice = createBlockMutationSlice(set, get, store);
  const campaignStructureSlice = createCampaignStructureSlice(set, get, store);
  const historySlice = createHistorySlice(set, get, store);

  return {
    ...uiSlice,
    ...blockMutationSlice,
    ...campaignStructureSlice,
    ...historySlice,

    isSaving: false,
    setIsSaving: (isSaving) => set({ isSaving }),

    // --- ORQUESTACIÓN DE ACCIONES ---
    // Sobrescribe las acciones originales para añadir lógica de coordinación.

    setCampaignConfig: (config: CampaignConfig | null) => {
      historySlice.clearHistory();
      campaignStructureSlice.setCampaignConfig(config);
      uiSlice.setSelectedBlockId(null);
      logger.trace(
        "[BuilderStore] Configuración de campaña establecida e historial limpiado."
      );
    },

    updateBlockProp: (blockId, propName, value) => {
      const currentConfig = get().campaignConfig;
      if (currentConfig) {
        historySlice.addStateToHistory(currentConfig);
        blockMutationSlice.updateBlockProp(blockId, propName, value);
      }
    },

    updateBlockStyle: (blockId, styleName, value) => {
      const currentConfig = get().campaignConfig;
      if (currentConfig) {
        historySlice.addStateToHistory(currentConfig);
        blockMutationSlice.updateBlockStyle(blockId, styleName, value);
      }
    },

    addBlock: (blockType, initialProvidedProps) => {
      const currentConfig = get().campaignConfig;
      if (currentConfig) {
        historySlice.addStateToHistory(currentConfig);
        campaignStructureSlice.addBlock(blockType, initialProvidedProps);
        // Seleccionar el nuevo bloque añadido
        const newBlocks = get().campaignConfig?.blocks ?? [];
        if (newBlocks.length > 0) {
          const newBlockId = newBlocks[newBlocks.length - 1].id;
          uiSlice.setSelectedBlockId(newBlockId);
        }
      }
    },

    deleteBlock: (blockId: string) => {
      const currentConfig = get().campaignConfig;
      if (currentConfig) {
        historySlice.addStateToHistory(currentConfig);
        campaignStructureSlice.deleteBlock(blockId);
        if (get().selectedBlockId === blockId) {
          uiSlice.setSelectedBlockId(null);
        }
      }
    },

    moveBlock: (activeId: string, overId: string) => {
      const currentConfig = get().campaignConfig;
      if (currentConfig) {
        historySlice.addStateToHistory(currentConfig);
        campaignStructureSlice.moveBlock(activeId, overId);
      }
    },

    moveBlockByStep: (blockId: string, direction: "up" | "down") => {
      const currentConfig = get().campaignConfig;
      if (currentConfig) {
        historySlice.addStateToHistory(currentConfig);
        campaignStructureSlice.moveBlockByStep(blockId, direction);
      }
    },

    duplicateBlock: (blockId: string) => {
      const currentConfig = get().campaignConfig;
      if (currentConfig) {
        historySlice.addStateToHistory(currentConfig);
        campaignStructureSlice.duplicateBlock(blockId);
      }
    },

    undo: () => {
      const previousState = historySlice.undo();
      if (previousState) {
        set({ campaignConfig: previousState, selectedBlockId: null });
      }
      return previousState;
    },

    redo: () => {
      const nextState = historySlice.redo();
      if (nextState) {
        set({ campaignConfig: nextState, selectedBlockId: null });
      }
      return nextState;
    },
  };
};

export const useBuilderStore = create<BuilderState>()(builderStoreCreator);

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Arquitectura de Composición de Slices**: ((Implementada)) Este orquestador implementa el patrón de composición de slices de Zustand, resultando en una base de código de gestión de estado modular, desacoplada y altamente mantenible.
 * 2. **Coordinación de Historial**: ((Implementada)) Sobrescribe las acciones de mutación para añadir automáticamente el estado actual al historial antes de cada cambio, una lógica de orquestación de élite.
 * 3. **Mejora de UX**: ((Implementada)) La acción `addBlock` ahora selecciona automáticamente el bloque recién añadido, mejorando el flujo de trabajo del usuario.
 *
 * @subsection Melhorias Futuras
 * 1. **Middleware de Zustand**: ((Vigente)) Investigar el uso de middlewares de Zustand como `immer` para simplificar la inmutabilidad y `persist` para guardar el estado del constructor en `localStorage`, protegiendo el trabajo del usuario.
 *
 * =====================================================================
 */
// src/lib/builder/core/store.ts
