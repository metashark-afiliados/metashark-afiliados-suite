// src/lib/builder/core/blockMutationSlice.ts
/**
 * @file blockMutationSlice.ts
 * @description Slice de Zustand atómico para mutaciones de bloques.
 *              Refactorizado para utilizar el `clientLogger` canónico con su
 *              firma correcta, resolviendo el error de tipo TS2345.
 * @author L.I.A. Legacy
 * @version 2.0.0
 */
import { type CampaignConfig } from "@/lib/builder/types.d";
import { clientLogger } from "@/lib/logger";
import { type StateCreator } from "zustand";

export interface BlockMutationSlice {
  campaignConfig: CampaignConfig | null;
  updateBlockProp: (blockId: string, propName: string, value: unknown) => void;
  updateBlockStyle: (blockId: string, styleName: string, value: string) => void;
}

export const createBlockMutationSlice: StateCreator<
  BlockMutationSlice,
  [],
  [],
  BlockMutationSlice
> = (set) => ({
  campaignConfig: null,

  updateBlockProp: (blockId, propName, value) =>
    set((state) => {
      clientLogger.trace(
        "[BlockMutationSlice] Actualizando propiedad de bloque.",
        { blockId, propName, newValue: value }
      );
      if (!state.campaignConfig) return {};
      const newConfig = {
        ...state.campaignConfig,
        blocks: state.campaignConfig.blocks.map((block) =>
          block.id === blockId
            ? { ...block, props: { ...block.props, [propName]: value } }
            : block
        ),
      };
      return { campaignConfig: newConfig };
    }),

  updateBlockStyle: (blockId, styleName, value) =>
    set((state) => {
      clientLogger.trace(
        "[BlockMutationSlice] Actualizando estilo de bloque.",
        {
          blockId,
          styleName,
          newValue: value,
        }
      );
      if (!state.campaignConfig) return {};
      const newConfig = {
        ...state.campaignConfig,
        blocks: state.campaignConfig.blocks.map((block) =>
          block.id === blockId
            ? { ...block, styles: { ...block.styles, [styleName]: value } }
            : block
        ),
      };
      return { campaignConfig: newConfig };
    }),
});
// src/lib/builder/core/blockMutationSlice.ts
