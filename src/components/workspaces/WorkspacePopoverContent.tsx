// src/components/workspaces/WorkspacePopoverContent.tsx
/**
 * @file WorkspacePopoverContent.tsx
 * @description Componente de ensamblaje de élite. Compone los aparatos atómicos
 *              `WorkspaceList` y `WorkspaceActions` y les inyecta sus textos
 *              traducidos.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import React from "react";
import { type useTranslations } from "next-intl";

import { Command, CommandSeparator } from "@/components/ui/command";
import { type Workspace } from "@/lib/data/workspaces";
import { useDashboard } from "@/lib/context/DashboardContext";
import { useWorkspaceContext } from "@/lib/hooks/useWorkspaceContext.tsx";
import { useWorkspaceManager } from "@/lib/hooks/useWorkspaceManager";
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
  t: ReturnType<typeof useTranslations>;
}

export function WorkspacePopoverContent({
  workspaces,
  activeWorkspaceId,
  onWorkspaceSelect,
  t,
  ...actionProps
}: WorkspacePopoverContentProps) {
  const listTexts = {
    searchPlaceholder: t("search_placeholder"),
    emptyResults: t("empty_results"),
  };

  const actionTexts = {
    create: t("createWorkspace_button"),
    invite: t("inviteMember_button"),
    rename: t("renameWorkspace_button"),
    settings: t("workspaceSettings_button"),
    delete: t("deleteWorkspace_button"),
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
// src/components/workspaces/WorkspacePopoverContent.tsx
