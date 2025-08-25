// src/lib/builder/core/campaignStructureSlice.ts
/**
 * @file campaignStructureSlice.ts
 * @description Slice de Zustand atómico. Su única responsabilidad es gestionar
 *              las mutaciones ESTRUCTURALES del array de bloques de la campaña.
 *              Declarado como módulo de cliente por su dependencia de `@dnd-kit`.
 * @author Raz Podestá
 * @version 2.0.0
 */
"use client";

import { arrayMove } from "@dnd-kit/sortable";
import { type StateCreator } from "zustand";

import { initializeNewBlock } from "@/lib/builder/block-initializer.helper";
import { type CampaignConfig } from "@/lib/builder/types.d";
import { logger } from "@/lib/logging";

export interface CampaignStructureSlice {
  campaignConfig: CampaignConfig | null;
  setCampaignConfig: (config: CampaignConfig | null) => void;
  addBlock: (
    blockType: string,
    initialProvidedProps?: Record<string, unknown>
  ) => void;
  deleteBlock: (blockId: string) => void;
  moveBlock: (activeId: string, overId: string) => void;
  moveBlockByStep: (blockId: string, direction: "up" | "down") => void;
  duplicateBlock: (blockId: string) => void;
}

export const createCampaignStructureSlice: StateCreator<
  CampaignStructureSlice,
  [],
  [],
  CampaignStructureSlice
> = (set) => ({
  campaignConfig: null,

  setCampaignConfig: (config) => {
    logger.trace(
      "[CampaignStructureSlice] Configuración de campaña establecida.",
      {
        campaignId: config?.id,
      }
    );
    set({ campaignConfig: config });
  },

  addBlock: (blockType, initialProvidedProps = {}) =>
    set((state) => {
      logger.trace("[CampaignStructureSlice] Añadiendo nuevo bloque.", {
        blockType,
      });
      if (!state.campaignConfig) return {};

      const newBlock = initializeNewBlock(blockType, initialProvidedProps);
      if (!newBlock) return {};

      const newConfig = {
        ...state.campaignConfig,
        blocks: [...state.campaignConfig.blocks, newBlock],
      };
      return { campaignConfig: newConfig };
    }),

  deleteBlock: (blockId) =>
    set((state) => {
      logger.trace("[CampaignStructureSlice] Eliminando bloque.", { blockId });
      if (!state.campaignConfig) return {};
      const newConfig = {
        ...state.campaignConfig,
        blocks: state.campaignConfig.blocks.filter((b) => b.id !== blockId),
      };
      return { campaignConfig: newConfig };
    }),

  moveBlock: (activeId, overId) =>
    set((state) => {
      logger.trace("[CampaignStructureSlice] Moviendo bloque.", {
        activeId,
        overId,
      });
      if (!state.campaignConfig) return {};
      const oldIndex = state.campaignConfig.blocks.findIndex(
        (b) => b.id === activeId
      );
      const newIndex = state.campaignConfig.blocks.findIndex(
        (b) => b.id === overId
      );
      if (oldIndex === -1 || newIndex === -1) return {};
      const newConfig = {
        ...state.campaignConfig,
        blocks: arrayMove(state.campaignConfig.blocks, oldIndex, newIndex),
      };
      return { campaignConfig: newConfig };
    }),

  moveBlockByStep: (blockId, direction) =>
    set((state) => {
      logger.trace("[CampaignStructureSlice] Moviendo bloque por paso.", {
        blockId,
        direction,
      });
      if (!state.campaignConfig) return {};
      const { blocks } = state.campaignConfig;
      const index = blocks.findIndex((b) => b.id === blockId);
      if (index === -1) return {};
      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= blocks.length) return {};
      const newConfig = {
        ...state.campaignConfig,
        blocks: arrayMove(blocks, index, newIndex),
      };
      return { campaignConfig: newConfig };
    }),

  duplicateBlock: (blockId) =>
    set((state) => {
      logger.trace("[CampaignStructureSlice] Duplicando bloque.", { blockId });
      if (!state.campaignConfig) return {};
      const blockToDuplicate = state.campaignConfig.blocks.find(
        (b) => b.id === blockId
      );
      const blockIndex = state.campaignConfig.blocks.findIndex(
        (b) => b.id === blockId
      );
      if (!blockToDuplicate || blockIndex === -1) return {};

      const newBlock = initializeNewBlock(
        blockToDuplicate.type,
        blockToDuplicate.props
      );
      if (!newBlock) return {};

      newBlock.styles = { ...blockToDuplicate.styles };

      const newBlocks = [...state.campaignConfig.blocks];
      newBlocks.splice(blockIndex + 1, 0, newBlock);
      const newConfig = { ...state.campaignConfig, blocks: newBlocks };
      return { campaignConfig: newConfig };
    }),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de `TypeError`**: ((Implementada)) Se ha añadido la directiva `"use client"`, continuando con la resolución del fallo de renderizado del servidor.
 *
 * =====================================================================
 */
// src/lib/builder/core/campaignStructureSlice.ts
