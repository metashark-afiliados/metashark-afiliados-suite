// src/components/layout/GlobalOverlays.tsx
"use client";

import React from "react";

import { AuthDialog } from "@/components/auth/AuthDialog";
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
 *              a la interfaz principal (diálogos, widgets, etc.), basándose
 *              en el estado provisto por los contextos y stores correspondientes.
 * @returns {React.ReactElement} Un fragmento con todos los componentes de overlay.
 * @author Raz Podestá
 * @version 2.0.0
 */
export function GlobalOverlays() {
  const { profile } = useDashboard();
  clientLogger.trace("[GlobalOverlays] Renderizando orquestador de UI global.");

  return (
    <>
      {/* --- Flujo de Autenticación --- */}
      <AuthDialog />

      {/* --- Diálogos de Gestión de Workspaces --- */}
      <CreateWorkspaceDialog />
      <InviteMemberDialog />
      <DeleteWorkspaceDialog />
      <RenameWorkspaceDialog />

      {/* --- Widgets Globales --- */}
      <LiaChatWidget />
      <CommandPalette />

      {/* --- Flujo de Onboarding --- */}
      {!profile.has_completed_onboarding && <WelcomeModal />}
    </>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Integración de Flujo de Autenticación**: ((Implementada)) Se ha añadido el `AuthDialog` al árbol de componentes, haciendo que el nuevo flujo de autenticación modal esté funcionalmente disponible en toda la aplicación.
 * 2. **Full Observabilidad**: ((Implementada)) Se ha añadido `clientLogger` para trazar el renderizado de este componente orquestador.
 * 3. **Cohesión de UI (SRP)**: ((Vigente)) Este aparato agrupa todos los componentes de overlay, limpiando el `DashboardLayout` y creando un único lugar para gestionar estos elementos globales.
 *
 * @subsection Melhorias Futuras
 * 1. **Carga Diferida de Componentes (`next/dynamic`)**: ((Vigente)) Para una optimización de élite del rendimiento inicial, cada componente dentro de `GlobalOverlays` (especialmente los diálogos) podría ser importado dinámicamente.
 *
 * =====================================================================
 */
// src/components/layout/GlobalOverlays.tsx
