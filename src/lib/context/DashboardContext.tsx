// src/lib/context/DashboardContext.tsx
/**
 * @file src/lib/context/DashboardContext.tsx
 * @description Proveedor de contexto para compartir datos globales a través de
 *              todos los componentes del dashboard. Ha sido nivelado para incluir
 *              `recentCampaigns`, centralizando la carga de datos del dashboard
 *              principal en el layout superior.
 * @author L.I.A. Legacy
 * @version 2.0.0
 */
"use client";

import { createContext, type ReactNode, useContext } from "react";
import { type User } from "@supabase/supabase-js";

import { type FeatureModule } from "@/lib/data/modules";
import { type Tables } from "@/lib/types/database";

type Workspace = Tables<"workspaces">;
type Campaign = Tables<"campaigns">;

/**
 * @public
 * @typedef Invitation
 * @description Define el contrato de datos para una invitación pendiente.
 */
type Invitation = {
  id: string;
  status: string;
  workspaces: { name: string; icon: string | null } | null;
};

/**
 * @public
 * @interface DashboardContextProps
 * @description Define la forma de los datos globales compartidos en el contexto del dashboard.
 */
export interface DashboardContextProps {
  user: User;
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  pendingInvitations: Invitation[];
  modules: FeatureModule[];
  recentCampaigns: Campaign[]; // <-- NUEVA PROPIEDAD
}

const DashboardContext = createContext<DashboardContextProps | undefined>(
  undefined
);

/**
 * @public
 * @component DashboardProvider
 * @description Proveedor de React Context que hace que los datos globales del dashboard
 *              estén disponibles para todos sus componentes hijos.
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
 * @exports useDashboard
 * @description Hook personalizado para acceder de forma segura al `DashboardContext`.
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

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Centralización de Datos**: ((Implementada)) Se ha añadido `recentCampaigns` al contrato del contexto. Esto permite que el `DashboardLayout` actúe como la única fuente de datos para la vista principal del dashboard, sentando las bases para resolver la regresión de estado.
 *
 * @subsection Melhorias Futuras
 * 1. **Otimização de Re-renderização**: ((Vigente)) Para dashboards muito complexos, poderíamos dividir o `DashboardContext` em múltiplos contextos mais granulares (ex: `SessionContext`, `WorkspaceContext`) para evitar re-renderizações desnecessárias.
 *
 * =====================================================================
 */
// src/lib/context/DashboardContext.tsx
