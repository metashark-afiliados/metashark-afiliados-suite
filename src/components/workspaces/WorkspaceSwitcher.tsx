// src/components/workspaces/WorkspaceSwitcher.tsx
/**
 * @file WorkspaceSwitcher.tsx
 * @description Orquestador de UI soberano. Ha sido simplificado para delegar
 *              el consumo de i18n a sus hijos soberanos y para componer la
 *              lógica de hooks con los componentes de UI puros.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 12.0.0
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
import { clientLogger } from "@/lib/logging";

/**
 * @private
 * @component WorkspaceSwitcherContent
 * @description Componente interno que consume los contextos y hooks para
 *              ensamblar la UI del selector de workspaces.
 * @returns {React.ReactElement}
 */
const WorkspaceSwitcherContent = () => {
  clientLogger.trace(
    "[WorkspaceSwitcherContent] Ensamblando lógica y UI del switcher."
  );
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

/**
 * @public
 * @component WorkspaceSwitcher
 * @description Orquesta el contexto y la UI para el selector de workspaces.
 * @returns {React.ReactElement | null}
 */
export function WorkspaceSwitcher(): React.ReactElement | null {
  const { activeWorkspace } = useDashboard();
  if (!activeWorkspace) {
    // En el flujo de onboarding, puede no haber un workspace activo todavía.
    return null;
  }
  return (
    <WorkspaceProvider>
      <WorkspaceSwitcherContent />
    </WorkspaceProvider>
  );
}
// src/components/workspaces/WorkspaceSwitcher.tsx
