// src/components/workspaces/WorkspacePopoverContent.tsx
/**
 * @file src/components/workspaces/WorkspacePopoverContent.tsx
 * @description Componente de ensamblaje soberano y puro. Ha sido refactorizado
 *              para delegar la responsabilidad de la internacionalización a sus
 *              componentes hijos, eliminando el "prop drilling" de traducciones.
 * @author Raz Podestá - MetaShark Tech
 * @version 5.0.0
 */
"use client";

import React from "react";

import { Command, CommandSeparator } from "@/components/ui/command";
import { type Workspace } from "@/lib/data/workspaces";
import { clientLogger } from "@/lib/logger";
import {
  WorkspaceActions,
  type WorkspaceActionsProps,
} from "./WorkspaceActions";
import { WorkspaceList } from "./WorkspaceList";

export interface WorkspacePopoverContentProps extends WorkspaceActionsProps {
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
    { component: "WorkspacePopoverContent" },
    "Renderizando ensamblador de UI puro."
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
