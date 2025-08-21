// src/components/workspaces/WorkspacePopoverContent.tsx
import React from "react";

import { Command, CommandSeparator } from "@/components/ui/command";
import { type Workspace } from "@/lib/data/workspaces";
import {
  WorkspaceActions,
  type WorkspaceActionsProps,
} from "./WorkspaceActions";
import { WorkspaceList } from "./WorkspaceList";

/**
 * @public
 * @interface WorkspacePopoverContentProps
 * @description Contrato de props para el componente.
 */
export interface WorkspacePopoverContentProps extends WorkspaceActionsProps {
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  onWorkspaceSelect: (workspaceId: string) => void;
}

/**
 * @public
 * @component WorkspacePopoverContent
 * @description Componente de ensamblaje de élite. Su única responsabilidad
 *              es componer los aparatos atómicos `WorkspaceList` y
 *              `WorkspaceActions` para construir el contenido completo del popover.
 * @author Raz Podestá
 * @version 1.0.0
 */
export function WorkspacePopoverContent({
  workspaces,
  activeWorkspaceId,
  onWorkspaceSelect,
  ...actionProps
}: WorkspacePopoverContentProps) {
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

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Arquitectura de Ensamblaje (LEGO)**: ((Implementada)) Componente ensamblador puro que compone átomos, mejorando la legibilidad.
 * 2. **Principio de Responsabilidad Única (SRP)**: ((Implementada)) Su única responsabilidad es la composición del contenido del popover.
 *
 * =====================================================================
 */
// src/components/workspaces/WorkspacePopoverContent.tsx
