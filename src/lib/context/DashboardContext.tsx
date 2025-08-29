// src/lib/context/DashboardContext.tsx
/**
 * @file src/lib/context/DashboardContext.tsx
 * @description Proveedor de contexto para compartir datos globales a través de
 *              todos los componentes del dashboard. Ha sido refactorizado
 *              holísticamente para alinear sus contratos de tipo (`pendingInvitations`,
 *              `recentCampaigns`) con la forma de los datos proveídos por la capa
 *              de datos, resolviendo una cascada de errores de tipo.
 * @author Raz Podestá - MetaShark Tech
 * @version 6.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { createContext, type ReactNode, useContext } from "react";
import { type User } from "@supabase/supabase-js";
import { type z } from "zod";

import { type FeatureModule } from "@/lib/data/modules";
// --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Sincronización de Tipos ---
import { type Invitation } from "@/lib/data/notifications";
// --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---
import { type Enums, type Tables } from "@/lib/types/database";
import { type DashboardLayoutPreferencesSchema } from "@/lib/validators/schemas";
import { type DashboardLayoutData } from "@/components/layout/dashboard.loader";

type Workspace = Tables<"workspaces">;
type Profile = Tables<"profiles">;
type WorkspaceMember = Tables<"workspace_members"> & {
  profiles: Tables<"profiles"> | null;
};
// --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Tipo Específico para Campañas Recientes ---
type RecentCampaign = Pick<
  Tables<"campaigns">,
  "id" | "name" | "updated_at" | "created_at" | "creation_id"
>;
// --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---

export interface DashboardContextProps {
  user: User;
  profile: Profile;
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  activeWorkspaceRole: Enums<"workspace_role"> | null;
  pendingInvitations: Invitation[]; // <-- TIPO CORREGIDO
  modules: FeatureModule[];
  recentCampaigns: RecentCampaign[]; // <-- TIPO CORREGIDO
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
 * @param {ReactNode} props.children - Los componentes hijos que consumirán el contexto.
 * @param {DashboardContextProps} props.value - Los datos del dashboard obtenidos del servidor.
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

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **Contextos Granulares**: ((Vigente)) Para optimizar re-renderizados en dashboards muy complejos, este contexto monolítico podría ser dividido en contextos más pequeños y específicos (ej. `SessionContext`, `WorkspaceContext`, `MetricsContext`), permitiendo a los componentes suscribirse solo a los datos que necesitan.
 * 2. **Tipado de `user_metadata` y `app_metadata`**: ((Vigente)) Extender el tipo `User` de Supabase a través de "declaration merging" para incluir explícitamente las propiedades personalizadas en `user_metadata` (como `full_name`) y `app_metadata` (como `app_role`), eliminando la necesidad de aserciones de tipo.
 * =====================================================================
 */
// src/lib/context/DashboardContext.tsx
