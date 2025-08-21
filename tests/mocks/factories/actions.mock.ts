// tests/mocks/factories/actions.mock.ts
/**
 * @file tests/mocks/factories/actions.mock.ts
 * @description Factoría de mock atómica para todas las Server Actions de la aplicación.
 *              Esta es la Única Fuente de Verdad para simular la API de acciones del
 *              servidor a nivel de módulo. Proporciona espías (`vi.fn`) para cada acción,
 *              permitiendo a las pruebas unitarias y de integración controlar sus respuestas
 *              y hacer aserciones sobre sus llamadas.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { vi } from "vitest";

// Un helper interno para crear una respuesta de éxito genérica.
const createDefaultSuccessActionResult = () =>
  Promise.resolve({
    success: true,
    data: { id: "mock-id", message: "Acción simulada exitosa" },
  });

/**
 * @public
 * @constant mockActions
 * @description Un objeto que replica la estructura de namespaces de `src/lib/actions`
 *              con espías de Vitest. Cada espía está preconfigurado para devolver una
 *              respuesta de éxito por defecto. Las pruebas pueden anular este comportamiento
 *              con `mockResolvedValue` o `mockRejectedValue` para simular diferentes escenarios.
 */
export const mockActions = {
  admin: {
    impersonateUserAction: vi.fn(createDefaultSuccessActionResult),
    updateUserRoleAction: vi.fn(createDefaultSuccessActionResult),
  },
  builder: {
    updateCampaignContentAction: vi.fn(createDefaultSuccessActionResult),
  },
  campaigns: {
    archiveCampaignAction: vi.fn(createDefaultSuccessActionResult),
    assignSiteToCampaignAction: vi.fn(createDefaultSuccessActionResult),
    createCampaignAction: vi.fn(createDefaultSuccessActionResult),
    createCampaignFromTemplateAction: vi.fn(createDefaultSuccessActionResult),
    deleteCampaignAction: vi.fn(createDefaultSuccessActionResult),
    duplicateCampaignAction: vi.fn(createDefaultSuccessActionResult),
  },
  invitations: {
    acceptInvitationAction: vi.fn(createDefaultSuccessActionResult),
    sendWorkspaceInvitationAction: vi.fn(createDefaultSuccessActionResult),
  },
  newsletter: {
    subscribeToNewsletterAction: vi.fn(createDefaultSuccessActionResult),
  },
  onboarding: {
    completeOnboardingAction: vi.fn(createDefaultSuccessActionResult),
  },
  password: {
    requestPasswordResetAction: vi.fn(createDefaultSuccessActionResult),
    updatePasswordAction: vi.fn(createDefaultSuccessActionResult),
  },
  profiles: {
    updateDashboardLayoutAction: vi.fn(createDefaultSuccessActionResult),
  },
  sentry: {
    testSentryServerErrorAction: vi.fn(createDefaultSuccessActionResult),
  },
  session: {
    signOutAction: vi.fn(() => Promise.resolve()),
  },
  sites: {
    checkSubdomainAvailabilityAction: vi.fn(createDefaultSuccessActionResult),
    createSiteAction: vi.fn(createDefaultSuccessActionResult),
    deleteSiteAction: vi.fn(createDefaultSuccessActionResult),
    updateSiteAction: vi.fn(createDefaultSuccessActionResult),
  },
  telemetry: {
    enrichVisitorLogAction: vi.fn(createDefaultSuccessActionResult),
    logVisitorAction: vi.fn(createDefaultSuccessActionResult),
  },
  workspaces: {
    createWorkspaceAction: vi.fn(createDefaultSuccessActionResult),
    deleteWorkspaceAction: vi.fn(createDefaultSuccessActionResult),
    setActiveWorkspaceAction: vi.fn(() => Promise.resolve()),
    updateWorkspaceNameAction: vi.fn(createDefaultSuccessActionResult),
  },
};

/**
 * @public
 * @function setupActionsMock
 * @description Configura `vi.mock` para interceptar las importaciones de `@/lib/actions`
 *              y reemplazarlas con el objeto `mockActions`.
 */
export const setupActionsMock = () => {
  vi.mock("@/lib/actions", () => ({
    ...mockActions,
    // Simula también los helpers para evitar llamadas reales a la DB
    createAuditLog: vi.fn(),
    createPersistentErrorLog: vi.fn().mockResolvedValue("mock-error-id"),
  }));
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad y Cohesión**: ((Implementada)) La simulación de todas las Server Actions está ahora centralizada en este único aparato.
 * 2. **SSoT de Mocks de Acciones**: ((Implementada)) Este archivo es la fuente de verdad para la API de acciones simulada. Si se añade una nueva acción en producción, solo necesita ser añadida aquí para estar disponible en las pruebas.
 *
 * @subsection Melhorias Futuras
 * 1. **Generación Automática desde API**: ((Vigente)) Un script podría analizar el archivo `src/lib/actions/index.ts` y generar automáticamente el objeto `mockActions`, garantizando una sincronización perfecta y eliminando el mantenimiento manual.
 * =====================================================================
 */
// tests/mocks/factories/actions.mock.ts
