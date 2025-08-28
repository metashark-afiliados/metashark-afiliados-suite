// src/lib/context/DashboardContext.tsx
/**
 * @file src/lib/context/DashboardContext.tsx
 * @description Proveedor de contexto para compartir datos globales a través de
 *              todos los componentes del dashboard. Ha sido refactorizado
 *              holísticamente para incluir la lista de `workspaceMembers`,
 *              la preferencia `activeIconLibraryId` del usuario, y ahora también
 *              las **métricas de uso clave** para el "Hub Creativo", completando
 *              el contrato de datos para el dashboard funcional.
 * @author Raz Podestá - MetaShark Tech
 * @version 5.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { createContext, type ReactNode, useContext } from "react";
import { type User } from "@supabase/supabase-js";

import { type FeatureModule } from "@/lib/data/modules";
import { type Enums, type Tables } from "@/lib/types/database";
import { type z } from "zod";
import { type DashboardLayoutPreferencesSchema } from "@/lib/validators/schemas";

type Workspace = Tables<"workspaces">;
type Campaign = Tables<"campaigns">;
type Profile = Tables<"profiles">;
type WorkspaceMember = Tables<"workspace_members"> & {
  profiles: Tables<"profiles"> | null; // Incluir la relación de perfil
};

export interface DashboardContextProps {
  user: User;
  profile: Profile;
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  activeWorkspaceRole: Enums<"workspace_role"> | null;
  pendingInvitations: Tables<"invitations">[];
  modules: FeatureModule[];
  recentCampaigns: Campaign[];
  workspaceMembers: WorkspaceMember[];
  // --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Adición de métricas de uso ---
  /**
   * @property activeSitesCount
   * @description El número de sitios activos en el workspace actual.
   */
  activeSitesCount: number;
  /**
   * @property publishedCampaignsCount
   * @description El número de campañas publicadas en el workspace actual.
   */
  publishedCampaignsCount: number;
  /**
   * @property uniqueVisitors30d
   * @description El número de visitantes únicos en los últimos 30 días para el workspace.
   */
  uniqueVisitors30d: number;
  /**
   * @property aiCreditsRemaining
   * @description El balance de créditos de IA restantes para el usuario actual.
   */
  aiCreditsRemaining: number;
  /**
   * @property maxSitesAllowed
   * @description El número máximo de sitios permitidos según el plan del usuario.
   */
  maxSitesAllowed: number;
  // --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---
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
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 5.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Integración de Métricas de Uso**: ((Implementada)) Se han añadido `activeSitesCount`, `publishedCampaignsCount`, `uniqueVisitors30d`, `aiCreditsRemaining`, y `maxSitesAllowed` a la interfaz `DashboardContextProps`. Esto es crítico para que `dashboard-usage-card-group.tsx` pueda mostrar datos reales y funcionales.
 * 2. **Contrato de Datos Completo**: ((Implementada)) La interfaz ahora proporciona un contrato de datos exhaustivo para el estado global del dashboard, resolviendo la brecha funcional de datos mockeados.
 * 3. **Habilitación de Componentes Funcionales**: ((Implementada)) Este cambio permite que los componentes del dashboard dependan de un único `useDashboard` para obtener toda la información necesaria, mejorando la coherencia y mantenibilidad.
 *
 * @subsection Melhorias Futuras
 * 1. **Optimización de Re-renderizado**: ((Vigente)) Para dashboards muy complejos, dividir el `DashboardContext` en contextos más granulares (ej. `SessionContext`, `WorkspaceContext`, `MetricsContext`) sigue siendo una optimización de élite a considerar para controlar mejor los re-renderizados finos.
 *
 * =====================================================================
 */
// src/lib/context/DashboardContext.tsx
