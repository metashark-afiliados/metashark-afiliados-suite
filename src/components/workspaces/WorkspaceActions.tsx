// src/components/workspaces/WorkspaceActions.tsx
/**
 * @file src/components/workspaces/WorkspaceActions.tsx
 * @description Componente de presentación 100% puro y soberano. Ha sido
 *              refactorizado a un estándar de élite para ser autocontenido en
 *              su consumo de internacionalización.
 * @author Raz Podestá - MetaShark Tech
 * @version 6.0.0
 */
"use client";

import { FileEdit, PlusCircle, Settings, Trash2, UserPlus } from "lucide-react";
import React from "react";

import {
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { useDashboardTranslations } from "@/lib/hooks/useDashboardTranslations";
import { clientLogger } from "@/lib/logger";

export interface WorkspaceActionsProps {
  canEdit: boolean;
  canDelete: boolean;
  onSelectCreate: () => void;
  onSelectInvite: () => void;
  onSelectRename: () => void;
  onSelectSettings: () => void;
  onSelectDelete: () => void;
}

/**
 * @public
 * @component WorkspaceActions
 * @description Renderiza el grupo de acciones disponibles para el workspace activo.
 *              Es un componente soberano que consume sus propias traducciones.
 * @param {WorkspaceActionsProps} props - Propiedades para configurar las acciones.
 * @returns {React.ReactElement}
 */
export function WorkspaceActions({
  canEdit,
  canDelete,
  onSelectCreate,
  onSelectInvite,
  onSelectRename,
  onSelectSettings,
  onSelectDelete,
}: WorkspaceActionsProps): React.ReactElement {
  clientLogger.trace(
    { component: "WorkspaceActions", canEdit, canDelete },
    "Renderizando componente de acciones soberano."
  );
  const { tWorkspaces } = useDashboardTranslations();

  return (
    <CommandGroup>
      <CommandItem onSelect={onSelectCreate} className="cursor-pointer">
        <PlusCircle className="mr-2 h-5 w-5" />
        {tWorkspaces("createWorkspace_button")}
      </CommandItem>
      {canEdit && (
        <>
          <CommandItem onSelect={onSelectInvite} className="cursor-pointer">
            <UserPlus className="mr-2 h-5 w-5" />
            {tWorkspaces("inviteMember_button")}
          </CommandItem>
          <CommandItem onSelect={onSelectRename} className="cursor-pointer">
            <FileEdit className="mr-2 h-5 w-5" />
            {tWorkspaces("renameWorkspace_button")}
          </CommandItem>
          <CommandItem onSelect={onSelectSettings} className="cursor-pointer">
            <Settings className="mr-2 h-5 w-5" />
            {tWorkspaces("workspaceSettings_button")}
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
            {tWorkspaces("deleteWorkspace_button")}
          </CommandItem>
        </>
      )}
    </CommandGroup>
  );
}
// src/components/workspaces/WorkspaceActions.tsx
