// src/lib/context/DashboardContext.tsx
/**
 * @file src/lib/context/DashboardContext.tsx
 * @description Proveedor de contexto para compartir datos globales a través de
 *              todos los componentes del dashboard. Ha sido refactorizado
 *              holísticamente para alinearse con la arquitectura "Lean Database".
 * @author @author RaZ Podestá - MetaShark Tech
 * @version 7.0.0
 * @see .docs-espejo/lib/context/DashboardContext.tsx.md
 */
"use client";

import { createContext, type ReactNode, useContext } from "react";
import { type User } from "@supabase/supabase-js";

import { type FeatureModule } from "@/lib/data/modules";
import { type Invitation } from "@/lib/data/notifications";
import { type Tables } from "@/lib/types/database";

// --- Tipos de Datos Sincronizados ---

type Workspace = Tables<"workspaces">;
type Profile = Tables<"profiles">;

export type WorkspaceMember = Tables<"workspace_members"> & {
  profiles: Profile | null;
  workspace_roles: { name: string } | null;
};

type RecentCampaign = Pick<
  Tables<"campaigns">,
  "id" | "name" | "updated_at" | "created_at" | "creation_id"
>;

export interface DashboardContextProps {
  user: User;
  profile: Profile;
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  activeWorkspaceRoleId: number | null; // <-- REFACTORIZADO: SSoT de rol
  pendingInvitations: Invitation[];
  modules: FeatureModule[];
  recentCampaigns: RecentCampaign[];
  workspaceMembers: WorkspaceMember[];
  activeSitesCount: number;
  publishedCampaignsCount: number;
  uniqueVisitors30d: number;
  aiCreditsRemaining: number;
  maxSitesAllowed: number;
}

const DashboardContext = createContext<DashboardContextProps | undefined>(
  undefined
);

/**
 * @public
 * @component DashboardProvider
 * @description Provee el contexto global del dashboard a sus componentes hijos.
 * @param {object} props
 * @returns {React.ReactElement}
 */
export const DashboardProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: DashboardContextProps;
}) => {
  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

/**
 * @public
 * @function useDashboard
 * @description Hook para consumir el contexto global del dashboard de forma segura.
 * @returns {DashboardContextProps} Los datos globales del dashboard.
 * @throws {Error} Si se usa fuera de un `DashboardProvider`.
 */
export const useDashboard = (): DashboardContextProps => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error(
      "Error de Arquitectura: useDashboard debe ser utilizado dentro de un DashboardProvider."
    );
  }
  return context;
};
// src/lib/context/DashboardContext.tsx
