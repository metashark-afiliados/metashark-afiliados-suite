// src/lib/context/DashboardContext.tsx
/**
 * @file src/lib/context/DashboardContext.tsx
 * @description Proveedor de contexto para compartir datos globales a través de
 *              todos los componentes del dashboard. Sincronizado con la
 *              Arquitectura v9.2 para incluir el rol del usuario en el
 *              workspace activo.
 * @author Raz Podestá
 * @version 3.1.0
 */
"use client";

import { createContext, type ReactNode, useContext } from "react";
import { type User } from "@supabase/supabase-js";

import { type FeatureModule } from "@/lib/data/modules";
import { type Enums, type Tables } from "@/lib/types/database";

type Workspace = Tables<"workspaces">;
type Campaign = Tables<"campaigns">;
type Profile = Tables<"profiles">;

type Invitation = {
  id: string;
  status: string;
  workspaces: { name: string; icon: string | null } | null;
};

export interface DashboardContextProps {
  user: User;
  profile: Profile;
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  activeWorkspaceRole: Enums<"workspace_role"> | null; // <-- ARQUITECTURA v9.2
  pendingInvitations: Invitation[];
  modules: FeatureModule[];
  recentCampaigns: Campaign[];
}

const DashboardContext = createContext<DashboardContextProps | undefined>(
  undefined
);

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

export const useDashboard = (): DashboardContextProps => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error(
      "Error de Arquitectura: useDashboard debe ser utilizado dentro de un DashboardProvider."
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
 * 1. **Sincronización de Contrato de Permisos**: ((Implementada)) Se ha añadido `activeWorkspaceRole` al contrato del contexto. Esto habilita la propagación de datos de permisos desde el servidor a todos los componentes de cliente del dashboard.
 *
 * @subsection Melhorias Futuras
 * 1. **Optimización de Re-renderizado**: ((Vigente)) Para dashboards muy complejos, dividir el `DashboardContext` en contextos más granulares (ej. `SessionContext`, `WorkspaceContext`) sigue siendo una optimización de élite a considerar.
 *
 * =====================================================================
 */
// src/lib/context/DashboardContext.tsx
