// src/components/layout/GlobalOverlays.tsx
/**
 * @file GlobalOverlays.tsx
 * @description Componente de cliente atómico y puro. Revertido para eliminar
 *              la dependencia del `AuthDialog` obsoleto.
 * @author Raz Podestá - MetaShark Tech
 * @version 7.0.0
 * @date 2025-08-31
 */
"use client";

import React from "react";

import { TemplateGalleryModal } from "@/components/builder/panels/TemplateGalleryModal";
import { CommandPalette } from "@/components/feedback/CommandPalette";
import { LiaChatWidget } from "@/components/feedback/LiaChatWidget";
import { WelcomeModal } from "@/components/onboarding/WelcomeModal";
import {
  CreateWorkspaceDialog,
  DeleteWorkspaceDialog,
  InviteMemberDialog,
  RenameWorkspaceDialog,
} from "@/components/workspaces/dialogs";
import { useDashboard } from "@/lib/context/DashboardContext";
import { clientLogger } from "@/lib/logging";

export function GlobalOverlays() {
  const { profile } = useDashboard() ?? { profile: null };
  clientLogger.trace("[GlobalOverlays] Renderizando orquestador de UI global.");

  return (
    <>
      {/* Widgets y Modales Globales */}
      <LiaChatWidget />
      <CommandPalette />

      {/* Overlays Específicos del Dashboard (requieren `profile`) */}
      {profile && (
        <>
          <CreateWorkspaceDialog />
          <InviteMemberDialog />
          <DeleteWorkspaceDialog />
          <RenameWorkspaceDialog />
          <TemplateGalleryModal />
          {!profile.has_completed_onboarding && <WelcomeModal />}
        </>
      )}
    </>
  );
}
// src/components/layout/GlobalOverlays.tsx
