// src/components/layout/GlobalOverlays.tsx
"use client";

import React from "react";

// --- REFERENCIAS OBSOLETAS ELIMINADAS ---
// import { AuthDialog } from "@/components/auth/AuthDialog";
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

/**
 * @public
 * @component GlobalOverlays
 * @description Componente de cliente atómico y puro. Su única responsabilidad es
 *              renderizar todos los componentes de UI globales que se superponen
 *              a la interfaz principal. Sincronizado para eliminar el AuthDialog obsoleto.
 * @returns {React.ReactElement} Un fragmento con todos los componentes de overlay.
 * @author Raz Podestá
 * @version 3.0.0
 */
export function GlobalOverlays() {
  const { profile } = useDashboard() ?? { profile: null };
  clientLogger.trace("[GlobalOverlays] Renderizando orquestador de UI global.");

  return (
    <>
      {/* --- AuthDialog ha sido descomisionado --- */}
      {/* <AuthDialog /> */}

      {/* --- Diálogos de Gestión de Workspaces (Contexto de Dashboard) --- */}
      {profile && (
        <>
          <CreateWorkspaceDialog />
          <InviteMemberDialog />
          <DeleteWorkspaceDialog />
          <RenameWorkspaceDialog />
        </>
      )}

      {/* --- Widgets Globales --- */}
      <LiaChatWidget />
      <CommandPalette />

      {/* --- Flujo de Onboarding (Contexto de Dashboard) --- */}
      {profile && !profile.has_completed_onboarding && <WelcomeModal />}
    </>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización Arquitectónica**: ((Implementada)) Se ha eliminado la referencia al `AuthDialog` obsoleto, completando el proceso de descomisionamiento y resolviendo el error de compilación.
 *
 * =====================================================================
 */
