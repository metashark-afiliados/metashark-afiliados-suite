// src/lib/context/WorkspacesContext.tsx
"use client";

import { createContext, type ReactNode, useContext } from "react";
import { type Enums, type Tables } from "@/lib/types/database";

type Workspace = Tables<"workspaces">;
type Invitation = {
  id: string;
  status: string;
  workspaces: { name: string; icon: string | null } | null;
};

export interface WorkspacesContextProps {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  activeWorkspaceRole: Enums<"workspace_role"> | null;
  pendingInvitations: Invitation[];
}

const WorkspacesContext = createContext<WorkspacesContextProps | undefined>(
  undefined
);

export const WorkspacesProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: WorkspacesContextProps;
}) => {
  return (
    <WorkspacesContext.Provider value={value}>
      {children}
    </WorkspacesContext.Provider>
  );
};

export const useWorkspaces = (): WorkspacesContextProps => {
  const context = useContext(WorkspacesContext);
  if (context === undefined) {
    throw new Error(
      "useWorkspaces debe ser usado dentro de un WorkspacesProvider"
    );
  }
  return context;
};
