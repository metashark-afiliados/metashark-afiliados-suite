// src/lib/builder/core/blockMutationSlice.ts
/**
 * @file blockMutationSlice.ts
 * @description Slice de Zustand atómico. Su única responsabilidad es gestionar
 *              las mutaciones de datos DENTRO de un bloque existente, como
 *              actualizar sus propiedades (`props`) y estilos (`styles`).
 * @author Raz Podestá
 * @version 1.0.0
 */
import { type StateCreator } from "zustand";
import { type CampaignConfig } from "@/lib/builder/types.d";
import { logger } from "@/lib/logging";

/**
 * @public
 * @interface BlockMutationSlice
 * @description Define el contrato de estado y acciones para este slice.
 */
export interface BlockMutationSlice {
  campaignConfig: CampaignConfig | null;
  updateBlockProp: (blockId: string, propName: string, value: unknown) => void;
  updateBlockStyle: (blockId: string, styleName: string, value: string) => void;
}

/**
 * @public
 * @function createBlockMutationSlice
 * @description Factoría que crea el slice de Zustand para las mutaciones de bloques.
 * @param {StateCreator} set - La función `set` de Zustand para actualizar el estado.
 * @returns {BlockMutationSlice} El objeto del slice.
 */
export const createBlockMutationSlice: StateCreator<
  BlockMutationSlice,
  [],
  [],
  BlockMutationSlice
> = (set) => ({
  campaignConfig: null, // Será sobreescrito por el store principal que lo ensamble.

  updateBlockProp: (blockId, propName, value) =>
    set((state) => {
      logger.trace("[BlockMutationSlice] Actualizando propiedad de bloque.", {
        blockId,
        propName,
        newValue: value,
      });
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
      logger.trace("[BlockMutationSlice] Actualizando estilo de bloque.", {
        blockId,
        styleName,
        newValue: value,
      });
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

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Lógica (SRP)**: ((Implementada)) Este slice encapsula perfectamente una única responsabilidad: la mutación de datos internos de un bloque. Es una pieza de lógica pura y reutilizable.
 * 2. **Full Observabilidad**: ((Implementada)) Cada acción de mutación ahora registra un evento `trace` con contexto detallado, proporcionando una visibilidad completa del flujo de estado del constructor.
 * 3. **Cero Regresiones**: ((Implementada)) La lógica de actualización inmutable se ha preservado fielmente del snapshot original.
 *
 * @subsection Melhorias Futuras
 * 1. **Integración con Immer**: ((Vigente)) Para simplificar aún más la lógica de actualización inmutable, se podría integrar el middleware `immer` de Zustand. Esto permitiría escribir código de mutación más directo y legible (ej. `state.campaignConfig.blocks[index].props[propName] = value;`).
 *
 * =====================================================================
 */
// src/lib/builder/core/blockMutationSlice.ts
