// src/components/layout/GlobalOverlays.tsx
"use client";

import React from "react";

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

/**
 * @public
 * @component GlobalOverlays
 * @description Componente de cliente atómico y puro. Su única responsabilidad es
 *              renderizar todos los componentes de UI globales que se superponen
 *              a la interfaz principal (diálogos, widgets, etc.), basándose
 *              en el estado provisto por los contextos y stores correspondientes.
 * @returns {React.ReactElement} Un fragmento con todos los componentes de overlay.
 * @author Raz Podestá
 * @version 1.0.0
 */
export function GlobalOverlays() {
  const { profile } = useDashboard();

  return (
    <>
      {/* Diálogos de Gestión de Workspaces */}
      <CreateWorkspaceDialog />
      <InviteMemberDialog />
      <DeleteWorkspaceDialog />
      <RenameWorkspaceDialog />

      {/* Widgets Globales */}
      <LiaChatWidget />
      <CommandPalette />

      {/* Flujo de Onboarding */}
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
 * 1. **Cohesión de UI (SRP)**: ((Implementada)) Este aparato agrupa todos los componentes de overlay, limpiando el `DashboardLayout` y creando un único lugar para gestionar estos elementos globales, mejorando la organización del proyecto.
 * 2. **Renderizado Condicional Limpio**: ((Implementada)) La lógica para mostrar el `WelcomeModal` está contenida aquí, simplificando el componente de layout padre y adhiriéndose a la "Filosofía LEGO".
 *
 * @subsection Melhorias Futuras
 * 1. **Carga Diferida de Componentes (`next/dynamic`)**: ((Vigente)) Para una optimización de élite del rendimiento inicial de la página, cada componente dentro de `GlobalOverlays` podría ser importado dinámicamente. Esto aseguraría que el código JavaScript para un modal solo se cargue cuando el usuario intente abrirlo, reduciendo el tamaño del bundle inicial.
 *
 * =====================================================================
 */
// src/components/layout/GlobalOverlays.tsx
