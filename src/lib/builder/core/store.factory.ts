// src/lib/builder/core/store.factory.ts
/**
 * @file store.factory.ts
 * @description Ensamblador de middlewares y factoría principal del BuilderStore.
 *              Utiliza una composición anidada canónica y "module augmentation"
 *              para una inferencia de tipos de élite y 100% robusta. Esta es la
 *              Única Fuente de Verdad para la creación del store.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.1.0
 * @date 2025-08-24
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { syncTabs } from "zustand-sync-tabs";
import { temporal, type ZundoOptions } from "zundo";

import { logger } from "@/lib/logging";
import { finalCreator } from "./store.creator";
import { type BuilderState, type TemporalStateSlice } from "./store.types";

/**
 * @private
 * @description Aumentación de módulo para TypeScript. Enseña al compilador sobre
 *              las nuevas "firmas" que los middlewares `temporal` y `syncTabs`
 *              añaden a la `StoreApi` de Zustand. Esto es CRÍTICO para resolver
 *              errores de inferencia de tipos.
 */
type Write<T, U> = Omit<T, keyof U> & U;
declare module "zustand/vanilla" {
  // eslint-disable-next-line no-unused-vars
  interface StoreMutators<S, A> {
    "zustand/temporal": Write<S, { temporal: A }>;
    "zustand/syncTabs": Write<S, {}>;
  }
}

/**
 * @private
 * @constant zundoOptions
 * @description Configuración para el middleware de historial `zundo`.
 */
const zundoOptions: ZundoOptions<BuilderState, TemporalStateSlice> = {
  partialize: (state) => ({ campaignConfig: state.campaignConfig }),
};

/**
 * @public
 * @function createBuilderStore
 * @description Crea una nueva instancia del store del constructor, aplicando
 *              una cadena de middlewares en el orden canónico:
 *              `persist` -> `syncTabs` -> `devtools` -> `temporal`.
 * @returns La `StoreApi` completa del builder, con todos los middlewares aplicados.
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
                logger.error("[Zustand:Persist] Fallo al rehidratar.", error);
              }
            },
          }),
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
 * 1. **Resolución Definitiva de Errores de Tipo**: ((Implementada)) La combinación de "module augmentation" y el consumo del `finalCreator` resuelve el error `TS2345`, garantizando la estabilidad de la arquitectura de estado.
 * 2. **Consolidación de SSoT**: ((Implementada)) Este archivo es ahora la Única Fuente de Verdad para la creación del store.
 * 3. **Documentación TSDoc Granular**: ((Implementada)) Se ha documentado el propósito de cada pieza, incluyendo el bloque `declare module`, para máxima claridad.
 *
 * @subsection Melhorias Futuras
 * 1. **Abstracción de Middlewares**: ((Vigente)) La cadena de middlewares podría ser abstraída a una función `applyBuilderMiddlewares(creator)` para una mayor reutilización si se necesitaran múltiples stores con la misma configuración.
 * 2. **Opciones de `zundo` Avanzadas**: ((Vigente)) Explorar opciones como `equality` para optimizar cuándo se crea un nuevo estado en el historial, o `coolOff` para agrupar cambios rápidos.
 *
 * =====================================================================
 */
// src/lib/builder/core/store.factory.ts
