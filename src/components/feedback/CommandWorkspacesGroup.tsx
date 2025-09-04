// src/components/feedback/CommandWorkspacesGroup.tsx
/**
 * @file CommandWorkspacesGroup.tsx
 * @description Componente atómico y puro para la sub-página de workspaces.
 * @author @author RaZ Podestá - MetaShark Tech
 * @version 1.0.0
 * @see .docs-espejo/components/feedback/CommandWorkspacesGroup.tsx.md
 */
import React from "react";
import { type useTranslations } from "next-intl";
import { Check, LayoutGrid } from "lucide-react";

import { CommandGroup, CommandItem } from "@/components/ui/command";
import { type Workspace } from "@/lib/data/workspaces";
import { cn } from "@/lib/utils";

interface CommandWorkspacesGroupProps {
  workspaces: Workspace[];
  search: string;
  activeWorkspaceId: string | null;
  handleWorkspaceSelect: (workspaceId: string) => void;
  t: ReturnType<typeof useTranslations>;
}

export function CommandWorkspacesGroup({
  workspaces,
  search,
  activeWorkspaceId,
  handleWorkspaceSelect,
  t,
}: CommandWorkspacesGroupProps): React.ReactElement {
  return (
    <CommandGroup heading={t("workspaces_group_heading")}>
      {workspaces
        .filter((ws) => ws.name.toLowerCase().includes(search.toLowerCase()))
        .map((ws) => (
          <CommandItem
            key={ws.id}
            onSelect={() => handleWorkspaceSelect(ws.id)}
            value={ws.name}
            disabled={ws.id === activeWorkspaceId}
            className="cursor-pointer"
          >
            <LayoutGrid className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="truncate">{ws.name}</span>
            <Check
              className={cn(
                "ml-auto h-4 w-4",
                activeWorkspaceId === ws.id ? "opacity-100" : "opacity-0"
              )}
            />
          </CommandItem>
        ))}
    </CommandGroup>
  );
}
// src/components/feedback/CommandWorkspacesGroup.tsx
