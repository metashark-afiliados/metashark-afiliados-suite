// src/components/workspaces/WorkspaceActions.tsx
/**
 * @file WorkspaceActions.tsx
 * @description Componente de presentación 100% puro que renderiza las acciones de
 *              gestión de un workspace. Es completamente agnóstico al estado,
 *              recibiendo los flags de permisos y los callbacks a través de props.
 * @author Raz Podestá
 * @version 2.0.0
 */
import { FileEdit, PlusCircle, Settings, Trash2, UserPlus } from "lucide-react";
import React from "react";

import {
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { useTypedTranslations } from "@/lib/i18n/hooks";

export interface WorkspaceActionsProps {
  canEdit: boolean;
  canDelete: boolean;
  onSelectCreate: () => void;
  onSelectInvite: () => void;
  onSelectRename: () => void;
  onSelectSettings: () => void;
  onSelectDelete: () => void;
}

export function WorkspaceActions({
  canEdit,
  canDelete,
  onSelectCreate,
  onSelectInvite,
  onSelectRename,
  onSelectSettings,
  onSelectDelete,
}: WorkspaceActionsProps): React.ReactElement {
  const t = useTypedTranslations("WorkspaceSwitcher");

  return (
    <CommandGroup>
      <CommandItem onSelect={onSelectCreate} className="cursor-pointer">
        <PlusCircle className="mr-2 h-5 w-5" />
        {t("createWorkspace_button")}
      </CommandItem>
      {canEdit && (
        <>
          <CommandItem onSelect={onSelectInvite} className="cursor-pointer">
            <UserPlus className="mr-2 h-5 w-5" />
            {t("inviteMember_button")}
          </CommandItem>
          <CommandItem onSelect={onSelectRename} className="cursor-pointer">
            <FileEdit className="mr-2 h-5 w-5" />
            {t("renameWorkspace_button")}
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
 * 1. **Componente Puro y Desacoplado**: ((Implementada)) Se ha eliminado la dependencia del `useWorkspaceContext`. El componente es ahora 100% controlado por props, lo que aumenta su reutilización y testabilidad.
 * 2. **Funcionalidad Extendida**: ((Implementada)) Se ha añadido la opción "Renombrar" (`onSelectRename`), completando el conjunto de acciones de gestión.
 *
 * @subsection Melhorias Futuras
 * 1. **Renderizado Declarativo**: ((Vigente)) La lista de acciones podría ser definida como un array de objetos de configuración, permitiendo que el componente se renderice a través de un `.map()` para un código más declarativo.
 *
 * =====================================================================
 */
// src/components/workspaces/WorkspaceActions.tsx
