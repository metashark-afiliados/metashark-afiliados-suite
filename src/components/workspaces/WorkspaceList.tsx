// src/components/workspaces/WorkspaceList.tsx
/**
 * @file WorkspaceList.tsx
 * @description Componente de UI atómico y puro. Su única responsabilidad es
 *              renderizar la lista buscable de workspaces dentro de un Command.
 * @author Raz Podestá
 * @version 1.0.0
 */
import React from "react";
import { useTranslations } from "next-intl";
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
}

const WorkspaceItem = ({
  workspace,
  onSelect,
  isSelected,
}: {
  workspace: Workspace;
  onSelect: () => void;
  isSelected: boolean;
}) => (
  <CommandItem
    onSelect={onSelect}
    className="text-sm cursor-pointer"
    aria-label={workspace.name}
    aria-selected={isSelected}
  >
    <LayoutGrid className="mr-2 h-4 w-4 text-muted-foreground" />
    <span className="truncate">{workspace.name}</span>
    <Check
      className={cn(
        "ml-auto h-4 w-4",
        isSelected ? "opacity-100" : "opacity-0"
      )}
    />
  </CommandItem>
);

export function WorkspaceList({
  workspaces,
  activeWorkspaceId,
  onWorkspaceSelect,
}: WorkspaceListProps) {
  const t = useTranslations("WorkspaceSwitcher");

  return (
    <CommandList>
      <CommandInput placeholder={t("search_placeholder")} />
      <CommandEmpty>{t("empty_results")}</CommandEmpty>
      <CommandGroup>
        {workspaces.map((workspace) => (
          <WorkspaceItem
            key={workspace.id}
            workspace={workspace}
            onSelect={() => onWorkspaceSelect(workspace.id)}
            isSelected={activeWorkspaceId === workspace.id}
          />
        ))}
      </CommandGroup>
    </CommandList>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Hiper-Atomicidad (SRP)**: ((Implementada)) Este componente ahora tiene la única responsabilidad de mostrar la lista de workspaces.
 *
 * =====================================================================
 */
// src/components/workspaces/WorkspaceList.tsx
