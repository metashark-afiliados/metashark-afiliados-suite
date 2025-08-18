// src/components/workspaces/WorkspaceActions.tsx
/**
 * @file src/components/workspaces/WorkspaceActions.tsx
 * @description Aparato de UI atómico que renderiza la lista de acciones de gestión.
 *              Ha sido nivelado para renderizar condicionalmente las acciones
 *              basado en los flags de permisos consumidos del `useWorkspaceContext`.
 * @author Raz Podestá
 * @version 1.2.0
 */
"use client";

import React from "react";
import { PlusCircle, Settings, Trash2, UserPlus } from "lucide-react";

import { useWorkspaceContext } from "@/lib/hooks/use-workspace-context";
import { useTypedTranslations } from "@/lib/i18n/hooks";
import {
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";

interface WorkspaceActionsProps {
  onSelectCreate: () => void;
  onSelectInvite: () => void;
  onSelectSettings: () => void;
  onSelectDelete: () => void;
}

export function WorkspaceActions({
  onSelectCreate,
  onSelectInvite,
  onSelectSettings,
  onSelectDelete,
}: WorkspaceActionsProps): React.ReactElement {
  const t = useTypedTranslations("WorkspaceSwitcher");
  const { canEdit, canDelete } = useWorkspaceContext(); // <-- CONSUMIR FLAGS

  return (
    <CommandGroup>
      <CommandItem onSelect={onSelectCreate} className="cursor-pointer">
        <PlusCircle className="mr-2 h-5 w-5" />
        {t("createWorkspace_button")}
      </CommandItem>
      {/* --- LÓGICA DE PERMISOS DE ÉLITE --- */}
      {canEdit && (
        <>
          <CommandItem onSelect={onSelectInvite} className="cursor-pointer">
            <UserPlus className="mr-2 h-5 w-5" />
            {t("inviteMember_button")}
          </CommandItem>
          <CommandItem onSelect={onSelectSettings} className="cursor-pointer">
            <Settings className="mr-2 h-5 w-5" />
            {t("workspaceSettings_button")}
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
            {t("deleteWorkspace_button")}
          </CommandItem>
        </>
      )}
    </CommandGroup>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **UI Consciente de Permisos Granulares**: ((Implementada)) Las acciones "Invitar", "Ajustes" y "Eliminar" ahora se renderizan condicionalmente basado en los flags `canEdit` y `canDelete`, siguiendo el principio de "mínimo privilegio" en la UI.
 *
 * @subsection Melhorias Futuras
 * 1. **Tooltips de Permiso Denegado**: ((Vigente)) Para acciones deshabilitadas en lugar de ocultas, se podría envolver el `CommandItem` en un `Tooltip` que explique por qué la acción no está disponible (ej. "Solo los propietarios pueden eliminar").
 *
 * =====================================================================
 */
// src/components/workspaces/WorkspaceActions.tsx
