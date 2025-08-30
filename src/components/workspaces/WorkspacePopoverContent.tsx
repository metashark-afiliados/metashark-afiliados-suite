// src/components/workspaces/WorkspacePopoverContent.tsx
/**
 * @file src/components/workspaces/WorkspacePopoverContent.tsx
 * @description Componente de ensamblaje soberano. Ha sido refactorizado a un
 *              estándar de élite para ser completamente agnóstico a la i18n,
 *              delegando la responsabilidad de la traducción a sus componentes
 *              hijos soberanos (`WorkspaceList` y `WorkspaceActions`).
 * @author Raz Podestá - MetaShark Tech
 * @version 4.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import React from "react";

import { Command, CommandSeparator } from "@/components/ui/command";
import { type Workspace } from "@/lib/data/workspaces";
import { clientLogger } from "@/lib/logging";
import {
  WorkspaceActions,
  type WorkspaceActionsProps,
} from "./WorkspaceActions";
import { WorkspaceList } from "./WorkspaceList";

export interface WorkspacePopoverContentProps
  extends Omit<WorkspaceActionsProps, "texts"> {
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  onWorkspaceSelect: (workspaceId: string) => void;
}

/**
 * @public
 * @component WorkspacePopoverContent
 * @description Orquesta el layout del contenido del popover, ensamblando la
 *              lista de workspaces y el menú de acciones. Es un componente
 *              de composición puro, sin lógica de i18n.
 * @param {WorkspacePopoverContentProps} props - Propiedades para configurar el contenido.
 * @returns {React.ReactElement}
 */
export function WorkspacePopoverContent({
  workspaces,
  activeWorkspaceId,
  onWorkspaceSelect,
  ...actionProps
}: WorkspacePopoverContentProps): React.ReactElement {
  clientLogger.trace(
    "[WorkspacePopoverContent] Renderizando ensamblador de UI puro."
  );

  return (
    <Command>
      <WorkspaceList
        workspaces={workspaces}
        activeWorkspaceId={activeWorkspaceId}
        onWorkspaceSelect={onWorkspaceSelect}
      />
      <CommandSeparator />
      <WorkspaceActions {...actionProps} />
    </Command>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **Sección de "Miembros"**: Añadir una sección que muestre los avatares de los miembros del workspace activo, proporcionando un atajo visual para la colaboración.
 * 2. **Búsqueda Unificada**: Integrar la `CommandInput` a un nivel superior para que filtre tanto la lista de workspaces como las acciones disponibles en `WorkspaceActions`, creando una experiencia de paleta de comandos más cohesiva.
 * 3. **Accesibilidad Mejorada**: Añadir `aria-labelledby` al componente `Command` para asociarlo con un título visible (o invisible) que describa su propósito (ej. "Menú de Workspaces"), mejorando la navegación para usuarios de lectores de pantalla.
 * 4. **Renderizado Condicional de Separador**: El `CommandSeparator` podría renderizarse condicionalmente solo si tanto `WorkspaceList` como `WorkspaceActions` tienen contenido visible, evitando una línea divisoria innecesaria en casos borde.
 * 5. **Personalización de Layout**: Para una flexibilidad de élite, el orden de `WorkspaceList` y `WorkspaceActions` podría ser controlado por una prop `layout: ('list' | 'actions')[]`, permitiendo al consumidor reordenar las secciones.
 * =====================================================================
 */
// src/components/workspaces/WorkspacePopoverContent.tsx
