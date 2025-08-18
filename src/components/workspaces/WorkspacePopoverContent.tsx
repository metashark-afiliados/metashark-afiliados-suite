// src/components/workspaces/WorkspacePopoverContent.tsx
/**
 * @file src/components/workspaces/WorkspacePopoverContent.tsx
 * @description Componente de presentación puro para el contenido del Popover.
 *              Ha sido refactorizado para usar un icono vectorial estándar
 *              en lugar de un emoji.
 * @author Raz Podestá
 * @version 2.0.0
 */
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Check, LayoutGrid } from "lucide-react";

import { useDashboard } from "@/lib/context/DashboardContext";
import { useWorkspaceContext } from "@/lib/hooks/use-workspace-context";
import { type Workspace } from "@/lib/data/workspaces";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { WorkspaceActions } from "./WorkspaceActions";

const WorkspaceItem = ({
  workspace,
  onSelect,
  isSelected,
}: {
  workspace: Workspace;
  onSelect: (workspace: Workspace) => void;
  isSelected: boolean;
}) => (
  <CommandItem
    key={workspace.id}
    onSelect={() => onSelect(workspace)}
    className="text-sm cursor-pointer"
    aria-label={workspace.name}
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

export function WorkspacePopoverContent() {
  const t = useTranslations("WorkspaceSwitcher");
  const { workspaces, activeWorkspace } = useDashboard();
  const {
    handleWorkspaceSelect,
    setPopoverOpen,
    setCreateDialogOpen,
    setInviteDialogOpen,
    setDeleteDialogOpen,
  } = useWorkspaceContext();

  const handleSelectCreate = () => {
    setPopoverOpen(false);
    setCreateDialogOpen(true);
  };

  const handleSelectInvite = () => {
    setPopoverOpen(false);
    setInviteDialogOpen(true);
  };

  const handleSelectDelete = () => {
    setPopoverOpen(false);
    setDeleteDialogOpen(true);
  };

  return (
    <Command>
      <CommandList>
        <CommandInput placeholder={t("search_placeholder")} />
        <CommandEmpty>{t("empty_results")}</CommandEmpty>
        <CommandGroup>
          {workspaces.map((workspace) => (
            <WorkspaceItem
              key={workspace.id}
              workspace={workspace}
              onSelect={() => handleWorkspaceSelect(workspace.id)}
              isSelected={activeWorkspace?.id === workspace.id}
            />
          ))}
        </CommandGroup>
      </CommandList>
      <CommandSeparator />
      <WorkspaceActions
        onSelectCreate={handleSelectCreate}
        onSelectInvite={handleSelectInvite}
        onSelectSettings={() => setPopoverOpen(false)}
        onSelectDelete={handleSelectDelete}
      />
    </Command>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Consistencia de Diseño**: ((Implementada)) Se ha reemplazado el emoji por un icono `LayoutGrid` estándar, mejorando la consistencia visual.
 *
 * =====================================================================
 */
// src/components/workspaces/WorkspacePopoverContent.tsx
