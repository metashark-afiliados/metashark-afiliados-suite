// tests/mocks/vi/actions.mock.ts
/**
 * @file tests/mocks/vi/actions.mock.ts
 * @description Factoría de mock atómica para todas las Server Actions.
 *              Ha sido nivelada a un estándar de élite con type hints explícitos
 *              para reflejar con alta fidelidad el contrato `ActionResult`.
 * @author Raz Podestá
 * @version 2.1.0
 */
import { vi } from "vitest";
import { type ActionResult } from "@/lib/validators"; // <-- IMPORTACIÓN DEL CONTRATO REAL

// --- INICIO DE REFACTORIZACIÓN (TYPE HINT DE ALTA FIDELIDAD) ---
// La factoría ahora devuelve explícitamente una promesa del tipo ActionResult.
const createDefaultSuccess = (data: any = {}): Promise<ActionResult<any>> =>
  Promise.resolve({
    success: true,
    data: { id: "mock-id-12345", message: "Acción simulada exitosa", ...data },
  });
// --- FIN DE REFACTORIZACIÓN ---

export const mockActions = {
  admin: {
    impersonateUserAction: vi.fn(() =>
      createDefaultSuccess({ signInLink: "http://mock.link" })
    ),
    updateUserRoleAction: vi.fn(() => createDefaultSuccess()),
  },
  builder: {
    updateCampaignContentAction: vi.fn(() => createDefaultSuccess()),
  },
  campaigns: {
    archiveCampaignAction: vi.fn(() => createDefaultSuccess()),
    assignSiteToCampaignAction: vi.fn(() => createDefaultSuccess()),
    createCampaignAction: vi.fn(() => createDefaultSuccess()),
    createCampaignFromTemplateAction: vi.fn(() => createDefaultSuccess()),
    deleteCampaignAction: vi.fn(() =>
      createDefaultSuccess({ messageKey: "delete_success_toast" })
    ),
    duplicateCampaignAction: vi.fn(() => createDefaultSuccess()),
  },
  invitations: {
    acceptInvitationAction: vi.fn(() =>
      createDefaultSuccess({ message: "Invitación aceptada." })
    ),
    sendWorkspaceInvitationAction: vi.fn(() =>
      createDefaultSuccess({ message: "Invitación enviada." })
    ),
  },
  newsletter: {
    subscribeToNewsletterAction: vi.fn(() =>
      createDefaultSuccess({ messageKey: "Newsletter.success_new" })
    ),
  },
  onboarding: {
    completeOnboardingAction: vi.fn(() => createDefaultSuccess()),
  },
  password: {
    requestPasswordResetAction: vi.fn(() => createDefaultSuccess(null)),
    updatePasswordAction: vi.fn(() => createDefaultSuccess(null)),
  },
  profiles: {
    updateDashboardLayoutAction: vi.fn(() => createDefaultSuccess()),
  },
  session: {
    signOutAction: vi.fn(() => Promise.resolve()),
  },
  sites: {
    checkSubdomainAvailabilityAction: vi.fn(() =>
      createDefaultSuccess({ isAvailable: true })
    ),
    createSiteAction: vi.fn(() => createDefaultSuccess()),
    deleteSiteAction: vi.fn(() =>
      createDefaultSuccess({ message: "Sitio eliminado." })
    ),
    updateSiteAction: vi.fn(() =>
      createDefaultSuccess({ message: "Sitio actualizado." })
    ),
  },
  telemetry: {
    enrichVisitorLogAction: vi.fn(() => createDefaultSuccess()),
    logVisitorAction: vi.fn(() => createDefaultSuccess()),
  },
  workspaces: {
    createWorkspaceAction: vi.fn(() => createDefaultSuccess()),
    deleteWorkspaceAction: vi.fn(() => createDefaultSuccess()),
    setActiveWorkspaceAction: vi.fn(() => Promise.resolve()),
    updateWorkspaceNameAction: vi.fn(() => createDefaultSuccess()),
  },
};

export const mockActionHelpers = {
  createAuditLog: vi.fn(),
  createPersistentErrorLog: vi.fn().mockResolvedValue("mock-error-id-123"),
};

export const setupActionsMock = () => {
  vi.mock("@/lib/actions", () => ({ ...mockActions }));
  vi.mock("@/lib/actions/_helpers", () => mockActionHelpers);
};
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error de Tipos (TS2345)**: ((Implementada)) Al añadir un type hint explícito a la factoría `createDefaultSuccess`, el compilador de TypeScript ahora infiere correctamente que todas las acciones simuladas devuelven `Promise<ActionResult<any>>`. Esto resuelve el error de tipo en el arnés de pruebas de forma sistémica.
 * 2. **Mock de Alta Fidelidad**: ((Implementada)) La infraestructura de mocks ahora refleja con mayor precisión los contratos de tipo de producción, aumentando la robustez general de la suite de pruebas.
 *
 * =====================================================================
 */
// tests/mocks/vi/actions.mock.ts
