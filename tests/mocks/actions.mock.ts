// tests/mocks/actions.mock.ts
/**
 * @file tests/mocks/actions.mock.ts
 * @description Factoría de mock atómica para todas las Server Actions de la aplicación.
 *              Esta es la Única Fuente de Verdad para simular la API de acciones del
 *              servidor a nivel de módulo. Proporciona espías (`vi.fn`) para cada acción,
 *              permitiendo a las pruebas unitarias y de integración controlar sus respuestas
 *              y hacer aserciones sobre sus llamadas.
 *
 * @architecture
 *   - **Alta Fidelidad**: Cada mock devuelve por defecto una `Promise<ActionResult<T>>`
 *     que simula una respuesta exitosa, reflejando el contrato real.
 *   - **Aislamiento de Pruebas**: Las pruebas pueden sobreescribir el comportamiento por
 *     defecto para simular fallos (`mockRejectedValue`) o respuestas específicas
 *     (`mockResolvedValue`), garantizando un control total sobre el escenario de prueba.
 *   - **Observabilidad**: Al ser `vi.fn`, cada llamada a una acción es rastreada,
 *     permitiendo aserciones como `expect(mockActions.workspaces.createWorkspaceAction).toHaveBeenCalled()`.
 *
 * @author L.I.A. Legacy
 * @version 2.0.0
 */
import { vi } from "vitest";

import { type ActionResult } from "@/lib/validators";

const createDefaultSuccess = (data: any = {}): Promise<ActionResult<any>> =>
  Promise.resolve({
    success: true,
    data: { id: "mock-id-12345", message: "Acción simulada exitosa", ...data },
  });

export const mockActions = {
  admin: {
    impersonateUserAction: vi.fn(() =>
      createDefaultSuccess({ signInLink: "http://mock.link" })
    ),
    updateUserRoleAction: vi.fn(() => createDefaultSuccess()),
    deleteSiteAsAdminAction: vi.fn(() => createDefaultSuccess()),
  },
  auth: {
    signInWithEmailAction: vi.fn(() => createDefaultSuccess()),
    signUpAction: vi.fn(() => createDefaultSuccess()),
    signInWithOAuthAction: vi.fn(() => Promise.resolve()),
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
  sentry: {
    testSentryServerErrorAction: vi.fn(() => createDefaultSuccess()),
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
  // --- INICIO DE MEJORA: AÑADIR MOCK PARA HELPER DE LOGGING ---
  _helpers: {
    createPersistentErrorLog: vi.fn(() => Promise.resolve("mock-error-id-123")), // Devolver un ID de error simulado
    createAuditLog: vi.fn(() => Promise.resolve()),
    checkRateLimit: vi.fn(() =>
      Promise.resolve({ success: true, data: undefined })
    ),
    EmailService: {
      sendPasswordResetEmail: vi.fn(() => Promise.resolve({ success: true })),
    },
    getAuthenticatedUser: vi.fn(() =>
      Promise.resolve({ user: { id: "mock-user-id", email: "mock@user.com" } })
    ),
  },
  // --- FIN DE MEJORA ---
};

export const setupActionsMock = () => {
  vi.mock("@/lib/actions", () => ({
    ...mockActions,
  }));
  // --- INICIO DE MEJORA: Mockear también el directorio _helpers directamente ---
  vi.mock("@/lib/actions/_helpers", () => ({
    ...mockActions._helpers,
  }));
  // --- FIN DE MEJORA ---
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Mock de `createPersistentErrorLog`**: ((Implementada)) Se ha añadido un mock explícito para `createPersistentErrorLog` en `mockActions._helpers`. Esto garantiza que el entorno de pruebas pueda espiar y controlar la invocación de esta función crucial.
 * 2. **Mock de `_helpers` Directo**: ((Implementada)) Se ha añadido `vi.mock("@/lib/actions/_helpers")` para interceptar directamente las importaciones del helper, asegurando que las pruebas de `useHandleErrors` utilicen nuestro mock.
 * 3. **Fidelidad de Tipo de Retorno**: ((Implementada)) El mock de `createPersistentErrorLog` ahora devuelve un `Promise<string>`, alineado con el contrato de la función real (`error-log.helper.ts`).
 *
 * @subsection Melhorias Futuras
 * 1. **Tipado Estricto para Mocks**: ((Vigente)) Aunque funcional, el uso de `any` en `createDefaultSuccess` podría refinarse con tipos más estrictos para el mock de `ActionResult`.
 * 2. **Refinar `getAuthenticatedUser` Mock**: ((Vigente)) El mock de `getAuthenticatedUser` podría ser más dinámico para simular diferentes estados de usuario (logueado, no logueado, diferentes roles).
 *
 * =====================================================================
 */
// tests/mocks/actions.mock.ts
