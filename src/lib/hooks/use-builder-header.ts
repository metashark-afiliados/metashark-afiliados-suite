// src/lib/hooks/use-builder-header.ts
/**
 * @file use-builder-header.ts
 * @description Hook Soberano que encapsula toda la lógica de estado y negocio
 *              para el componente `BuilderHeader`. Consume el store de Zustand,
 *              gestiona el historial de acciones y orquesta la invocación de
 *              la Server Action para guardar el contenido de la campaña.
 * @author Raz Podestá
 * @version 2.0.0
 */
"use client";

import { useCallback, useTransition } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

import { updateCampaignContentAction } from "@/lib/actions/builder.actions";
import { useBuilderStore } from "@/lib/builder/core/store";

/**
 * @public
 * @function useBuilderHeader
 * @description Orquesta el estado y las acciones para la cabecera del constructor.
 *              Provee a la UI de todos los datos y callbacks necesarios,
 *              manteniendo el componente de presentación (`BuilderHeader`)
 *              completamente desacoplado de la lógica de negocio.
 * @returns {{
 *   isSaving: boolean;
 *   isDirty: boolean;
 *   isPending: boolean;
 *   devicePreview: import('@/lib/builder/core/uiSlice').DevicePreview;
 *   setDevicePreview: (device: import('@/lib/builder/core/uiSlice').DevicePreview) => void;
 *   undo: () => void;
 *   redo: () => void;
 *   isUndoDisabled: boolean;
 *   isRedoDisabled: boolean;
 *   handleSave: () => void;
 *   t: ReturnType<typeof useTranslations>;
 * }} La API completa para el componente `BuilderHeader`.
 */
export function useBuilderHeader() {
  const t = useTranslations("components.builder.BuilderHeader");
  const [isPending, startTransition] = useTransition();

  const {
    isSaving,
    setIsSaving,
    isDirty,
    setAsSaved,
    setDevicePreview,
    devicePreview,
  } = useBuilderStore();

  const history = useBuilderStore.useHistory();
  const campaignConfig = useBuilderStore((state) => state.campaignConfig);

  const handleSave = useCallback(() => {
    if (!campaignConfig) {
      toast.error(t("SaveButton.save_error_no_config"));
      return;
    }
    setIsSaving(true);
    startTransition(async () => {
      const result = await updateCampaignContentAction(
        campaignConfig.id,
        campaignConfig
      );
      if (result.success) {
        toast.success(t("SaveButton.save_success"));
        setAsSaved();
        history.clear();
      } else {
        toast.error(result.error || t("SaveButton.save_error_default"));
      }
      setIsSaving(false);
    });
  }, [campaignConfig, setIsSaving, t, setAsSaved, history]);

  return {
    isSaving,
    isDirty,
    isPending,
    devicePreview,
    setDevicePreview,
    undo: history.undo,
    redo: history.redo,
    isUndoDisabled: history.past.length === 0,
    isRedoDisabled: history.future.length === 0,
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
 * 1. **Resolución de Error de Build**: ((Implementada)) Se ha reemplazado la importación del barrel file de acciones por una importación atómica y directa de `updateCampaignContentAction`, resolviendo la causa raíz del fallo de compilación "server-only".
 * 2. **Sincronización de API de Historial**: ((Implementada)) El hook consume el historial a través de `useBuilderStore.useHistory()`, alineándose con la API canónica de `zustand-undo` y garantizando la funcionalidad de deshacer/rehacer.
 * 3. **Limpieza de Historial al Guardar**: ((Implementada)) Se invoca `history.clear()` en el `handleSave`, una práctica de élite que asegura que después de guardar, el "deshacer" no revierta a un estado anterior al guardado.
 *
 * @subsection Melhorias Futuras
 * 1. **Manejo de Errores Granular**: ((Vigente)) Se podría mejorar el `toast.error` para mostrar mensajes más específicos basados en la clave de error devuelta por la Server Action, en lugar de un mensaje por defecto.
 *
 * =====================================================================
 */
