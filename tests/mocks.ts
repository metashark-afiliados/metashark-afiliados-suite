// tests/mocks.ts
/**
 * @file tests/mocks.ts
 * @description Manifiesto y Orquestador de Mocks de Élite v13.1.0.
 *              Este aparato es la Única Fuente de Verdad para la configuración
 *              global de `vi.mock`. Ha sido reconstruido con una arquitectura
 *              interna robusta para resolver fallos de dependencia y de orden de
 *              ejecución, garantizando un entorno de pruebas estable y de alta fidelidad.
 * @author Raz Podestá
 * @version 13.1.0
 */
import React from "react";
import { type User } from "@supabase/supabase-js";
import { vi } from "vitest";

import { type DashboardContextProps } from "@/lib/context/DashboardContext";
import * as DUMMY_DATA from "@tests/mocks/data/database-state";

// --- PASO 1: Factoría de SSoT para el Estado del Contexto ---
// Se define la factoría PRIMERO para que esté disponible para los mocks que la necesiten.
const createMockDashboardContext = (
  overrides: Partial<DashboardContextProps> = {}
): DashboardContextProps => ({
  user: DUMMY_DATA.MOCKED_USER,
  profile: DUMMY_DATA.db.profiles[0],
  workspaces: DUMMY_DATA.db.workspaces,
  activeWorkspace: DUMMY_DATA.db.workspaces[0],
  activeWorkspaceRole: "owner",
  pendingInvitations: [],
  modules: DUMMY_DATA.db.feature_modules as any,
  recentCampaigns: [],
  ...overrides,
});

// --- PASO 2: Creación del Estado de Contexto por Defecto ---
// Esta variable ahora existe en el ámbito del módulo y es la SSoT para
// el estado del dashboard en todas las pruebas.
const defaultContext = createMockDashboardContext();

// --- PASO 3: Definición de Mocks Atómicos Internos ---

const setupNextIntlMock = () => {
  vi.mock("next-intl", async (importOriginal) => {
    const actual = await importOriginal<typeof import("next-intl")>();
    const t = (key: string, values?: any) =>
      `[i18n] ${key}${values ? ` ${JSON.stringify(values)}` : ""}`;
    t.rich = (key: string, values: any) =>
      `[i18n-rich] ${key} ${JSON.stringify(values || {})}`;
    t.raw = (key: string) => `[i18n-raw] ${key}`;
    return {
      ...actual,
      useTranslations: (ns?: string) => {
        const s = (k: string, v?: any) => t(`${ns}.${k}`, v);
        s.rich = (k: string, v: any) => t.rich(`${ns}.${k}`, v);
        s.raw = (k: string) => t.raw(`${ns}.${k}`);
        return s;
      },
      useFormatter: () => ({
        dateTime: (d: Date) => d.toISOString(),
        relativeTime: (d: Date) => `[relative] ${d.toISOString()}`,
      }),
    };
  });
};

const setupNavigationMock = () => {
  vi.mock("next/navigation", () => require("next-router-mock"));
  vi.mock("@/lib/navigation", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@/lib/navigation")>();
    const nextRouterMock = await import("next-router-mock");
    return {
      ...actual,
      useRouter: nextRouterMock.useRouter,
      usePathname: vi.fn(() => "/mock-pathname"),
      Link: (await import("next/link")).default,
      redirect: vi.fn(),
    };
  });
};

const createDefaultSuccessActionResult = () =>
  Promise.resolve({
    success: true,
    data: { id: "mock-id", message: "Acción exitosa" },
  });

