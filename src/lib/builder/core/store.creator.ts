// src/lib/builder/core/store.creator.ts
/**
 * @file store.creator.ts
 * @description Lógica pura y atómica para la creación del estado del Builder.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-25
 */
import { type StateCreator } from "zustand";

import { createBlockMutationSlice } from "./blockMutationSlice";
import { createCampaignStructureSlice } from "./campaignStructureSlice";
import { createThemeSlice } from "./themeSlice";
import { createUISlice } from "./uiSlice";
import { type BaseState, type BuilderState } from "./store.types";

const baseCreator: StateCreator<BaseState, [], []> = (set, get, store) => ({
  ...createUISlice(set, get, store),
  ...createBlockMutationSlice(set, get, store),
  ...createCampaignStructureSlice(set, get, store),
  ...createThemeSlice(set, get, store),
});

export const finalCreator: StateCreator<BuilderState, [], []> = (
  set,
  get,
  store
) => ({
  ...baseCreator(set, get, store),
  isSaving: false,
  lastSaved: null,
  setIsSaving: (isSaving) => set({ isSaving }),
  setAsSaved: () => {
    const saveTime = new Date().toISOString();
    set({ lastSaved: saveTime });
  },
});
// src/lib/builder/core/store.creator.ts
