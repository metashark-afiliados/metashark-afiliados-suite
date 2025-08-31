// src/components/workspaces/WorkspacePopoverContent.tsx
/**
 * @file src/components/workspaces/WorkspacePopoverContent.tsx
 * @description Componente de ensamblaje soberano y puro. Ha sido refactorizado
 *              para delegar la responsabilidad de la internacionalización a sus
 *              componentes hijos, eliminando el "prop drilling" de traducciones.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 5.0.0
 */
"use client";

import React from "react";

import { Command, CommandSeparator } from "@/components/ui/command";
import { type Workspace } from "@/lib/data/workspaces";
import { clientLogger } from "@/lib/logging";
import {
  WorkspaceActions,
  type WorkspaceActionsProps,
} from "./WorkspaceActions";
import { WorkspaceList } from "./WorkspaceList";

export interface WorkspacePopoverContentProps
  extends Omit<WorkspaceActionsProps, "t"> {
  // La prop 't' ya no es necesaria
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  onWorkspaceSelect: (workspaceId: string) => void;
}

/**
 * @public
 * @component WorkspacePopoverContent
 * @description Orquesta el layout del contenido del popover, ensamblando la
 *              lista de workspaces y el menú de acciones. Es un componente
 *              de composición puro.
 * @param {WorkspacePopoverContentProps} props - Propiedades para configurar el contenido.
 * @returns {React.ReactElement}
 */
export function WorkspacePopoverContent({
  workspaces,
  activeWorkspaceId,
  onWorkspaceSelect,
  ...actionProps
}: WorkspacePopoverContentProps): React.ReactElement {
  clientLogger.trace(
    "[WorkspacePopoverContent] Renderizando ensamblador de UI puro."
  );

  return (
    <Command>
      <WorkspaceList
        workspaces={workspaces}
        activeWorkspaceId={activeWorkspaceId}
        onWorkspaceSelect={onWorkspaceSelect}
      />
      <CommandSeparator />
      <WorkspaceActions {...actionProps} />
    </Command>
  );
}
// src/components/workspaces/WorkspacePopoverContent.tsx
