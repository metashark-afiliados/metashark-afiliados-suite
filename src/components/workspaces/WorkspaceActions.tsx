// src/components/workspaces/WorkspaceActions.tsx
/**
 * @file WorkspaceActions.tsx
 * @description Componente de presentación 100% puro.
 * @author Raz Podestá - MetaShark Tech
 * @version 4.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { FileEdit, PlusCircle, Settings, Trash2, UserPlus } from "lucide-react";

import {
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";

export interface WorkspaceActionsProps {
  texts: {
    create: string;
    invite: string;
    rename: string;
    settings: string;
    delete: string;
  };
  canEdit: boolean;
  canDelete: boolean;
  onSelectCreate: () => void;
  onSelectInvite: () => void;
  onSelectRename: () => void;
  onSelectSettings: () => void;
  onSelectDelete: () => void;
}

export function WorkspaceActions({
  texts,
  canEdit,
  canDelete,
  onSelectCreate,
  onSelectInvite,
  onSelectRename,
  onSelectSettings,
  onSelectDelete,
}: WorkspaceActionsProps): React.ReactElement {
  return (
    <CommandGroup>
      <CommandItem onSelect={onSelectCreate} className="cursor-pointer">
        <PlusCircle className="mr-2 h-5 w-5" />
        {texts.create}
      </CommandItem>
      {canEdit && (
        <>
          <CommandItem onSelect={onSelectInvite} className="cursor-pointer">
            <UserPlus className="mr-2 h-5 w-5" />
            {texts.invite}
          </CommandItem>
          <CommandItem onSelect={onSelectRename} className="cursor-pointer">
            <FileEdit className="mr-2 h-5 w-5" />
            {texts.rename}
          </CommandItem>
          <CommandItem onSelect={onSelectSettings} className="cursor-pointer">
            <Settings className="mr-2 h-5 w-5" />
            {texts.settings}
          </CommandItem>
        </>
      )}
      {canDelete && (
        <>
          <CommandSeparator />
          <CommandItem
            onSelect={onSelectDelete}
            className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
          >
            <Trash2 className="mr-2 h-5 w-5" />
            {texts.delete}
          </CommandItem>
        </>
      )}
    </CommandGroup>
  );
}
// src/components/workspaces/WorkspaceActions.tsx
