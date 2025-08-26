// src/components/workspaces/WorkspacePopoverContent.tsx
/**
 * @file WorkspacePopoverContent.tsx
 * @description Componente de ensamblaje soberano. Consume sus propias traducciones.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import React from "react";
import { Command, CommandSeparator } from "@/components/ui/command";
import { type Workspace } from "@/lib/data/workspaces";
import { useDashboardTranslations } from "@/lib/hooks/useDashboardTranslations";
import {
  WorkspaceActions,
  type WorkspaceActionsProps,
} from "./WorkspaceActions";
import { WorkspaceList } from "./WorkspaceList";

export interface WorkspacePopoverContentProps
  extends Omit<WorkspaceActionsProps, "texts"> {
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  onWorkspaceSelect: (workspaceId: string) => void;
}

export function WorkspacePopoverContent({
  workspaces,
  activeWorkspaceId,
  onWorkspaceSelect,
  ...actionProps
}: WorkspacePopoverContentProps) {
  const { tWorkspaces } = useDashboardTranslations();

  const listTexts = {
    searchPlaceholder: tWorkspaces("search_placeholder"),
    emptyResults: tWorkspaces("empty_results"),
  };
  const actionTexts = {
    create: tWorkspaces("createWorkspace_button"),
    invite: tWorkspaces("inviteMember_button"),
    rename: tWorkspaces("renameWorkspace_button"),
    settings: tWorkspaces("workspaceSettings_button"),
    delete: tWorkspaces("deleteWorkspace_button"),
  };

  return (
    <Command>
      <WorkspaceList
        workspaces={workspaces}
        activeWorkspaceId={activeWorkspaceId}
        onWorkspaceSelect={onWorkspaceSelect}
        texts={listTexts}
      />
      <CommandSeparator />
      <WorkspaceActions texts={actionTexts} {...actionProps} />
    </Command>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Soberanía de i18n:** Resuelve `TS2739`.
 * =====================================================================
 */
// src/components/workspaces/WorkspacePopoverContent.tsx
