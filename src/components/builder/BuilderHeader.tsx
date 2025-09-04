// src/components/builder/BuilderHeader.tsx
/**
 * @file BuilderHeader.tsx
 * @description Orquestador de UI para la cabecera del constructor. Refactorizado
 *              para usar el `clientLogger` con la firma correcta.
 * @author L.I.A. Legacy
 * @version 4.0.0
 */
"use client";

import React from "react";

import { EditableText } from "@/components/builder/ui/EditableText";
import { useBuilderHeader } from "@/lib/hooks/use-builder-header";
import { clientLogger } from "@/lib/logger";
import { HeaderActions, HeaderControls, HeaderNavigation } from "./header";

export function BuilderHeader(): React.ReactElement {
  const {
    isSaving,
    isDirty,
    isPending,
    devicePreview,
    setDevicePreview,
    undo,
    redo,
    isUndoDisabled,
    isRedoDisabled,
    handleSave,
    updateCampaignName,
    campaignConfig,
    t,
  } = useBuilderHeader();

  const isLoading = isSaving || isPending;
  clientLogger.trace("[BuilderHeader] Renderizando cabecera.", {
    isDirty,
    isLoading,
    canUndo: !isUndoDisabled,
    canRedo: !isRedoDisabled,
    campaignName: campaignConfig?.name,
  });

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-6 relative">
      <HeaderNavigation t={t} />
      <div className="flex-1 flex items-center justify-center">
        <EditableText
          tag="h2"
          value={campaignConfig?.name || t("empty_campaign_name_placeholder")}
          onSave={updateCampaignName}
          className="text-lg font-semibold truncate px-2 py-1 rounded-md hover:bg-muted cursor-pointer"
          placeholder={t("empty_campaign_name_placeholder")}
        />
      </div>
      <HeaderControls
        undo={undo}
        redo={redo}
        isUndoDisabled={isUndoDisabled}
        isRedoDisabled={isRedoDisabled}
        currentDevice={devicePreview}
        setDevice={setDevicePreview}
      />
      <HeaderActions
        isDirty={isDirty}
        isLoading={isLoading}
        onSave={handleSave}
        t={t}
      />
    </header>
  );
}
// src/components/builder/BuilderHeader.tsx
