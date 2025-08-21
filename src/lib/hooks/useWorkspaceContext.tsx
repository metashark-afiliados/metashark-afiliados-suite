// src/lib/hooks/useWorkspaceContext.tsx
/**
 * @file useWorkspaceContext.tsx
 * @description Contexto de permisos de élite para el workspace activo. Este
 *              aparato consume el DashboardContext global y provee un contexto
 *              más específico y computado, que incluye los flags de permisos
 *              (canEdit, canDelete), para ser consumido por componentes hijos.
 * @author Raz Podestá
 * @version 1.0.1 (File Extension Fix)
 */
"use client";

import React, { createContext, useContext, type ReactNode } from "react";
import { type User } from "@supabase/supabase-js";

import { useDashboard } from "@/lib/context/DashboardContext";
import { type Enums } from "@/lib/types/database";

interface WorkspaceContextValue {
  user: User;
  activeWorkspaceId: string;
  activeWorkspaceRole: Enums<"workspace_role"> | null;
  canEdit: boolean;
  canDelete: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

/**
 * @public
 * @component WorkspaceProvider
 * @description Provee el contexto de permisos del workspace activo a sus hijos.
 * @param {{ children: ReactNode }} props Los componentes hijos.
 * @returns {React.ReactElement | null}
 */
export const WorkspaceProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user, activeWorkspace, activeWorkspaceRole } = useDashboard();

  if (!user || !activeWorkspace) {
    return null;
  }

  const value: WorkspaceContextValue = {
    user,
    activeWorkspaceId: activeWorkspace.id,
    activeWorkspaceRole,
    canEdit: activeWorkspaceRole === "owner" || activeWorkspaceRole === "admin",
    canDelete: activeWorkspaceRole === "owner",
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};

/**
 * @public
 * @function useWorkspaceContext
 * @description Hook para consumir el contexto de permisos del workspace.
 * @returns {WorkspaceContextValue} El valor del contexto.
 * @throws {Error} Si se usa fuera de un WorkspaceProvider.
 */
export const useWorkspaceContext = (): WorkspaceContextValue => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error(
      "useWorkspaceContext debe ser usado dentro de un WorkspaceProvider"
    );
  }
  return context;
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Correção de Sintaxe de Build**: ((Implementada)) A extensão do arquivo foi alterada de `.ts` para `.tsx`, resolvendo o erro de transformação.
 * 2. **Contexto de Permisos Granular**: ((Vigente)) Este aparato crea un contexto específico para los permisos del workspace, desacoplando la lógica de permisos de los componentes de UI.
 * 3. **Lógica Computada**: ((Vigente)) Los flags `canEdit` y `canDelete` se calculan una sola vez en el proveedor, optimizando el rendimiento y simplificando los componentes consumidores.
 *
 * @subsection Melhorias Futuras
 * 1. **Permisos a Nivel de Característica**: ((Vigente)) El contexto podría enriquecerse con un objeto de permisos más detallado (ej. `permissions: { canInviteMembers: boolean, canChangeSettings: boolean }`) si los roles se vuelven más complejos.
 *
 * =====================================================================
 */
// src/lib/hooks/useWorkspaceContext.tsx
