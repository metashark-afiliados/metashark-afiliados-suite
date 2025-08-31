// src/components/workspaces/WorkspaceList.tsx
/**
 * @file src/components/workspaces/WorkspaceList.tsx
 * @description Componente de UI 100% puro y soberano. Ha sido refactorizado a
 *              un estándar de élite para ser autocontenido en su consumo de
 *              internacionalización.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 5.0.0
 */
"use client";

import React from "react";
import { Check, LayoutGrid } from "lucide-react";

import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { type Workspace } from "@/lib/data/workspaces";
import { useDashboardTranslations } from "@/lib/hooks/useDashboardTranslations";
import { clientLogger } from "@/lib/logging";
import { cn } from "@/lib/utils";

interface WorkspaceListProps {
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  onWorkspaceSelect: (workspaceId: string) => void;
}

/**
 * @public
 * @component WorkspaceList
 * @description Renderiza una lista buscable de workspaces dentro de un componente
 *              `Command`. Es un componente soberano que consume sus propias traducciones.
 * @param {WorkspaceListProps} props - Propiedades para configurar la lista.
 * @returns {React.ReactElement}
 */
export function WorkspaceList({
  workspaces,
  activeWorkspaceId,
  onWorkspaceSelect,
}: WorkspaceListProps): React.ReactElement {
  clientLogger.trace(
    "[WorkspaceList] Renderizando componente de lista soberano."
  );
  const { tWorkspaces } = useDashboardTranslations();

  return (
    <CommandList>
      <CommandInput placeholder={tWorkspaces("search_placeholder")} />
      <CommandEmpty>{tWorkspaces("empty_results")}</CommandEmpty>
      <CommandGroup>
        {(workspaces || []).map((workspace) => (
          <CommandItem
            key={workspace.id}
            onSelect={() => onWorkspaceSelect(workspace.id)}
            className="text-sm cursor-pointer"
            aria-label={workspace.name}
            aria-selected={activeWorkspaceId === workspace.id}
          >
            <LayoutGrid className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="truncate">{workspace.name}</span>
            <Check
              className={cn(
                "ml-auto h-4 w-4",
                activeWorkspaceId === workspace.id ? "opacity-100" : "opacity-0"
              )}
            />
          </CommandItem>
        ))}
      </CommandGroup>
    </CommandList>
  );
}
// src/components/workspaces/WorkspaceList.tsx
