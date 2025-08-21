// src/lib/hooks/use-builder-header.ts
"use client";

import { useTranslations } from "next-intl";
import { useCallback, useTransition } from "react";
import toast from "react-hot-toast";

import { updateCampaignContentAction } from "@/lib/actions/builder.actions";
import { useBuilderStore } from "@/lib/builder/core/store";

/**
 * @file use-builder-header.ts
 * @description Hook Soberano para el `BuilderHeader`. Corregido para usar
 *              importaciones atómicas de Server Actions, resolviendo el error
 *              de build "server-only".
 * @author Raz Podestá
 * @version 1.2.0
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
 * 1. **Resolución de Error de Build**: ((Implementada)) Se ha reemplazado la importación del barril de acciones por una importación atómica y directa, resolviendo la causa raíz del fallo de compilación "server-only".
 * 2. **Sincronización de API de Historial**: ((Implementada)) El hook consume el historial a través de `useBuilderStore.useHistory()`, alineándose con la API canónica de `zustand-undo`.
 * 3. **Limpieza de Historial al Guardar**: ((Implementada)) Se ha añadido `history.clear()` al `handleSave`, una práctica de élite que asegura que después de guardar, el "deshacer" no revierta a un estado anterior al guardado.
 *
 * @subsection Melhorias Futuras
 * 1. **Manejo de Errores Granular**: ((Vigente)) Se podría mejorar el `toast.error` para mostrar mensajes más específicos basados en la clave de error devuelta por la Server Action.
 *
 * =====================================================================
 */
