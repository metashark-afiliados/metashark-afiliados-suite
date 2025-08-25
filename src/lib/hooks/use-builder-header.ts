// src/lib/hooks/use-builder-header.ts
/**
 * @file use-builder-header.ts
 * @description Hook Soberano. Sincronizado para consumir la Store API a través
 *              del nuevo hook `useBuilderStoreApi`, resolviendo el error de tipo TS2339.
 * @author Raz Podestá - MetaShark Tech
 * @version 6.1.0
 * @date 2025-08-24
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

export function useBuilderHeader() {
  const t = useTranslations("components.builder.BuilderHeader");
  const [isPending, startTransition] = useTransition();
  const storeApi = useBuilderStoreApi(); // <-- Se obtiene la Store API completa

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

  // Se consume el estado del historial reactivamente desde la API de zundo
  const { pastStates, futureStates, undo, redo, clear } = useStore(
    storeApi.temporal
  );
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
