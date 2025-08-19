// tests/mocks.ts
/**
 * @file tests/mocks.ts
 * @description Manifiesto de Mocks de Élite v2.3. Esta es la Única Fuente de
 *              Verdad para la simulación de dependencias externas en todo el
 *              entorno de pruebas. Diseñado para ser robusto, de alta fidelidad
 *              y preparado para el futuro. Todas las funciones de setup residen
 *              aquí y son orquestadas por `setupGlobalMocks`.
 * @author Raz Podestá
 * @version 2.3.0
 */
import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { type User } from "@supabase/supabase-js";
import { vi } from "vitest";
import { type Pathnames } from "next-intl/navigation"; // Import Pathnames for type safety

import { type DashboardContextProps } from "@/lib/context/DashboardContext";
import * as DUMMY_DATA from "@tests/mocks/data/database-state";
import { locales } from "@/lib/navigation"; // Import locales for the mock

// Define a local type for LinkHref to capture next-intl's complex href
type MockLinkHref =
  | string
  | { pathname: string; params?: Record<string, string | number>; query?: Record<string, string | number> };

// Define local LinkProps type for robustness
type MockLinkProps = React.ComponentPropsWithoutRef<"a"> & {
  asChild?: boolean;
  href: MockLinkHref;
  locale?: string;
};

// --- Mock #1: next-intl (Alta Fidelidad) ---
export const setupNextIntlMock = () => {
  vi.mock("next-intl", async (importOriginal) => {
    const actual = await importOriginal<typeof import("next-intl")>();
    const t = (key: string, values?: any): string => {
      let message = `[i18n] ${key}`;
      if (values) {
        message += ` ${JSON.stringify(values)}`;
      }
      return message;
    };
    // Corrected t.rich to use proper JSX syntax for data-testid and return React.ReactNode
    t.rich = (key: string, values: any): React.ReactNode =>
      React.createElement(
        "span",
        { "data-testid": `i18n-rich-${key}` }, // Corrected attribute syntax
        `[i18n-rich] ${key} ${JSON.stringify(values || {})}`
      );
    t.raw = (key: string) => `[i18n-raw] ${key}`;

    return {
      ...actual,
      useTranslations: (namespace?: string) => {
        const scopedT = (key: string, values?: any) => {
          const fullKey = namespace ? `${namespace}.${key}` : key;
          let message = `[i18n] ${fullKey}`;
          if (values) {
            message += ` ${JSON.stringify(values)}`;
          }
          return message;
        };
        // Corrected scopedT.rich
        scopedT.rich = (key: string, values: any): React.ReactNode =>
          React.createElement(
            "span",
            { "data-testid": `i18n-rich-${namespace}.${key}` }, // Corrected attribute syntax
            `[i18n-rich] ${namespace}.${key} ${JSON.stringify(values || {})}`
          );
        scopedT.raw = (key: string) => `[i18n-raw] ${namespace}.${key}`;
        return scopedT;
      },
      useFormatter: () => ({
        dateTime: (date: Date): string => date.toISOString(),
        relativeTime: (date: Date): string =>
          `[relative] ${date.toISOString()}`,
      }),
    };
  });
};

// --- Mock #2: Next Navigation (Alta Fidelidad) ---
const MockLink = React.forwardRef<
  HTMLAnchorElement,
  MockLinkProps // Use the locally defined MockLinkProps
