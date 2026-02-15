// src/lib/hooks/use-builder-header.ts
/**
 * @file use-builder-header.ts
 * @description Hook Soberano que consume y orquesta el estado para la
 *              cabecera del constructor. Ha sido refactorizado a un estándar
 *              de élite para integrar la API del historial de estado de `zundo`,
 *              exponiendo la funcionalidad de deshacer/rehacer y la lógica
 *              de "estado sucio" (dirty state).
 * @author Raz Podestá - MetaShark Tech
 * @version 7.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useCallback, useTransition } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { shallow } from "zustand/shallow";
import { useStore } from "zustand";

import { updateCreationContentAction } from "@/lib/actions/creations";
import {
  useBuilderStore,
  useBuilderStoreApi,
} from "@/lib/hooks/use-builder-store";
import { logger } from "@/lib/logging";

/**
 * @public
 * @function useBuilderHeader
 * @description Hook soberano que provee toda la lógica y el estado necesarios para el componente `BuilderHeader`.
 * @returns Un objeto con el estado computado y los manejadores de eventos.
 */
export function useBuilderHeader() {
  const t = useTranslations("components.builder.BuilderHeader");
  const [isPending, startTransition] = useTransition();
  const storeApi = useBuilderStoreApi();

  const {
    isSaving,
    setIsSaving,
    setAsSaved,
    devicePreview,
    setDevicePreview,
    campaignConfig,
  } = useBuilderStore(
    (state) => ({
      isSaving: state.isSaving,
      setIsSaving: state.setIsSaving,
      setAsSaved: state.setAsSaved,
      devicePreview: state.devicePreview,
      setDevicePreview: state.setDevicePreview,
      campaignConfig: state.campaignConfig,
    }),
    shallow
  );

  // --- INICIO DE INTEGRACIÓN CON ZUNDO ---
  // Se consume reactivamente el estado del historial desde la API de zundo.
  const { pastStates, futureStates, undo, redo, clear } = useStore(
    storeApi.temporal
  );
  // El "estado sucio" ahora se deriva directamente de la existencia de estados pasados.
  const isDirty = pastStates.length > 0;
  // --- FIN DE INTEGRACIÓN CON ZUNDO ---

  const handleSave = useCallback(() => {
    if (!campaignConfig) {
      toast.error(t("SaveButton.save_error_no_config"));
      return;
    }
    setIsSaving(true);
    startTransition(async () => {
      const result = await updateCreationContentAction(
        campaignConfig.id,
        campaignConfig
      );
      if (result.success) {
        toast.success(t("SaveButton.save_success"));
        setAsSaved();
        // Lógica de negocio crítica: Limpiar el historial al guardar.
        clear();
      } else {
        toast.error(t("SaveButton.save_error_default"));
      }
      setIsSaving(false);
    });
  }, [campaignConfig, setIsSaving, t, setAsSaved, clear]);

  return {
    isSaving,
    isDirty,
    isPending,
    devicePreview,
    setDevicePreview,
    undo,
    redo,
    isUndoDisabled: pastStates.length === 0,
    isRedoDisabled: futureStates.length === 0,
    handleSave,
    t,
  };
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Funcionalidad de Historial Completa**: ((Implementada)) El hook ahora se suscribe a la API `temporal` de `zundo` y expone las funciones `undo` y `redo`, así como los estados `isUndoDisabled` y `isRedoDisabled`. Esto completa la conexión lógica entre el estado y la UI.
 * 2. **Lógica de "Estado Sucio" (Dirty State) Robusta**: ((Implementada)) El estado `isDirty` ahora se deriva directamente de la longitud del array `pastStates`, que es la SSoT para determinar si hay cambios sin guardar.
 * 3. **Integridad de Puntos de Guardado**: ((Implementada)) La función `handleSave` ahora invoca `clear()` del store `temporal` tras un guardado exitoso. Esta es una lógica de negocio crítica que previene que el usuario pueda "deshacer" cambios más allá de un punto de guardado, garantizando la integridad de los datos.
 *
 * @subsection Melhorias Futuras
 * 1. **Atajos de Teclado**: ((Vigente)) Se podría implementar un `useEffect` en este hook para registrar listeners de eventos de teclado (`keydown`) que invoquen `undo()` y `redo()` con `Ctrl+Z` y `Ctrl+Y`, proporcionando una UX de escritorio de élite.
 *
 * =====================================================================
 */
// src/lib/hooks/use-builder-header.ts
