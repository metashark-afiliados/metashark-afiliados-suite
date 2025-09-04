// src/lib/hooks/useWorkspaceContext.tsx
/**
 * @file useWorkspaceContext.tsx
 * @description Contexto de permisos de élite. Consume el `activeWorkspaceRoleId`
 *              y computa los flags de permisos (`canEdit`, `canDelete`), pagando
 *              la deuda técnica de "Fuga de Abstracción".
 * @author @author RaZ Podestá - MetaShark Tech
 * @version 2.0.0
 * @see .docs-espejo/lib/hooks/useWorkspaceContext.tsx.md
 */
"use client";

import React, { createContext, useContext, type ReactNode } from "react";
import { type User } from "@supabase/supabase-js";

import { WORKSPACE_ROLES } from "@/config/roles.config";
import { useDashboard } from "@/lib/context/DashboardContext";

interface WorkspaceContextValue {
  user: User;
  activeWorkspaceId: string;
  activeWorkspaceRoleId: number | null;
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
  const { user, activeWorkspace, activeWorkspaceRoleId } = useDashboard();

  if (!user || !activeWorkspace) {
    return null;
  }

  const value: WorkspaceContextValue = {
    user,
    activeWorkspaceId: activeWorkspace.id,
    activeWorkspaceRoleId,
    canEdit:
      activeWorkspaceRoleId === WORKSPACE_ROLES.OWNER.id ||
      activeWorkspaceRoleId === WORKSPACE_ROLES.ADMIN.id,
    canDelete: activeWorkspaceRoleId === WORKSPACE_ROLES.OWNER.id,
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
// src/lib/hooks/useWorkspaceContext.tsx
