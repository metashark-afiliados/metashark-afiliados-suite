// src/components/workspaces/WorkspaceList.tsx
/**
 * @file src/components/workspaces/WorkspaceList.tsx
 * @description Componente de UI 100% puro y soberano. Ha sido refactorizado a
 *              un estándar de élite para ser autocontenido en su consumo de
 *              internacionalización, eliminando la prop `texts` y adhiriéndose
 *              al patrón de componente soberano.
 * @author Raz Podestá - MetaShark Tech
 * @version 4.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import React from "react";
import { Check, LayoutGrid } from "lucide-react";

import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { type Workspace } from "@/lib/data/workspaces";
import { useDashboardTranslations } from "@/lib/hooks/useDashboardTranslations";
import { clientLogger } from "@/lib/logging";
import { cn } from "@/lib/utils";

interface WorkspaceListProps {
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  onWorkspaceSelect: (workspaceId: string) => void;
}

/**
 * @public
 * @component WorkspaceList
 * @description Renderiza una lista buscable de workspaces dentro de un componente
 *              `Command`. Es un componente soberano que consume sus propias traducciones.
 * @param {WorkspaceListProps} props - Propiedades para configurar la lista.
 * @returns {React.ReactElement}
 */
export function WorkspaceList({
  workspaces,
  activeWorkspaceId,
  onWorkspaceSelect,
}: WorkspaceListProps): React.ReactElement {
  clientLogger.trace(
    "[WorkspaceList] Renderizando componente de lista soberano."
  );
  const { tWorkspaces } = useDashboardTranslations();

  return (
    <CommandList>
      <CommandInput placeholder={tWorkspaces("search_placeholder")} />
      <CommandEmpty>{tWorkspaces("empty_results")}</CommandEmpty>
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
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **Virtualización de Lista**: Para usuarios con cientos de workspaces, esta lista podría ser virtualizada utilizando `@tanstack/react-virtual` para garantizar un rendimiento de renderizado óptimo a cualquier escala.
 * 2. **Iconos de Workspace**: Cuando se reintroduzca la funcionalidad de iconos de workspace, el `LayoutGrid` debería ser reemplazado por el `workspace.icon` correspondiente, proporcionando una identificación visual más rica.
 * 3. **Feedback Visual de Búsqueda**: Mientras se escribe en `CommandInput`, se podría mostrar un sutil indicador de carga si la búsqueda fuera asíncrona.
 * 4. **Agrupación de Workspaces**: Para organizaciones grandes, se podría añadir una funcionalidad para agrupar workspaces (ej. por "Favoritos", "Recientes"), utilizando `CommandGroup` con diferentes `heading`.
 * 5. **Accesibilidad Mejorada**: El `aria-label` del `CommandItem` podría ser más descriptivo, ej. `"{workspace.name}, actualmente activo"` para el workspace seleccionado.
 * =====================================================================
 */
// src/components/workspaces/WorkspaceList.tsx
