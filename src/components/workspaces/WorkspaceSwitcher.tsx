// src/components/workspaces/WorkspaceSwitcher.tsx
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
import { useWorkspaceManager } from "@/lib/hooks/useWorkspaceManager";
import { WorkspacePopoverContent } from "./WorkspacePopoverContent";
import { WorkspaceTrigger } from "./WorkspaceTrigger";

/**
 * @private
 * @component WorkspaceSwitcherContent
 * @description Componente de ensamblaje que conecta todos los hooks y componentes atómicos.
 */
const WorkspaceSwitcherContent = () => {
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
};

/**
 * @public
 * @component WorkspaceSwitcher
 * @description Orquestador de UI soberano y de élite. Ensambla el `WorkspaceProvider`
 *              y el `WorkspaceSwitcherContent` para construir el componente completo.
 * @author Raz Podestá
 * @version 4.0.0
 */
export function WorkspaceSwitcher(): React.ReactElement | null {
  const { activeWorkspace } = useDashboard();
  if (!activeWorkspace) {
    return null; // No renderizar nada si no hay workspace activo
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
 *
 * @subsection Melhorias Adicionadas
 * 1. **Arquitectura de Ensamblaje Pura**: ((Implementada)) El componente ahora es un ensamblador de alto nivel, adhiriéndose a la "Filosofía LEGO".
 *
 * @subsection Melhorias Futuras
 * 1. **Optimización de Renderizado**: ((Vigente)) Usar `React.memo` en `WorkspaceSwitcherContent` sigue siendo una optimización válida.
 *
 * =====================================================================
 */
// src/components/workspaces/WorkspaceSwitcher.tsx
