// src/components/layout/GlobalOverlays.tsx
/**
 * @file GlobalOverlays.tsx
 * @description Componente de cliente atómico y puro. Su única responsabilidad es
 *              renderizar todos los componentes de UI globales. Sincronizado
 *              para implementar la lógica de renderizado condicional del
 *              `WelcomeModal` para el flujo de "Onboarding Implícito".
 * @author Raz Podestá - MetaShark Tech
 * @version 5.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
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
      {/* Diálogos de Gestión de Workspaces (Contexto de Dashboard) */}
      {profile && (
        <>
          <CreateWorkspaceDialog />
          <InviteMemberDialog />
          <DeleteWorkspaceDialog />
          <RenameWorkspaceDialog />
        </>
      )}

      {/* Widgets y Modales Globales */}
      <LiaChatWidget />
      <CommandPalette />
      <TemplateGalleryModal />

      {/* Flujo de Onboarding (Renderizado Condicional) */}
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
 * 1. ((Implementada)) Implementación de Onboarding Implícito: El componente ahora renderiza el `WelcomeModal` condicionalmente, completando la implementación del flujo de onboarding y la arquitectura v8.1.
 * 2. ((Implementada)) Desacoplamiento de Lógica: La lógica de renderizado condicional reside en este orquestador, manteniendo los componentes `DashboardLayout` (servidor) y `WelcomeModal` (cliente) puros y desacoplados.
 * 3. ((Implementada)) Componente Puro y Sin Estado: El componente no utiliza `useState`, su renderizado es una función pura de los datos del contexto, lo que lo hace predecible y performante.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) Renderizado Condicional por Ruta: Para una optimización de élite, se podría usar el hook `usePathname` para renderizar ciertos overlays (como el `TemplateGalleryModal`) solo en las rutas donde son necesarios, reduciendo la huella de componentes en páginas irrelevantes.
 *
 * =====================================================================
 */
