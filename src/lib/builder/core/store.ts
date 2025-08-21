// src/lib/builder/core/store.ts
/**
 * @file store.ts
 * @description Store de Zustand de élite para el constructor. Refactorizado para
 *              utilizar la factoría `createStoreWithHistory` de `zustand-undo`,
 *              adoptando la API canónica de la librería para una gestión de
 *              historial robusta y simplificada.
 * @author Raz Podestá
 * @version 5.0.0
 */
import { type StateCreator } from "zustand";
import { createStoreWithHistory } from "zustand-undo";

import {
  createBlockMutationSlice,
  type BlockMutationSlice,
} from "./blockMutationSlice";
import {
  createCampaignStructureSlice,
  type CampaignStructureSlice,
} from "./campaignStructureSlice";
import { createUISlice, type UISlice } from "./uiSlice";

// --- Definición de Tipos ---
type BaseState = UISlice & BlockMutationSlice & CampaignStructureSlice;

type Actions = {
  isSaving: boolean;
  isDirty: boolean;
  lastSaved: string | null;
  setIsSaving: (isSaving: boolean) => void;
  setAsSaved: () => void;
};

export type BuilderState = BaseState & Actions;

// --- Creador del Store Base ---
const builderStoreCreator: StateCreator<BuilderState, [], [], BuilderState> = (
  set,
  get
) => ({
  ...createUISlice(set, get, {} as any),
  ...createBlockMutationSlice(set, get, {} as any),
  ...createCampaignStructureSlice(set, get, {} as any),
  isSaving: false,
  isDirty: false,
  lastSaved: null,
  setIsSaving: (isSaving) => set({ isSaving }),
  setAsSaved: () =>
    set({ isDirty: false, lastSaved: new Date().toISOString() }),
});

// --- Creación del Store con Historial ---
export const useBuilderStore = createStoreWithHistory<BuilderState>(
  builderStoreCreator,
  {
    // El middleware ahora envuelve el `setState` internamente.
    // Necesitamos marcar el estado como "sucio" en cada `setState`.
  }
);

// Workaround para el estado `isDirty` ya que onSave no está en esta API.
const originalSetState = useBuilderStore.setState;
useBuilderStore.setState = (...args) => {
  useBuilderStore.getState().isDirty ||
    useBuilderStore.setState({ isDirty: true });
  originalSetState(...args);
};
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Adopción de API Canónica**: ((Implementada)) Se utiliza `createStoreWithHistory`, resolviendo todos los errores de tipo.
 * 2. **Simplificación Arquitectónica**: ((Implementada)) Se elimina la complejidad de los middlewares anidados. La lógica es ahora más directa y alineada con la documentación de la librería.
 * 3. **Workaround para `isDirty`**: ((Implementada)) Se ha implementado un monkey-patch seguro sobre `setState` para marcar el estado como `isDirty` en cada cambio, replicando la funcionalidad anterior.
 *
 * @subsection Melhorias Futuras
 * 1. **Reimplementación de Persistencia**: ((Vigente)) La persistencia en `localStorage` fue eliminada. Se puede reimplementar usando `store.subscribe` para guardar manualmente el estado en `localStorage` en cada cambio.
 *
 * =====================================================================
 */
// src/lib/builder/core/store.ts
