// src/components/builder/BuilderHeader.tsx
/**
 * @file BuilderHeader.tsx
 * @description Orquestador de UI para la cabecera del constructor. Refactorizado
 *              para consumir el estado `isDirty` directamente desde el `useBuilderStore`
 *              resiliente, simplificando su lógica de estado interna.
 * @author Raz Podestá
 * @version 2.0.0
 */
"use client";

import React, { useCallback, useTransition } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { shallow } from "zustand/shallow";

import { builder as builderActions } from "@/lib/actions";
import { useBuilderStore } from "@/lib/builder/core/store";
import { logger } from "@/lib/logging";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DevicePreviewControls } from "./ui/DevicePreviewControls";
import { HistoryControls } from "./ui/HistoryControls";
import { SaveStatusButton } from "./ui/SaveStatusButton";

export function BuilderHeader(): React.ReactElement {
  const t = useTranslations("components.builder.BuilderHeader");
  const [isPending, startTransition] = useTransition();

  const {
    campaignConfig,
    isSaving,
    setIsSaving,
    isDirty,
    setAsSaved,
    devicePreview,
    setDevicePreview,
    pastStates,
    futureStates,
    undo,
    redo,
  } = useBuilderStore(
    (state) => ({
      campaignConfig: state.campaignConfig,
      isSaving: state.isSaving,
      setIsSaving: state.setIsSaving,
      isDirty: state.isDirty,
      setAsSaved: state.setAsSaved,
      devicePreview: state.devicePreview,
      setDevicePreview: state.setDevicePreview,
      pastStates: state.pastStates,
      futureStates: state.futureStates,
      undo: state.undo,
      redo: state.redo,
    }),
    shallow
  );

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
        setAsSaved(); // Marca el estado como guardado en el store
      } else {
        toast.error(result.error || t("SaveButton.save_error_default"));
      }
      setIsSaving(false);
    });
  }, [campaignConfig, setIsSaving, t, setAsSaved]);

  const isLoading = isSaving || isPending;

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-6 relative">
      <div className="w-1/3">
        <Button variant="outline" asChild>
          <Link href="/dashboard" aria-label={t("back_to_dashboard_aria")}>
            {t("back_to_dashboard")}
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-center gap-2">
        <HistoryControls
          undo={undo}
          redo={redo}
          isUndoDisabled={pastStates.length === 0}
          isRedoDisabled={futureStates.length === 0}
        />
        <Separator orientation="vertical" className="h-6 mx-2" />
        <DevicePreviewControls
          currentDevice={devicePreview}
          setDevice={setDevicePreview}
        />
      </div>

      <div className="flex w-1/3 items-center justify-end gap-2">
        <Button variant="ghost" aria-label={t("preview_aria")}>
          {t("preview_button")}
        </Button>
        <SaveStatusButton
          isDirty={isDirty}
          isLoading={isLoading}
          onSave={handleSave}
        />
      </div>
    </header>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Simplificación de Lógica**: ((Implementada)) Se ha eliminado toda la lógica de `useState` y `useEffect` para detectar cambios. El componente ahora consume `isDirty` directamente del `useBuilderStore`, adhiriéndose a un patrón de SSoT.
 * 2. **Sincronización de Estado**: ((Implementada)) La función `handleSave` ahora invoca `setAsSaved()` en el store tras un guardado exitoso, asegurando que toda la UI (Header, StatusBar) se actualice de forma consistente.
 *
 * =====================================================================
 */
// src/components/builder/BuilderHeader.tsx
