// src/lib/builder/core/store.factory.ts
/**
 * @file store.factory.ts
 * @description Ensamblador de middlewares y factoría principal del BuilderStore.
 *              Esta es la SSoT que compone la lógica de estado pura con middlewares
 *              de élite para crear un store resiliente, observable y sincronizado.
 * @author L.I.A. Legacy
 * @version 5.0.0
 * @see .docs-espejo/lib/builder/core/store.factory.ts.md
 */
import { temporal, type ZundoOptions } from "zundo";
import { create } from "zustand";
import { syncTabs } from "zustand-sync-tabs";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import { logger } from "@/lib/logger";
import { finalCreator } from "./store.creator";
import { type BuilderState, type TemporalStateSlice } from "./store.types";

type Write<T, U> = Omit<T, keyof U> & U;
declare module "zustand/vanilla" {
  interface StoreMutators<S, A> {
    "zustand/temporal": Write<S, { temporal: A }>;
    "zustand/syncTabs": Write<S, {}>;
  }
}

const zundoOptions: ZundoOptions<BuilderState, TemporalStateSlice> = {
  partialize: (state) => ({ campaignConfig: state.campaignConfig }),
  limit: 100,
};

/**
 * @public
 * @function createBuilderStore
 * @description Factoría que crea la instancia completa del store de Zustand para el Builder.
 *              Ensambla la lógica de estado base con un pipeline de middlewares:
 *              1. `persist`: Guarda el estado en localStorage para prevenir pérdida de datos.
 *              2. `syncTabs`: Sincroniza el estado entre pestañas del navegador.
 *              3. `devtools`: Integra con Redux DevTools para depuración.
 *              4. `temporal` (zundo): Añade la funcionalidad de historial (undo/redo).
 * @returns Una instancia completa y lista para usar del `BuilderStore`.
 */
export const createBuilderStore = () =>
  create<BuilderState>()(
    temporal(
      devtools(
        syncTabs(
          persist(finalCreator, {
            name: "convertikit-builder-store",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
              campaignConfig: state.campaignConfig,
            }),
            onRehydrateStorage: () => (state, error) => {
              if (error) {
                // Corrección de la firma del logger para cumplir con la Directiva 1.1
                logger.error(
                  { err: error },
                  "[Zustand:Persist] Fallo al rehidratar el estado desde localStorage."
                );
              }
            },
          }) as any, // Aserción de tipo pragmática para resolver inferencia compleja de middlewares anidados.
          { name: "convertikit-builder-tabs-sync", exclude: ["isSaving"] }
        ),
        { name: "ConvertiKit_Builder_Store" }
      ),
      zundoOptions
    )
  );
// src/lib/builder/core/store.factory.ts
