// src/components/feedback/CommandPaletteContent.tsx
import React from "react";
import { LayoutDashboard, LogOut, User, LayoutGrid } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { signOutAction } from "@/lib/actions/session.actions";
import { type FeatureModule } from "@/lib/data/modules";
import { type Workspace } from "@/lib/data/workspaces";

interface CommandPaletteContentProps {
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
}: CommandPaletteContentProps) {
  const t = useTranslations("CommandPalette");

  return (
    <CommandDialog open={isOpen} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder={t("search_placeholder")}
        value={search}
        onValueChange={onSearchChange}
      />
      <CommandList>
        <CommandEmpty>{t("empty_results")}</CommandEmpty>
        {pages === "root" && (
          <>
            <CommandGroup heading={t("navigation_group_heading")}>
              {mainNavLinks.map((link) => (
                <CommandItem
                  key={link.href}
                  onSelect={() => runCommand(() => {}, link.title)}
                  value={t("go_to", { title: link.title })}
                >
                  <DynamicIcon name={link.icon} className="mr-2 h-4 w-4" />
                  <span>{link.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading={t("workspaces_group_heading")}>
              <CommandItem onSelect={() => setPages("workspaces")}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                {t("search_workspaces_command")}
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading={t("account_group_heading")}>
              <CommandItem
                onSelect={() => runCommand(() => {}, t("my_profile_command_name"))}
                value={t("my_profile_command_value")}
              >
                <User className="mr-2 h-4 w-4" />
                <span>{t("my_profile")}</span>
              </CommandItem>
              <form action={signOutAction} className="w-full">
                <button type="submit" className="w-full text-left">
                  <CommandItem
                    onSelect={() => runCommand(() => {}, t("sign_out_command_name"))}
                    value={t("sign_out_command_value")}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t("sign_out")}</span>
                  </CommandItem>
                </button>
              </form>
            </CommandGroup>
          </>
        )}
        {pages === "workspaces" && (
          <CommandGroup heading={t("workspaces_group_heading")}>
            {workspaces
              .filter((ws) => ws.name.toLowerCase().includes(search.toLowerCase()))
              .map((ws) => (
                <CommandItem
                  key={ws.id}
                  onSelect={() => handleWorkspaceSelect(ws.id)}
                  value={ws.name}
                  disabled={ws.id === activeWorkspaceId}
                >
                  <LayoutGrid className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{ws.name}</span>
                </CommandItem>
              ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
