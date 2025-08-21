// tests/mocks/vi/actions.mock.ts
/**
 * @file tests/mocks/vi/actions.mock.ts
 * @description Factoría de mock atómica para todas las Server Actions de la aplicación.
 *              Esta es la Única Fuente de Verdad para simular la API de acciones del
 *              servidor a nivel de módulo. Proporciona espías (`vi.fn`) para cada acción,
 *              con implementaciones de alta fidelidad que respetan los contratos de
 *              retorno de las acciones reales.
 * @author Raz Podestá
 * @version 2.0.0
 */
import { vi } from "vitest";

// --- Factorías de Respuestas de Alta Fidelidad ---
const createDefaultSuccess = (data: any = {}) =>
  Promise.resolve({
    success: true,
    data: { id: "mock-id-12345", message: "Acción simulada exitosa", ...data },
  });

// --- SSoT: Objeto de Mocks de Acciones ---
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

// --- Orquestador de Simulación ---
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
 * 1. **Alta Fidelidad de Contrato**: ((Implementada)) Las respuestas por defecto ahora replican los contratos de retorno reales de cada Server Action, resolviendo la causa raíz de los fallos en las pruebas.
 * 2. **Cobertura Completa**: ((Implementada)) El mock ahora simula el 100% de la API de Server Actions definida en la aplicación.
 * 3. **Atomicidad y SRP**: ((Implementada)) Se ha separado la simulación de los helpers de las acciones principales, mejorando la granularidad y la cohesión.
 *
 * @subsection Melhorias Futuras
 * 1. **Generación Automática desde API**: ((Vigente)) Un script podría analizar el archivo `src/lib/actions/index.ts` y generar automáticamente el objeto `mockActions`, garantizando una sincronización perfecta y eliminando el mantenimiento manual.
 *
 * =====================================================================
 */
// tests/mocks/vi/actions.mock.ts
