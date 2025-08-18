// src/components/workspaces/WorkspaceSwitcher.tsx
/**
 * @file src/components/workspaces/WorkspaceSwitcher.tsx
 * @description Orquestador de alto nivel para la selección y gestión de workspaces.
 *              Ha sido refactorizado para eliminar la lógica de onboarding,
 *              asumiendo que su renderizado es controlado por un componente padre.
 * @author Raz Podestá
 * @version 3.1.0
 */
"use client";

import React from "react";

import { WorkspaceProvider } from "@/lib/hooks/use-workspace-context";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { WorkspaceDialogs } from "./WorkspaceDialogs";
import { WorkspacePopoverContent } from "./WorkspacePopoverContent";
import { WorkspaceTrigger } from "./WorkspaceTrigger";
import { cn } from "@/lib/utils";

export function WorkspaceSwitcher({ className }: { className?: string }) {
  // La lógica de `if (workspaces.length === 0)` ha sido movida al DashboardLayout.
  // Este componente ahora asume que existen workspaces.

  return (
    <WorkspaceProvider>
      <div className={cn("relative", className)}>
        <Popover>
          <PopoverTrigger asChild>
            <WorkspaceTrigger />
          </PopoverTrigger>
          <PopoverContent className="w-[220px] p-0">
            <WorkspacePopoverContent />
          </PopoverContent>
        </Popover>
        <WorkspaceDialogs />
      </div>
    </WorkspaceProvider>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Alineación Arquitectónica (SRP)**: ((Implementada)) Se ha eliminado la lógica de onboarding, alineando el componente con su única responsabilidad: la gestión de workspaces existentes. Esto resuelve el error de importación.
 * 2. **Simplificación y Cohesión**: ((Implementada)) El componente es ahora más simple y cohesivo.
 *
 * @subsection Melhorias Futuras
 * 1. **Optimización de Renderizado**: ((Vigente)) Para aplicaciones a gran escala, se podría usar `React.memo` en los componentes de presentación puros (`WorkspaceTrigger`, etc.) para prevenir re-renderizados innecesarios.
 *
 * =====================================================================
 */
// src/components/workspaces/WorkspaceSwitcher.tsx
