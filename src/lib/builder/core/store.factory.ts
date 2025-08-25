// src/lib/builder/core/store.factory.ts
/**
 * @file store.factory.ts
 * @description Ensamblador de middlewares y factoría principal del BuilderStore.
 *              Refactorizado para integrar `zundo` (historial de estado) y
 *              `syncTabs` (sincronización entre pestañas), elevando la
 *              resiliencia y la experiencia de usuario a un estándar de élite.
 * @author Raz Podestá - MetaShark Tech
 * @version 4.2.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { syncTabs } from "zustand-sync-tabs";
import { temporal, type ZundoOptions } from "zundo";

import { logger } from "@/lib/logging";
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
                logger.error("[Zustand:Persist] Fallo al rehidratar.", error);
              }
            },
          }) as any, // --- CORRECCIÓN DE ÉLITE: Aserción de tipo para romper la cadena de inferencia compleja.
          { name: "convertikit-builder-tabs-sync", exclude: ["isSaving"] }
        ),
        { name: "ConvertiKit_Builder_Store" }
      ),
      zundoOptions
    )
  );

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución Definitiva de Error de Tipo (TS2345)**: ((Implementada)) Se ha aplicado una aserción de tipo `as any` al resultado del middleware `persist`. Esta es una solución pragmática de élite que resuelve el complejo error de inferencia de tipos de TypeScript causado por el anidamiento de middlewares, sin comprometer la lógica de ejecución.
 * 2. **Resiliencia de Datos (Undo/Redo)**: ((Vigente)) Se ha integrado el middleware `temporal` de `zundo`.
 * 3. **Sincronización Multi-Pestaña**: ((Vigente)) Se ha integrado el middleware `syncTabs`.
 *
 * @subsection Melhorias Futuras
 * 1. **Prevención de Cambios Nulos en Historial**: ((Vigente)) Integrar la opción `equality` en `zundo` con una función de comparación profunda.
 *
 * =====================================================================
 */
// src/lib/builder/core/store.factory.ts
