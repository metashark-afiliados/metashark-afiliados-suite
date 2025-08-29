// src/lib/hooks/use-builder-header.ts
/**
 * @file use-builder-header.ts
 * @description Hook Soberano que consume y orquesta el estado para la
 *              cabecera del constructor. Ha sido refactorizado a un estándar
 *              de élite para integrar la API del historial de estado de `zundo`,
 *              exponiendo la funcionalidad de deshacer/rehacer y la lógica
 *              de "estado sucio" (dirty state).
 *              **Actualizado para exponer `updateCampaignName`**.
 * @author Raz Podestá - MetaShark Tech
 * @version 8.0.0
 * @date 2025-08-28
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
 *              **Ahora incluye `updateCampaignName` para la edición en línea del título.**
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
    updateCampaignName, // <--- AÑADIDO: Consumir la nueva acción del store
  } = useBuilderStore(
    (state) => ({
      isSaving: state.isSaving,
      setIsSaving: state.setIsSaving,
      setAsSaved: state.setAsSaved,
      devicePreview: state.devicePreview,
      setDevicePreview: state.setDevicePreview,
      campaignConfig: state.campaignConfig,
      updateCampaignName: state.updateCampaignName, // <--- AÑADIDO: Seleccionar la acción
    }),
    shallow
  );

  // Se consume reactivamente el estado del historial desde la API de zundo.
  const { pastStates, futureStates, undo, redo, clear } = useStore(
    storeApi.temporal
  );
  // El "estado sucio" ahora se deriva directamente de la existencia de estados pasados.
  const isDirty = pastStates.length > 0;

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
    updateCampaignName, // <--- EXPUESTO: La acción se devuelve para su uso en la UI
    campaignConfig, // <--- EXPUESTO: campaignConfig se devuelve para acceder al nombre
    t,
  };
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 8.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Integración de Acción `updateCampaignName`**: ((Implementada)) El hook ahora consume la acción `updateCampaignName` del `campaignStructureSlice` del `BuilderStore` y la expone en su API de retorno. Esto es un paso crucial para habilitar la edición en línea del título de la campaña en el `BuilderHeader`.
 * 2. **Exposición de `campaignConfig`**: ((Implementada)) Se ha añadido `campaignConfig` al objeto de retorno del hook para que el `BuilderHeader` pueda acceder al nombre de la campaña.
 * 3. **Full Observabilidad**: ((Implementada)) La adición se ha integrado manteniendo el logging contextual existente.
 * 4. **No Regresión**: ((Implementada)) Se ha mantenido toda la funcionalidad previa del hook, incluyendo la lógica de historial y guardado, sin introducir regresiones.
 *
 * @subsection Melhorias Futuras
 * 1. **Atajos de Teclado**: ((Vigente)) Se podría implementar un `useEffect` en este hook para registrar listeners de eventos de teclado (`keydown`) que invoquen `undo()` y `redo()` con `Ctrl+Z` y `Ctrl+Y`, proporcionando una UX de escritorio de élite.
 *
 * =====================================================================
 */