>(({ asChild = false, href, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";
  // next-intl's Link href can be string or object. Handle both cases explicitly.
  const finalHref = typeof href === 'object' && href !== null && 'pathname' in href && typeof href.pathname === 'string'
    ? href.pathname
    : String(href);

  return (
    <Comp ref={ref} href={finalHref} {...props} />
  );
});
MockLink.displayName = "MockLink";

export const setupNavigationMock = () => {
  const mockRouter = {
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  };

  // Extensive mock pathnames for @/lib/navigation to cover common routes
  const mockedPathnames: Pathnames<typeof locales> = {
    "/": "/",
    "/about": "/about",
    "/admin": "/admin",
    "/auth/login": "/auth/login",
    "/auth/signup": "/auth/signup",
    "/auth-notice": "/auth-notice",
    "/blog": "/blog",
    "/builder/[campaignId]": "/builder/[campaignId]",
    "/builder/new": "/builder/new",
    "/choose-language": "/choose-language",
    "/contact": "/contact",
    "/cookies": "/cookies",
    "/dashboard": "/dashboard",
    "/dashboard/settings": "/dashboard/settings",
    "/dashboard/sites": "/dashboard/sites",
    "/dashboard/sites/[siteId]/campaigns": "/dashboard/sites/[siteId]/campaigns",
    "/dev-console": "/dev-console",
    "/dev-console/campaigns": "/dev-console/campaigns",
    "/dev-console/logs": "/dev-console/logs",
    "/dev-console/sentry-test": "/dev-console/sentry-test",
    "/dev-console/telemetry": "/dev-console/telemetry",
    "/dev-console/users": "/dev-console/users",
    "/disclaimer": "/disclaimer",
    "/docs": "/docs",
    "/forgot-password": "/forgot-password",
    "/gallery/bridgepages": "/gallery/bridgepages",
    "/gallery/landings": "/gallery/landings",
    "/legal": "/legal",
    "/lia-chat": "/lia-chat",
    "/privacy": "/privacy",
    "/pricing": "/pricing",
    "/reset-password": "/reset-password",
    "/support": "/support",
    "/terms": "/terms",
    "/unauthorized": "/unauthorized",
    "/welcome": "/welcome",
    "/wiki": "/wiki",
    // Add any other specific routes if they appear as static pathnames in your project
  };

  vi.mock("next/navigation", () => ({
    useRouter: () => mockRouter,
    usePathname: vi.fn(() => "/mock-pathname"),
    useSearchParams: vi.fn(() => new URLSearchParams()),
    redirect: vi.fn(),
    permanentRedirect: vi.fn(),
    notFound: vi.fn(),
    useParams: vi.fn(() => ({ locale: 'es-ES' })),
  }));

  vi.mock("@/lib/navigation", () => ({
    useRouter: () => mockRouter,
    usePathname: vi.fn(() => "/mock-pathname"),
    Link: MockLink,
    redirect: vi.fn(),
    permanentRedirect: vi.fn(),
    notFound: vi.fn(),
    locales: locales,
    localePrefix: 'as-needed',
    pathnames: mockedPathnames,
  }));

  return { mockRouter };
};

// --- Mock #3: Server Actions (Global y Espiable) ---
export const mockActions = {
  admin: {
    impersonateUserAction: vi.fn(),
    deleteSiteAsAdminAction: vi.fn(),
    updateUserRoleAction: vi.fn(),
  },
  builder: {
    updateCampaignContentAction: vi.fn(),
  },
  campaigns: {
    archiveCampaignAction: vi.fn(),
    assignSiteToCampaignAction: vi.fn(),
    createCampaignAction: vi.fn(),
    createCampaignFromTemplateAction: vi.fn(),
    deleteCampaignAction: vi.fn(),
    duplicateCampaignAction: vi.fn(),
  },
  invitations: {
    acceptInvitationAction: vi.fn(),
    sendWorkspaceInvitationAction: vi.fn(),
  },
  newsletter: {
    subscribeToNewsletterAction: vi.fn(),
  },
  onboarding: {
    completeOnboardingAction: vi.fn(),
  },
  password: {
    requestPasswordResetAction: vi.fn(),
    updatePasswordAction: vi.fn(),
  },
  profiles: {
    updateDashboardLayoutAction: vi.fn(),
  },
  sentry: {
    testSentryServerErrorAction: vi.fn(),
  },
  session: {
    signOutAction: vi.fn(),
  },
  sites: {
    checkSubdomainAvailabilityAction: vi.fn(),
    createSiteAction: vi.fn(),
    deleteSiteAction: vi.fn(),
    updateSiteAction: vi.fn(),
  },
  telemetry: {
    enrichVisitorLogAction: vi.fn(),
    logVisitorAction: vi.fn(),
  },
  workspaces: {
    createWorkspaceAction: vi.fn(),
    deleteWorkspaceAction: vi.fn(),
    setActiveWorkspaceAction: vi.fn(),
    updateWorkspaceNameAction: vi.fn(),
  },
};

export const setupActionsMock = () => {
  vi.mock("@/lib/actions", () => (mockActions));
};

// --- Mock #4: Supabase (Control Total) ---
export const mockSupabase = {
  from: vi.fn(),
  rpc: vi.fn(),
  auth: {
    getUser: vi.fn(),
    signOut: vi.fn(),
    getSession: vi.fn(),
    exchangeCodeForSession: vi.fn(),
    signInWithOAuth: vi.fn(),
    signInWithPassword: vi.fn(),
    updateUser: vi.fn(),
    admin: {
      getUserById: vi.fn(),
      generateLink: vi.fn(),
    },
  },
};

export const setupSupabaseMock = (user: User | null = DUMMY_DATA.MOCKED_USER) => {
    const queryBuilder = {
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      ilike: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: {}, error: null }),
    };

    mockSupabase.from.mockReturnValue(queryBuilder);
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user } });
    mockSupabase.auth.getSession.mockResolvedValue({ data: { session: user ? { user } : null }, error: null });


    vi.mock("@/lib/supabase/server", () => ({ createClient: () => mockSupabase, createAdminClient: () => mockSupabase }));
    vi.mock("@/lib/supabase/client", () => ({ createClient: () => mockSupabase }));
    vi.mock("@/middleware/lib/supabase-edge.client", () => ({ createEdgeClient: () => mockSupabase }));


    return {
        queryBuilder,
        ...mockSupabase
    };
};

