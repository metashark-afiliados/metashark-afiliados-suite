// src/lib/builder/core/campaignStructureSlice.ts
/**
 * @file campaignStructureSlice.ts
 * @description Slice de Zustand atómico. Su única responsabilidad es gestionar
 *              las mutaciones ESTRUCTURALES del array de bloques de la campaña.
 *              Declarado como módulo de cliente por su dependencia de `@dnd-kit`.
 *              **Refactorizado para incluir la acción `updateCampaignName`**.
 * @author Raz Podestá
 * @version 3.0.0
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
  /**
   * @action updateCampaignName
   * @description Actualiza el nombre de la campaña en la configuración.
   * @param {string} newName - El nuevo nombre de la campaña.
   */
  updateCampaignName: (newName: string) => void; // <-- NUEVA ACCIÓN
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

  updateCampaignName: (newName) =>
    set((state) => {
      logger.trace("[CampaignStructureSlice] Actualizando nombre de campaña.", {
        oldName: state.campaignConfig?.name,
        newName,
      });
      if (!state.campaignConfig) return {};
      const newConfig = {
        ...state.campaignConfig,
        name: newName,
      };
      return { campaignConfig: newConfig };
    }),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Acción `updateCampaignName` (SRP)**: ((Implementada)) Se ha añadido la acción `updateCampaignName` al slice. Su única responsabilidad es modificar el nombre de la campaña, lo cual es una pieza fundamental para la edición en línea del título del constructor.
 * 2. **Full Observabilidad**: ((Implementada)) La nueva acción incluye `logger.trace` para registrar los cambios de nombre, mejorando la visibilidad del estado del store.
 * 3. **No Regresión**: ((Implementada)) Se ha mantenido toda la funcionalidad existente del slice, garantizando que no se introduzcan regresiones.
 *
 * @subsection Melhorias Futuras
 * 1. **Integración con Immer**: ((Vigente)) Para simplificar aún más la lógica de actualización inmutable, se podría integrar el middleware `immer` de Zustand. Esto permitiría escribir código de mutación más directo y legible para objetos anidados.
 *
 * =====================================================================
 */
