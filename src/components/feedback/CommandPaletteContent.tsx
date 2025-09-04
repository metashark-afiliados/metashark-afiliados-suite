// src/components/feedback/CommandPaletteContent.tsx
/**
 * @file CommandPaletteContent.tsx
 * @description Ensamblador de UI puro para la Paleta de Comandos. Compone los
 *              grupos de comandos atómicos.
 * @author @author RaZ Podestá - MetaShark Tech
 * @version 4.0.0
 * @see .docs-espejo/components/feedback/CommandPaletteContent.tsx.md
 */
import React from "react";
import { type useTranslations } from "next-intl";

import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { type FeatureModule } from "@/lib/data/modules";
import { type Workspace } from "@/lib/data/workspaces";
import { CommandAccountGroup } from "./CommandAccountGroup";
import { CommandAssistantGroup } from "./CommandAssistantGroup";
import { CommandNavigationGroup } from "./CommandNavigationGroup";
import { CommandWorkspacesGroup } from "./CommandWorkspacesGroup";

export interface CommandPaletteContentProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  search: string;
  onSearchChange: (search: string) => void;
  pages: "root" | "workspaces";
  setPages: (page: "root" | "workspaces") => void;
  mainNavLinks: FeatureModule[];
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  runCommand: (action: () => void, commandName: string) => void;
  handleWorkspaceSelect: (workspaceId: string) => void;
  handleOpenLiaChat: () => void;
  t: ReturnType<typeof useTranslations>;
}

export function CommandPaletteContent({
  isOpen,
  onOpenChange,
  search,
  onSearchChange,
  pages,
  setPages,
  mainNavLinks,
  workspaces,
  activeWorkspaceId,
  runCommand,
  handleWorkspaceSelect,
  handleOpenLiaChat,
  t,
}: CommandPaletteContentProps) {
  return (
    <CommandDialog open={isOpen} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder={t("search_placeholder")}
        value={search}
        onValueChange={onSearchChange}
      />
      <CommandList>
        <CommandEmpty>{t("empty_results")}</CommandEmpty>
        {pages === "root" ? (
          <>
            <CommandNavigationGroup
              mainNavLinks={mainNavLinks}
              runCommand={runCommand}
              t={t}
            />
            <CommandAssistantGroup
              handleOpenLiaChat={handleOpenLiaChat}
              runCommand={runCommand}
              t={t}
            />
            <CommandAccountGroup
              setPages={setPages}
              runCommand={runCommand}
              t={t}
            />
          </>
        ) : (
          <CommandWorkspacesGroup
            workspaces={workspaces}
            search={search}
            activeWorkspaceId={activeWorkspaceId}
            handleWorkspaceSelect={handleWorkspaceSelect}
            t={t}
          />
        )}
      </CommandList>
    </CommandDialog>
  );
}
// src/components/feedback/CommandPaletteContent.tsx