export const mockActions = {
  admin: {
    impersonateUserAction: vi.fn(createDefaultSuccessActionResult),
    updateUserRoleAction: vi.fn(createDefaultSuccessActionResult),
  },
  builder: {
    updateCampaignContentAction: vi.fn(createDefaultSuccessActionResult),
  },
  campaigns: {
    createCampaignFromTemplateAction: vi.fn(createDefaultSuccessActionResult),
    assignSiteToCampaignAction: vi.fn(createDefaultSuccessActionResult),
    deleteCampaignAction: vi.fn(createDefaultSuccessActionResult),
    createCampaignAction: vi.fn(createDefaultSuccessActionResult),
    archiveCampaignAction: vi.fn(createDefaultSuccessActionResult),
    duplicateCampaignAction: vi.fn(createDefaultSuccessActionResult),
  },
  invitations: {
    acceptInvitationAction: vi.fn(createDefaultSuccessActionResult),
    sendWorkspaceInvitationAction: vi.fn(createDefaultSuccessActionResult),
  },
  onboarding: {
    completeOnboardingAction: vi.fn(createDefaultSuccessActionResult),
  },
  session: { signOutAction: vi.fn(() => Promise.resolve()) },
  sites: {
    createSiteAction: vi.fn(createDefaultSuccessActionResult),
    deleteSiteAction: vi.fn(createDefaultSuccessActionResult),
    updateSiteAction: vi.fn(createDefaultSuccessActionResult),
    checkSubdomainAvailabilityAction: vi.fn(createDefaultSuccessActionResult),
  },
  workspaces: {
    createWorkspaceAction: vi.fn(createDefaultSuccessActionResult),
    deleteWorkspaceAction: vi.fn(createDefaultSuccessActionResult),
    setActiveWorkspaceAction: vi.fn(() => Promise.resolve()),
    updateWorkspaceNameAction: vi.fn(createDefaultSuccessActionResult),
  },
  telemetry: {
    logVisitorAction: vi.fn(createDefaultSuccessActionResult),
    enrichVisitorLogAction: vi.fn(createDefaultSuccessActionResult),
  },
  password: {
    requestPasswordResetAction: vi.fn(createDefaultSuccessActionResult),
    updatePasswordAction: vi.fn(createDefaultSuccessActionResult),
  },
  newsletter: {
    subscribeToNewsletterAction: vi.fn(createDefaultSuccessActionResult),
  },
  profiles: {
    updateDashboardLayoutAction: vi.fn(createDefaultSuccessActionResult),
  },
  sentry: {
    testSentryServerErrorAction: vi.fn(createDefaultSuccessActionResult),
  },
};

const setupActionsMock = () => {
  vi.mock("@/lib/actions", () => ({
    ...mockActions,
    createAuditLog: vi.fn(),
    createPersistentErrorLog: vi.fn(),
  }));
};

const setupSupabaseMock = (overrides: { user?: User | null } = {}) => {
  const user =
    overrides.user === undefined ? DUMMY_DATA.MOCKED_USER : overrides.user;
  const session = user ? { user } : null;
  const supabaseMock = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockResolvedValue({ data: [], error: null }),
    update: vi.fn().mockResolvedValue({ data: [], error: null }),
    delete: vi.fn().mockResolvedValue({ data: [], error: null }),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: {}, error: null }),
    rpc: vi.fn().mockResolvedValue({ data: {}, error: null }),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user } }),
      getSession: vi.fn().mockResolvedValue({ data: { session }, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
  };
  vi.mock("@/lib/supabase/server", () => ({
    createClient: () => supabaseMock,
    createAdminClient: () => supabaseMock,
  }));
  vi.mock("@/lib/supabase/client", () => ({
    createClient: () => supabaseMock,
  }));
};

const setupToastMock = () => {
  vi.mock("react-hot-toast", () => ({
    default: { success: vi.fn(), error: vi.fn(), promise: vi.fn() },
  }));
};

const setupDashboardContextMock = () => {
  vi.mock("@/lib/context/DashboardContext", () => ({
    useDashboard: () => defaultContext, // <-- CORRECCIÓN CRÍTICA: Usa la variable definida en el ámbito del módulo.
    DashboardProvider: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
  }));
};

const setupInfrastructureMocks = () => {
  vi.mock("server-only", () => ({}));
  vi.mock("next/cache", () => ({
    revalidatePath: vi.fn(),
    revalidateTag: vi.fn(),
    cache: (fn: any) => fn,
  }));
};

// --- PASO 4: Orquestador Global Principal ---
export const setupGlobalMocks = () => {
  setupInfrastructureMocks();
  setupNextIntlMock();
  setupNavigationMock();
  setupActionsMock();
  setupSupabaseMock();
  setupToastMock();
  setupDashboardContextMock(); // Se llama al final, pero su `vi.mock` usa `defaultContext` que ya existe.
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Erradicación del `ReferenceError`**: ((Implementada)) Se ha reestructurado el archivo para definir una SSoT para los datos del contexto (`createMockDashboardContext` y `defaultContext`) ANTES de que cualquier `vi.mock` intente consumirla, eliminando la dependencia circular y la causa raíz del fallo sistémico.
 * 2. **Visión Holística y Robustez**: ((Implementada)) Aunque es un archivo monolítico, su estructura interna ahora sigue un orden de ejecución lógico y seguro (Factoría -> Estado -> Mocks -> Orquestador), haciéndolo robusto y predecible.
 * 3. **Cero Regresiones**: ((Implementada)) Este aparato contiene toda la funcionalidad de simulación del snapshot original, garantizando que ninguna prueba falle por falta de mocks.
 *
 * @subsection Melhorias Futuras
 * 1. **Deconstrucción Atómica (Recomendación Canónica)**: ((Vigente)) La recomendación de élite sigue siendo la deconstrucción de este archivo en los aparatos atómicos previamente diseñados (`tests/mocks/vi/*.ts`). Esta versión corregida es una solución de estabilización; la arquitectura atómica es superior para la mantenibilidad a largo plazo.
 *
 * =====================================================================
 */
// tests/mocks.ts
