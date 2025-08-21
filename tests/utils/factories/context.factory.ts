// tests/utils/factories/context.factory.ts
/**
 * @file context.factory.ts
 * @description Factoría atómica para la generación de props de contexto.
 *              Corregido para ser 100% determinista, usando el MOCKED_USER
 *              estático para resolver fallos de aserción.
 * @author Raz Podestá
 * @version 2.1.0
 */
import { type DashboardContextProps } from "@/lib/context/DashboardContext";
import {
  db as DUMMY_DATA,
  MOCKED_USER,
} from "@tests/mocks/data/database-state";

export const createMockDashboardContext = (
  overrides: Partial<DashboardContextProps> = {}
): DashboardContextProps => {
  return {
    user: MOCKED_USER,
    profile: DUMMY_DATA.profiles[0],
    workspaces: DUMMY_DATA.workspaces,
    activeWorkspace: DUMMY_DATA.workspaces[0],
    activeWorkspaceRole: "owner",
    pendingInvitations: [],
    modules: DUMMY_DATA.feature_modules,
    recentCampaigns: [],
    ...overrides,
  };
};
