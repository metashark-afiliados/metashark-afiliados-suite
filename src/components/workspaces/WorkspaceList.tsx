// src/components/workspaces/WorkspaceList.tsx
/**
 * @file WorkspaceList.tsx
 * @description Componente de UI 100% puro. Recibe strings finales como props.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import React from "react";
import { Check, LayoutGrid } from "lucide-react";

import { type Workspace } from "@/lib/data/workspaces";
import { cn } from "@/lib/utils";
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface WorkspaceListProps {
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  onWorkspaceSelect: (workspaceId: string) => void;
  texts: {
    searchPlaceholder: string;
    emptyResults: string;
  };
}

export function WorkspaceList({
  workspaces,
  activeWorkspaceId,
  onWorkspaceSelect,
  texts,
}: WorkspaceListProps) {
  return (
    <CommandList>
      <CommandInput placeholder={texts.searchPlaceholder} />
      <CommandEmpty>{texts.emptyResults}</CommandEmpty>
      <CommandGroup>
        {workspaces.map((workspace) => (
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
