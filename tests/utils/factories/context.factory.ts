// tests/utils/factories/context.factory.ts
/**
 * @file context.factory.ts
 * @description Factoría atómica para la generación de props de contexto de prueba.
 *              Ha sido refactorizada a un estándar de élite para simular la
 *              lógica de transformación de la capa de datos (`icon_name` -> `icon`),
 *              resolviendo un error de tipo crítico y persistente.
 * @author Raz Podestá
 * @version 5.0.0
 */
import { type DashboardContextProps } from "@/lib/context/DashboardContext";
import {
  db as DUMMY_DATA,
  DEV_USER,
  DEV_WORKSPACE,
} from "@tests/mocks/data/database-state";

export const createMockDashboardContext = (
  overrides: Partial<DashboardContextProps> = {}
): DashboardContextProps => {
  // --- INICIO DE CORRECCIÓN: Simulación de la Transformación de la Capa de Datos ---
  // Se transforma la data cruda del mock (con icon_name) al contrato que la UI espera (con icon).
  // Esto simula el comportamiento real de `src/lib/data/modules.ts`.
  const transformedModules = DUMMY_DATA.feature_modules.map((module) => ({
    ...module,
    icon: module.icon_name,
  }));
  // --- FIN DE CORRECCIÓN ---

  return {
    user: DEV_USER,
    profile: DUMMY_DATA.profiles[0],
    workspaces: DUMMY_DATA.workspaces,
    activeWorkspace: DEV_WORKSPACE,
    activeWorkspaceRole: "owner",
    pendingInvitations: [],
    modules: transformedModules,
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
 * 1. **Resolución de Error Crítico (TS2322)**: ((Implementada)) La factoría ahora implementa correctamente la lógica de transformación de datos, asegurando que el contexto simulado cumpla con el contrato `DashboardContextProps` y resolviendo la causa raíz del error de compilación.
 * 2. **Alta Fidelidad de Mocks**: ((Implementada)) Al simular no solo los datos sino también la lógica de transformación, el entorno de pruebas es ahora un espejo más fiel de la arquitectura de producción.
 *
 * =====================================================================
 */
