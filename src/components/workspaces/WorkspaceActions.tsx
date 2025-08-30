// src/components/workspaces/WorkspaceActions.tsx
/**
 * @file src/components/workspaces/WorkspaceActions.tsx
 * @description Componente de presentación 100% puro y soberano. Ha sido
 *              refactorizado a un estándar de élite para ser autocontenido en
 *              su consumo de internacionalización, eliminando la prop `texts`
 *              y adhiriéndose al patrón de componente soberano.
 * @author Raz Podestá - MetaShark Tech
 * @version 5.0.0
 * @date 2025-08-29
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
import { useDashboardTranslations } from "@/lib/hooks/useDashboardTranslations";
import { clientLogger } from "@/lib/logging";

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
    "[WorkspaceActions] Renderizando componente de acciones soberano."
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
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **Renderizado Declarativo**: En lugar de bloques de JSX condicionales, las acciones podrían definirse en un array de configuración. Esto permitiría a la función `.map()` renderizarlos, haciendo el código más declarativo y fácil de extender.
 * 2. **Atajos de Teclado**: Integrar el componente `CommandShortcut` para mostrar atajos de teclado (ej. `⌘+N` para "Crear Workspace"), mejorando la accesibilidad y la productividad para usuarios avanzados.
 * 3. **Estado `disabled` Granular**: Añadir una prop `isPending: boolean` que deshabilite todas las acciones mientras una operación está en curso, proporcionando un feedback de UI más robusto.
 * 4. **Tooltips Explicativos**: Envolver cada `CommandItem` en un `Tooltip` para proporcionar una descripción más detallada de lo que hace cada acción, mejorando la usabilidad.
 * 5. **Abstracción `ActionItem`**: El patrón `CommandItem` con un icono y texto es altamente reutilizable. Podría ser abstraído a un componente `ActionItem` para reducir la duplicación de código.
 * 6. **Permisos a Nivel de Característica**: La lógica `canEdit` y `canDelete` podría ser expandida para manejar permisos más granulares (ej. `canInvite`, `canRename`) si el modelo de roles se vuelve más complejo.
 * =====================================================================
 */
// src/components/workspaces/WorkspaceActions.tsx
