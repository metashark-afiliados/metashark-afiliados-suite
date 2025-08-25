// src/components/layout/GlobalOverlays.tsx
/**
 * @file GlobalOverlays.tsx
 * @description Componente de cliente atómico y puro. Su única responsabilidad es
 *              renderizar todos los componentes de UI globales que se superponen
 *              a la interfaz principal. Sincronizado para incluir el nuevo
 *              `TemplateGalleryModal`.
 * @author Raz Podestá
 * @version 4.0.0
 */
"use client";

import React from "react";

// --- INICIO DE SINCRONIZACIÓN ---
import { TemplateGalleryModal } from "@/components/builder/panels/TemplateGalleryModal";
// --- FIN DE SINCRONIZACIÓN ---
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
      <TemplateGalleryModal /> {/* <-- NUEVO APARATO INTEGRADO */}
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
 * 1. **Integración de Galería**: ((Implementada)) Al renderizar el `TemplateGalleryModal`, este orquestador ahora hace que la nueva funcionalidad de galería esté disponible en toda la aplicación, preparada para ser invocada.
 *
 * @subsection Melhorias Futuras
 * 1. **Renderizado Condicional por Ruta**: ((Vigente)) Para una optimización de élite, se podría usar el hook `usePathname` para renderizar ciertos overlays (como el `TemplateGalleryModal`) solo en las rutas donde son necesarios (ej. `/builder/[creationId]`), reduciendo el número de componentes montados en otras partes de la aplicación.
 *
 * =====================================================================
 */
// src/components/layout/GlobalOverlays.tsx
