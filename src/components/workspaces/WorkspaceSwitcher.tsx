// src/components/workspaces/WorkspaceSwitcher.tsx
/**
 * @file WorkspaceSwitcher.tsx
 * @description Orquestador de UI soberano. Refactorizado para consumir la API
 *              de callbacks completa de `useWorkspaceManager` y propagarla a
 *              `WorkspacePopoverContent`, resolviendo el error de contrato TS2739.
 * @author L.I.A. Legacy
 * @version 16.0.0
 * @see .docs-espejo/components/workspaces/WorkspaceSwitcher.tsx.md
 */
"use client";

import React from "react";

import { CardSkeleton as Skeleton } from "@/components/ui/card";
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
import { useWorkspaceManager } from "@/lib/hooks/useWorkspaceManager";
import { clientLogger } from "@/lib/logger";
import { WorkspacePopoverContent } from "./WorkspacePopoverContent";
import { WorkspaceTrigger } from "./trigger";

const WorkspaceSwitcherSkeleton = (): React.ReactElement => (
  <div className="px-4 py-2">
    <Skeleton className="h-[40px] w-[220px] rounded-md" />
  </div>
);

const WorkspaceSwitcherContent = React.memo((): React.ReactElement => {
  clientLogger.trace(
    { component: "WorkspaceSwitcherContent" },
    "Renderizando contenido memoizado del switcher."
  );
  const { workspaces, activeWorkspace } = useDashboard();
  const { canEdit, canDelete } = useWorkspaceContext();

  const {
    popoverOpen,
    setPopoverOpen,
    handleWorkspaceSelect,
    ...actionHandlers
  } = useWorkspaceManager();

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <WorkspaceTrigger />
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
});
WorkspaceSwitcherContent.displayName = "WorkspaceSwitcherContent";

export function WorkspaceSwitcher(): React.ReactElement {
  const { activeWorkspace } = useDashboard();

  if (!activeWorkspace) {
    return <WorkspaceSwitcherSkeleton />;
  }

  return (
    <WorkspaceProvider>
      <WorkspaceSwitcherContent />
    </WorkspaceProvider>
  );
}
// src/components/workspaces/WorkspaceSwitcher.tsx
