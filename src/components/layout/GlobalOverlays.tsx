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
  // NOTA: useDashboard solo es consumido por WelcomeModal. Si no hay sesión,
  // el hook lanzará un error controlado que será capturado por el ErrorBoundary
  // del layout, o el componente simplemente no se renderizará si no hay `profile`.
  // Para la landing page, donde no hay contexto, este hook no se ejecutará
  // si `WelcomeModal` no se renderiza.
  const { profile } = useDashboard() ?? { profile: null };
  clientLogger.trace("[GlobalOverlays] Renderizando orquestador de UI global.");

  return (
    <>
      {/* --- Flujo de Autenticación --- */}
      <AuthDialog />

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
 * 1. **Cohesión de UI (SRP)**: ((Implementada)) Este aparato agrupa todos los componentes de overlay, limpiando el `DashboardLayout` y creando un único lugar para gestionar estos elementos globales.
 * 2. **Renderizado Condicional Robusto**: ((Implementada)) Se ha añadido una verificación de `profile` para renderizar condicionalmente los diálogos de workspace y el modal de bienvenida. Esto asegura que el componente no cause errores en páginas públicas (como la landing page) donde el `DashboardContext` no está disponible.
 *
 * @subsection Melhorias Futuras
 * 1. **Carga Diferida de Componentes (`next/dynamic`)**: ((Vigente)) Para una optimización de élite del rendimiento inicial, cada componente dentro de `GlobalOverlays` podría ser importado dinámicamente.
 *
 * =====================================================================
 */
