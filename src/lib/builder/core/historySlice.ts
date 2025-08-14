// src/lib/builder/core/historySlice.ts
/**
 * @file historySlice.ts
 * @description Slice de Zustand que gestiona el historial de cambios (undo/redo).
 *              Las acciones `undo` y `redo` devuelven el estado de campaña
 *              relevante, permitiendo que el orquestador principal centralice
 *              la lógica de actualización de estado.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { type StateCreator } from "zustand";

import { type CampaignConfig } from "@/lib/builder/types.d";
import { logger } from "@/lib/logging";
import { type BuilderState } from "./store";

/**
 * @public
 * @interface HistoryState
 * @description Define la estructura del estado del historial.
 */
export interface HistoryState {
  pastStates: CampaignConfig[];
  futureStates: CampaignConfig[];
}

/**
 * @public
 * @interface HistoryActions
 * @description Define las acciones que se pueden realizar sobre el estado del historial.
 */
export interface HistoryActions {
  addStateToHistory: (currentState: CampaignConfig) => void;
  undo: () => CampaignConfig | undefined;
  redo: () => CampaignConfig | undefined;
  clearHistory: () => void;
}

export type HistorySlice = HistoryState & HistoryActions;

/**
 * @public
 * @function createHistorySlice
 * @description Factoría que crea el slice de Zustand para la gestión del historial.
 * @param {StateCreator} set - La función `set` de Zustand.
 * @param {StateCreator} get - La función `get` de Zustand para leer el estado actual.
 * @returns {HistorySlice} El objeto del slice.
 */
export const createHistorySlice: StateCreator<
  BuilderState,
  [],
  [],
  HistorySlice
> = (set, get) => ({
  pastStates: [],
  futureStates: [],

  addStateToHistory: (currentState) =>
    set((state) => {
      logger.trace("[HistorySlice] Añadiendo estado al historial.");
      return {
        pastStates: [...state.pastStates, currentState],
        futureStates: [], // Limpiar el historial futuro al añadir un nuevo estado
      };
    }),

  undo: () => {
    const { pastStates, futureStates, campaignConfig } = get();
    if (pastStates.length === 0) {
      logger.warn("[HistorySlice] Undo invocado sin estados pasados.");
      return undefined;
    }

    const previousState = pastStates[pastStates.length - 1];
    const newPastStates = pastStates.slice(0, pastStates.length - 1);

    set({
      pastStates: newPastStates,
      futureStates: [campaignConfig!, ...futureStates],
    });

    logger.trace("[HistorySlice] Undo realizado. Devolviendo estado previo.");
    return previousState;
  },

  redo: () => {
    const { pastStates, futureStates, campaignConfig } = get();
    if (futureStates.length === 0) {
      logger.warn("[HistorySlice] Redo invocado sin estados futuros.");
      return undefined;
    }

    const nextState = futureStates[0];
    const newFutureStates = futureStates.slice(1);

    set({
      pastStates: [...pastStates, campaignConfig!],
      futureStates: newFutureStates,
    });

    logger.trace(
      "[HistorySlice] Redo realizado. Devolviendo estado siguiente."
    );
    return nextState;
  },

  clearHistory: () => {
    logger.trace("[HistorySlice] Limpiando historial de cambios.");
    set({ pastStates: [], futureStates: [] });
  },
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Lógica Centralizada (SRP)**: ((Implementada)) Las funciones `undo` y `redo` son las únicas responsables de manipular los arrays de historial y devuelven el estado relevante.
 * 2. **Full Observabilidad**: ((Implementada)) Todas las acciones del historial están instrumentadas con `logger`, proporcionando una visibilidad completa sobre esta funcionalidad crítica.
 * 3. **Cero Regresiones**: ((Implementada)) La lógica es una migración fiel y mejorada del snapshot original.
 *
 * @subsection Melhorias Futuras
 * 1. **Límites de Historial**: ((Vigente)) Implementar una lógica para limitar el tamaño del array `pastStates` para prevenir un consumo excesivo de memoria en sesiones de edición muy largas.
 *
 * =====================================================================
 */
// src/lib/builder/core/historySlice.ts
