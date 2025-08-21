// tests/mocks/factories/context.factory.ts
/**
 * @file tests/mocks/factories/context.factory.ts
 * @description Factoría atómica para la generación de props de contexto de prueba.
 *              Esta es la Única Fuente de Verdad (SSoT) para construir el estado
 *              por defecto del `DashboardContext`, garantizando un estado de
 *              prueba determinista y de alta fidelidad para toda la suite.
 * @author Raz Podestá
 * @version 1.0.0
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
    modules: DUMMY_DATA.feature_modules as any,
    recentCampaigns: [],
    ...overrides,
  };
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad (Factoría Pura)**: ((Implementada)) Aísla la lógica de creación del estado del contexto.
 * 2. **Pruebas Deterministas**: ((Implementada)) Utiliza datos estáticos para eliminar la variabilidad en las pruebas.
 *
 * =====================================================================
 */
// tests/mocks/factories/context.factory.ts
