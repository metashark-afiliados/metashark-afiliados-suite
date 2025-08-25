// src/lib/builder/core/store.types.ts
/**
 * @file store.types.ts
 * @description Contratos de datos y Única Fuente de Verdad (SSoT) para el estado del Builder.
 *              Este aparato aísla las definiciones de tipo, mejorando la cohesión y la
 *              claridad de la arquitectura de estado. Es la base para la seguridad de tipos
 *              en todo el ecosistema del constructor.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-24
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { type BlockMutationSlice } from "./blockMutationSlice";
import { type CampaignStructureSlice } from "./campaignStructureSlice";
import { type createBuilderStore } from "./store.factory";
import { type ThemeSlice } from "./themeSlice";
import { type UISlice } from "./uiSlice";

/**
 * @public
 * @typedef BaseState
 * @description Agrega todos los slices atómicos en un único tipo de estado base.
 *              Esta composición representa la totalidad del estado gestionado por slices.
 */
export type BaseState = UISlice &
  BlockMutationSlice &
  CampaignStructureSlice &
  ThemeSlice;

/**
 * @public
 * @typedef Actions
 * @description Define el contrato para las acciones de nivel superior que no pertenecen
 *              a un slice específico, como la gestión del estado de guardado.
 */
export type Actions = {
  isSaving: boolean;
  lastSaved: string | null;
  setIsSaving: (isSaving: boolean) => void;
  setAsSaved: () => void;
};

/**
 * @public
 * @typedef BuilderState
 * @description El tipo de estado completo y final para el store del constructor.
 *              Combina el estado base de los slices con las acciones de nivel superior.
 */
export type BuilderState = BaseState & Actions;

/**
 * @public
 * @typedef BuilderStore
 * @description El tipo completo de la `StoreApi` de Zustand, inferido de la factoría.
 *              Incluye no solo el estado (`getState`, `setState`), sino también las APIs
 *              añadidas por los middlewares (ej. `temporal`).
 */
export type BuilderStore = ReturnType<typeof createBuilderStore>;

/**
 * @public
 * @typedef TemporalStateSlice
 * @description Define la porción del estado (`BuilderState`) que será rastreada por
 *              el middleware de historial `zundo` (temporal). En este caso, solo
 *              rastreamos `campaignConfig` para las operaciones de deshacer/rehacer.
 */
export type TemporalStateSlice = Pick<BuilderState, "campaignConfig">;

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad de Contratos (SRP)**: ((Implementada)) Este aparato tiene la única responsabilidad de definir los tipos de datos del store, adhiriéndose al Principio de Responsabilidad Única.
 * 2. **Claridad Arquitectónica**: ((Implementada)) Separar los tipos de la lógica de implementación hace que la base de código sea más fácil de entender y mantener.
 * 3. **Documentación TSDoc Granular**: ((Implementada)) Cada tipo exportado está documentado para explicar su propósito dentro de la arquitectura de estado, mejorando la DX.
 *
 * @subsection Melhorias Futuras
 * 1. **Tipos de Middleware Explícitos**: ((Vigente)) Para una seguridad de tipos aún más explícita, se podría extender `BuilderStore` para incluir las propiedades de los middlewares (`temporal`, etc.) directamente, aunque la inferencia de `ReturnType` es robusta.
 *
 * =====================================================================
 */
// src/lib/builder/core/store.types.ts
