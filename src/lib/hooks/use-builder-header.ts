// src/lib/hooks/use-builder-header.ts
/**
 * @file use-builder-header.ts
 * @description Hook Soberano para el `BuilderHeader`. Refactorizado para
 *              alinearse con la API canónica de `zustand-undo` (`useHistory`).
 * @author Raz Podestá
 * @version 5.0.0
 */
"use client";

import { useCallback, useTransition } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { shallow } from "zustand/shallow";

import { updateCampaignContentAction } from "@/lib/actions/builder.actions";
import { useBuilderStore } from "@/lib/builder/core/store";
import { type DevicePreview } from "@/lib/builder/core/uiSlice";

export function useBuilderHeader() {
  const t = useTranslations("components.builder.BuilderHeader");
  const [isPending, startTransition] = useTransition();

  const {
    isSaving,
    setIsSaving,
    setAsSaved,
    devicePreview,
    setDevicePreview,
    campaignConfig,
  } = useBuilderStore(
    (state: any) => ({
      isSaving: state.isSaving,
      setIsSaving: state.setIsSaving,
      setAsSaved: state.setAsSaved,
      devicePreview: state.devicePreview,
      setDevicePreview: state.setDevicePreview,
      campaignConfig: state.campaignConfig,
    }),
    shallow
  );

  const history = (useBuilderStore as any).useHistory();
  const isDirty = history.past.length > 0;

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
// src/lib/hooks/use-builder-header.ts
