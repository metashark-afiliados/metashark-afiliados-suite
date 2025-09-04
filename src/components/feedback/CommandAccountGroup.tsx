// src/components/feedback/CommandAccountGroup.tsx
/**
 * @file CommandAccountGroup.tsx
 * @description Componente atómico y puro para el grupo de comandos de Cuenta.
 * @author @author RaZ Podestá - MetaShark Tech
 * @version 1.0.0
 * @see .docs-espejo/components/feedback/CommandAccountGroup.tsx.md
 */
import React from "react";
import { type useTranslations } from "next-intl";
import { LayoutDashboard, LogOut, User } from "lucide-react";

import {
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { signOutAction } from "@/lib/actions/session.actions";

interface CommandAccountGroupProps {
  setPages: (page: "root" | "workspaces") => void;
  runCommand: (action: () => void, commandName: string) => void;
  t: ReturnType<typeof useTranslations>;
}

export function CommandAccountGroup({
  setPages,
  runCommand,
  t,
}: CommandAccountGroupProps): React.ReactElement {
  return (
    <>
      <CommandSeparator />
      <CommandGroup heading={t("workspaces_group_heading")}>
        <CommandItem
          onSelect={() => setPages("workspaces")}
          className="cursor-pointer"
        >
          <LayoutDashboard className="mr-2 h-4 w-4" />
          {t("search_workspaces_command")}
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading={t("account_group_heading")}>
        <CommandItem
          onSelect={() => runCommand(() => {}, t("my_profile_command_name"))}
          value={t("my_profile_command_value")}
          className="cursor-pointer"
        >
          <User className="mr-2 h-4 w-4" />
          <span>{t("my_profile")}</span>
        </CommandItem>
        <form action={signOutAction} className="w-full">
          <button type="submit" className="w-full text-left">
            <CommandItem
              onSelect={() => runCommand(() => {}, t("sign_out_command_name"))}
              value={t("sign_out_command_value")}
              className="cursor-pointer w-full"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t("sign_out")}</span>
            </CommandItem>
          </button>
        </form>
      </CommandGroup>
    </>
  );
}
// src/components/feedback/CommandAccountGroup.tsx
