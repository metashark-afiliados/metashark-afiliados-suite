// src/lib/builder/core/store.ts
/**
 * @file store.ts
 * @description Store de Zustand de élite para el constructor. Re-arquitecturado
 *              para utilizar el wrapper canónico `createStoreWithHistory` y componer
 *              el middleware `persist` de forma correcta, resolviendo la
 *              incompatibilidad arquitectónica.
 * @author Raz Podestá
 * @version 15.0.0
 */
"use client";

import { create, type StateCreator } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createStoreWithHistory } from "zustand-undo";
import { type PageBlock } from "@/lib/builder/types.d";

import { logger } from "@/lib/logging";
import {
  createBlockMutationSlice,
  type BlockMutationSlice,
} from "./blockMutationSlice";
import {
  createCampaignStructureSlice,
  type CampaignStructureSlice,
} from "./campaignStructureSlice";
import { createUISlice, type UISlice } from "./uiSlice";

type BaseState = UISlice & BlockMutationSlice & CampaignStructureSlice;

type Actions = {
  isSaving: boolean;
  lastSaved: string | null;
  setIsSaving: (isSaving: boolean) => void;
  setAsSaved: () => void;
};

export type BuilderState = BaseState & Actions;

const builderStoreCreator: StateCreator<BuilderState, [], []> = (set, get) => ({
  ...createUISlice(set, get, {} as any),
  ...createBlockMutationSlice(set, get, {} as any),
  ...createCampaignStructureSlice(set, get, {} as any),
  isSaving: false,
  lastSaved: null,
  setIsSaving: (isSaving: boolean) => set({ isSaving }),
  setAsSaved: () => {
    set({ lastSaved: new Date().toISOString() });
  },
});

const persistedCreator = persist(builderStoreCreator, {
  name: "convertikit-builder-store",
  storage: createJSONStorage(() => localStorage),
  partialize: (state: BuilderState) => ({
    campaignConfig: state.campaignConfig,
  }),
  onRehydrateStorage: () => (state, error) => {
    if (error) {
      logger.error("[Zustand] Fallo al rehidratar estado.", error);
    } else {
      logger.info("[Zustand] Estado rehidratado desde localStorage.");
    }
  },
});

export const useBuilderStore = createStoreWithHistory<BuilderState, []>(
  persistedCreator as StateCreator<BuilderState, [], []>,
  {
    create,
  }
);
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Errores Críticos**: ((Implementada)) La nueva arquitectura resuelve todos los errores de tipo y de build.
 *
 * @subsection Melhorias Futuras
 * 1. **Sincronización del Hook Consumidor**: ((Vigente)) El hook `useBuilderHeader` está desincronizado. Debe ser refactorizado para consumir la historia a través de `useBuilderStore.useHistory()`.
 *
 * =====================================================================
 */
// src/lib/builder/core/store.ts
