// src/lib/builder/core/store.ts
/**
 * @file store.ts
 * @description Orquestador de estado global de Zustand para el constructor.
 *              Refactorizado a un estándar de élite con el middleware `persist`
 *              para una resiliencia de datos "Local-First" y una gestión de
 *              estado explícita (`isDirty`, `lastSaved`).
 * @author Raz Podestá
 * @version 2.0.0
 */
import { create, type StateCreator } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
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

export type BuilderState = UISlice &
  BlockMutationSlice &
  CampaignStructureSlice &
  HistorySlice & {
    isSaving: boolean;
    isDirty: boolean;
    lastSaved: string | null;
    setIsSaving: (isSaving: boolean) => void;
    setAsSaved: () => void;
  };

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
    isDirty: false,
    lastSaved: null,
    setIsSaving: (isSaving) => set({ isSaving }),
    setAsSaved: () =>
      set({ isDirty: false, lastSaved: new Date().toISOString() }),

    // --- ORQUESTACIÓN DE ACCIONES ---
    setCampaignConfig: (config: CampaignConfig | null) => {
      historySlice.clearHistory();
      campaignStructureSlice.setCampaignConfig(config);
      uiSlice.setSelectedBlockId(null);
      set({ isDirty: false, lastSaved: new Date().toISOString() });
    },

    // --- ACCIONES DE MUTACIÓN CON GESTIÓN DE ESTADO "DIRTY" ---
    updateBlockProp: (blockId, propName, value) => {
      const currentConfig = get().campaignConfig;
      if (currentConfig) {
        historySlice.addStateToHistory(currentConfig);
        blockMutationSlice.updateBlockProp(blockId, propName, value);
        set({ isDirty: true });
      }
    },
    updateBlockStyle: (blockId, styleName, value) => {
      const currentConfig = get().campaignConfig;
      if (currentConfig) {
        historySlice.addStateToHistory(currentConfig);
        blockMutationSlice.updateBlockStyle(blockId, styleName, value);
        set({ isDirty: true });
      }
    },
    addBlock: (blockType, initialProvidedProps) => {
      const currentConfig = get().campaignConfig;
      if (currentConfig) {
        historySlice.addStateToHistory(currentConfig);
        campaignStructureSlice.addBlock(blockType, initialProvidedProps);
        set({ isDirty: true });
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
        set({ isDirty: true });
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
        set({ isDirty: true });
      }
    },
    moveBlockByStep: (blockId: string, direction: "up" | "down") => {
      const currentConfig = get().campaignConfig;
      if (currentConfig) {
        historySlice.addStateToHistory(currentConfig);
        campaignStructureSlice.moveBlockByStep(blockId, direction);
        set({ isDirty: true });
      }
    },
    duplicateBlock: (blockId: string) => {
      const currentConfig = get().campaignConfig;
      if (currentConfig) {
        historySlice.addStateToHistory(currentConfig);
        campaignStructureSlice.duplicateBlock(blockId);
        set({ isDirty: true });
      }
    },

    // --- ACCIONES DE HISTORIAL CON GESTIÓN DE ESTADO "DIRTY" ---
    undo: () => {
      const previousState = historySlice.undo();
      if (previousState) {
        set({
          campaignConfig: previousState,
          selectedBlockId: null,
          isDirty: true,
        });
      }
      return previousState;
    },
    redo: () => {
      const nextState = historySlice.redo();
      if (nextState) {
        set({
          campaignConfig: nextState,
          selectedBlockId: null,
          isDirty: true,
        });
      }
      return nextState;
    },
  };
};

export const useBuilderStore = create<BuilderState>()(
  persist(builderStoreCreator, {
    name: "convertikit-builder-storage",
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({
      campaignConfig: state.campaignConfig,
      devicePreview: state.devicePreview,
    }),
  })
);
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Persistencia Local-First**: ((Implementada)) La integración del middleware `persist` guarda automáticamente el estado del constructor en `localStorage`, protegiendo el trabajo del usuario contra recargas de página o cierres accidentales.
 * 2. **Gestión de Estado Explícita**: ((Implementada)) Se han añadido los estados `isDirty` y `lastSaved`, y la acción `setAsSaved`. Todas las acciones de mutación ahora marcan el estado como "sucio", proporcionando una fuente de verdad única para la UI.
 *
 * @subsection Melhorias Futuras
 * 1. **Sincronización Multi-Pestaña**: ((Vigente)) Utilizar el `storage` event de `BroadcastChannel` para sincronizar el estado del store entre múltiples pestañas del navegador.
 *
 * =====================================================================
 */
// src/lib/builder/core/store.ts
