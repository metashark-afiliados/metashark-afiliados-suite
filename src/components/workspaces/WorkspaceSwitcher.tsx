// src/components/workspaces/WorkspaceSwitcher.tsx
/**
 * @file WorkspaceSwitcher.tsx
 * @description Orquestador de UI soberano. Simplificado para delegar
 *              el consumo de i18n a sus hijos soberanos.
 * @author Raz Podestá - MetaShark Tech
 * @version 11.0.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDashboard } from "@/lib/context/DashboardContext";
import {
  useWorkspaceContext,
  WorkspaceProvider,
} from "@/lib/hooks/useWorkspaceContext.tsx";
import { useWorkspaceInlineEditor } from "@/lib/hooks/useWorkspaceInlineEditor";
import { useWorkspaceManager } from "@/lib/hooks/useWorkspaceManager";
import { WorkspacePopoverContent } from "./WorkspacePopoverContent";
import { WorkspaceTrigger } from "./WorkspaceTrigger";

const WorkspaceSwitcherContent = () => {
  const { workspaces, activeWorkspace } = useDashboard();
  const { canEdit, canDelete } = useWorkspaceContext();
  const {
    popoverOpen,
    setPopoverOpen,
    handleWorkspaceSelect,
    ...actionHandlers
  } = useWorkspaceManager();
  const inlineEditorHook = useWorkspaceInlineEditor();

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <WorkspaceTrigger hook={inlineEditorHook} />
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0">
        <WorkspacePopoverContent
          workspaces={workspaces}
          activeWorkspaceId={activeWorkspace!.id}
          onWorkspaceSelect={handleWorkspaceSelect}
          canEdit={canEdit}
          canDelete={canDelete}
          {...actionHandlers}
        />
      </PopoverContent>
    </Popover>
  );
};

export function WorkspaceSwitcher(): React.ReactElement | null {
  const { activeWorkspace } = useDashboard();
  if (!activeWorkspace) {
    return null;
  }
  return (
    <WorkspaceProvider>
      <WorkspaceSwitcherContent />
    </WorkspaceProvider>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Simplificación Radical (SRP):** El componente es ahora un ensamblador puro, libre de lógica de i18n.
 * =====================================================================
 */
// src/components/workspaces/WorkspaceSwitcher.tsx
