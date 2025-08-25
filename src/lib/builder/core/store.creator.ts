// src/lib/builder/core/store.creator.ts
/**
 * @file store.creator.ts
 * @description Lógica pura y atómica para la creación del estado del Builder.
 *              Implementa el patrón de "Creador Atómico" para una composición
 *              de slices robusta y tipo-segura. Es la SSoT para la lógica de
 *              composición de estado, desacoplada de los middlewares.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-24
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { type StateCreator } from "zustand";

import { createBlockMutationSlice } from "./blockMutationSlice";
import { createCampaignStructureSlice } from "./campaignStructureSlice";
import { createThemeSlice } from "./themeSlice";
import { createUISlice } from "./uiSlice";
import { type BaseState, type BuilderState } from "./store.types";

/**
 * @private
 * @constant baseCreator
 * @description Un `StateCreator` que ensambla todos los slices de lógica
 *              atómicos en un único estado base. Sigue la "Filosofía LEGO",
 *              permitiendo añadir o quitar slices fácilmente.
 * @param {StateCreator} set - La función `set` de Zustand.
 * @param {StateCreator} get - La función `get` de Zustand.
 * @param {StoreApi} store - La API del store de Zustand.
 * @returns {BaseState} El estado base compuesto.
 */
const baseCreator: StateCreator<BaseState, [], []> = (set, get, store) => ({
  ...createUISlice(set, get, store),
  ...createBlockMutationSlice(set, get, store),
  ...createCampaignStructureSlice(set, get, store),
  ...createThemeSlice(set, get, store),
});

/**
 * @public
 * @constant finalCreator
 * @description El `StateCreator` final y completo. Toma el estado base y
 *              le añade las propiedades de estado de nivel superior que no
 *              pertenecen a ningún slice específico (ej. `isSaving`).
 *              Este es el creador que se pasa a la factoría de middlewares.
 * @param {StateCreator} set - La función `set` de Zustand.
 * @param {StateCreator} get - La función `get` de Zustand.
 * @param {StoreApi} store - La API del store de Zustand.
 * @returns {BuilderState} El estado completo listo para ser usado.
 */
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

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad de Lógica (SRP)**: ((Implementada)) Este nuevo aparato tiene la única responsabilidad de componer los slices de estado, separando la "definición del estado" de la "creación de la instancia del store".
 * 2. **Legibilidad y Mantenibilidad**: ((Implementada)) La estructura de `baseCreator` y `finalCreator` hace que la composición del estado sea explícita, clara y fácil de extender con nuevos slices en el futuro.
 * 3. **Documentación TSDoc Granular**: ((Implementada)) Cada creador está documentado para explicar su rol en la arquitectura de composición.
 *
 * @subsection Melhorias Futuras
 * 1. **Factoría de Creadores**: ((Vigente)) Si la aplicación tuviera múltiples stores que comparten slices, se podría crear una función de orden superior que genere `baseCreator` basándose en un array de slices pasados como argumento.
 *
 * =====================================================================
 */
// src/lib/builder/core/store.creator.ts
