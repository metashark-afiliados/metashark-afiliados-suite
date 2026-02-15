// src/lib/builder/core/store.types.ts
/**
 * @file store.types.ts
 * @description Contratos de datos y SSoT para el estado del Builder.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-25
 */
import { type BlockMutationSlice } from "./blockMutationSlice";
import { type CampaignStructureSlice } from "./campaignStructureSlice";
import { type createBuilderStore } from "./store.factory";
import { type ThemeSlice } from "./themeSlice";
import { type UISlice } from "./uiSlice";

export type BaseState = UISlice &
  BlockMutationSlice &
  CampaignStructureSlice &
  ThemeSlice;

export type Actions = {
  isSaving: boolean;
  lastSaved: string | null;
  setIsSaving: (isSaving: boolean) => void;
  setAsSaved: () => void;
};

export type BuilderState = BaseState & Actions;
export type BuilderStore = ReturnType<typeof createBuilderStore>;
export type TemporalStateSlice = Pick<BuilderState, "campaignConfig">;
// src/lib/builder/core/store.types.ts
