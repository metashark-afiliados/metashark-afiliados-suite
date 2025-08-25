// src/components/workspaces/WorkspaceList.tsx
/**
 * @file WorkspaceList.tsx
 * @description Componente de UI atómico que renderiza la lista de workspaces.
 *              Sincronizado para consumir el namespace de i18n canónico.
 * @author Raz Podestá
 * @version 1.1.0
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

// ... (resto del archivo sin cambios, la corrección es solo en la llamada a useTranslations)

export function WorkspaceList({
  workspaces,
  activeWorkspaceId,
  onWorkspaceSelect,
}: {
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  onWorkspaceSelect: (workspaceId: string) => void;
}) {
  // --- INICIO DE CORRECCIÓN DE I18N ---
  const t = useTranslations("components.workspaces.WorkspaceSwitcher");
  // --- FIN DE CORRECCIÓN DE I18N ---

  return (
    <CommandList>
      <CommandInput placeholder={t("search_placeholder")} />
      <CommandEmpty>{t("empty_results")}</CommandEmpty>
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