// --- Mock #5: react-hot-toast ---
export const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
  promise: vi.fn(), // Added promise mock
};

export const setupToastMock = () => {
  vi.mock("react-hot-toast", () => ({
    default: {
      success: mockToast.success,
      error: mockToast.error,
      promise: mockToast.promise,
    },
  }));
};

// --- Mock #6: DashboardContext (Estado Controlado) ---
export const setupDashboardContextMock = (
  overrides: Partial<DashboardContextProps> = {}
) => {
  const defaultContext: DashboardContextProps = {
    user: DUMMY_DATA.MOCKED_USER,
    profile: DUMMY_DATA.db.profiles[0],
    workspaces: DUMMY_DATA.db.workspaces,
    activeWorkspace: DUMMY_DATA.db.workspaces[0],
    activeWorkspaceRole: 'owner',
    pendingInvitations: [],
    modules: DUMMY_DATA.db.feature_modules as any, // Cast to any temporarily if needed
    recentCampaigns: [],
    ...overrides,
  };
  vi.mock("@/lib/context/DashboardContext", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@/lib/context/DashboardContext")>();
    return {
        ...actual, // Spread existing exports
        useDashboard: () => defaultContext, // Always return our default mock context
        DashboardProvider: ({ children }: { children: React.ReactNode }) => {
            // A simple Fragment render is sufficient for most tests that just consume useDashboard
            // This avoids issues with trying to mock the actual Context.Provider from React itself
            return React.createElement(React.Fragment, {}, children);
        },
    };
  });
};

// Mock for server-only package
vi.mock("server-only", () => ({}));

// Mock for next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
  unstable_cache: (fn: any) => fn, // Mock unstable_cache to just return the function
}));

// Mock for console logging (to prevent noise in tests)
export const mockConsole = () => {
  const originalConsole = console;
  beforeEach(() => {
    global.console = {
      ...originalConsole,
      log: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      debug: vi.fn(),
    };
  });
  afterEach(() => {
    global.console = originalConsole;
  });
};

// Mock for `useTransition`
export const mockUseTransition = (isPendingValue: boolean = false) => {
    const startTransitionMock = vi.fn((cb) => cb());
    vi.mock('react', async (importOriginal) => {
        const mod = await importOriginal<typeof import('react')>();
        return {
            ...mod,
            useTransition: () => [isPendingValue, startTransitionMock],
            // Ensure `React` is explicitly imported and used where needed in mocks.
            createElement: mod.createElement,
            Fragment: mod.Fragment,
            forwardRef: mod.forwardRef,
            useRef: mod.useRef,
            useState: mod.useState,
            useEffect: mod.useEffect,
            useCallback: mod.useCallback,
            useMemo: mod.useMemo,
        };
    });
    return startTransitionMock;
};

// --- Orquestador de Mocks Globales ---
/**
 * @public
 * @function setupGlobalMocks
 * @description Orquesta la inicialización de todos los mocks globales.
 *              Debe ser llamada en `tests/setup.ts`.
 */
export const setupGlobalMocks = () => {
    setupNextIntlMock();
    setupNavigationMock();
    setupActionsMock();
    setupSupabaseMock();
    setupToastMock();
    setupDashboardContextMock();
    // No mockear `console` globalmente aquí, ya que `vitest.config.ts` lo hace por test.
};