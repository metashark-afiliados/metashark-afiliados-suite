// src/lib/hooks/use-builder-header.ts
/**
 * @file use-builder-header.ts
 * @description Hook Soberano para el `BuilderHeader`. Actualizado para consumir
 *              el estado y las acciones del historial desde `useBuilderStore.useHistory()`.
 * @author Raz Podestá
 * @version 1.1.0
 */
"use client";

import { useTranslations } from "next-intl";
import { useCallback, useTransition } from "react";
import toast from "react-hot-toast";

import { builder as builderActions } from "@/lib/actions";
import { useBuilderStore } from "@/lib/builder/core/store";

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

  // --- INICIO DE CORRECCIÓN DE CONSUMO ---
  // El historial se consume a través del hook `useHistory` adjunto.
  const history = useBuilderStore.useHistory();
  const campaignConfig = useBuilderStore((state) => state.campaignConfig);
  // --- FIN DE CORRECCIÓN DE CONSUMO ---

  const handleSave = useCallback(() => {
    if (!campaignConfig) {
      toast.error(t("SaveButton.save_error_no_config"));
      return;
    }
    setIsSaving(true);
    startTransition(async () => {
      const result = await builderActions.updateCampaignContentAction(
        campaignConfig.id,
        campaignConfig
      );
      if (result.success) {
        toast.success(t("SaveButton.save_success"));
        setAsSaved();
        history.clear(); // Limpia el historial después de guardar.
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
 * 1. **Sincronización de API de Historial**: ((Implementada)) El hook ahora consume el historial a través de `useBuilderStore.useHistory()`, alineándose con la API canónica de `zustand-undo`.
 * 2. **Limpieza de Historial al Guardar**: ((Implementada)) Se ha añadido `history.clear()` al `handleSave`, una práctica de élite que asegura que después de guardar, el "deshacer" no revierta a un estado anterior al guardado.
 *
 * =====================================================================
 */
// src/lib/hooks/use-builder-header.ts
