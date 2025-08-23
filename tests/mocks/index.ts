// tests/mocks/index.ts
/**
 * @file tests/mocks/index.ts
 * @description El Cerebro de la Simulación y SSoT para todos los mocks globales.
 *              Ha sido blindado con un mock para `React.cache` para garantizar la
 *              compatibilidad del entorno de pruebas de Vitest con la capa de datos
 *              que utiliza React Server Components APIs.
 * @author L.I.A. Legacy
 * @version 9.0.0
 */
import { vi } from "vitest";
import { create } from "zustand";

import { setupActionsMock } from "./actions.mock";
import { setupNavigationMock } from "./navigation.mock";
import { setupNextIntlMock } from "./next-intl.mock";
import { setupSupabaseMock } from "./supabase.mock";

// --- INICIO DE CORRECCIÓN DE INFRAESTRUCTURA: Mock de React.cache ---
vi.mock("react", async (importOriginal) => {
  const actualReact = await importOriginal<typeof import("react")>();
  return {
    ...actualReact,
    cache: (fn: any) => fn, // Simulación simple: devuelve la función original
  };
});

// Mock para next/cache que también usa React.cache internamente
vi.mock("next/cache", () => ({
  unstable_cache: (fn: any) => fn,
}));
// --- FIN DE CORRECCIÓN DE INFRAESTRUCTURA ---

export const mockOpenModal = vi.fn();
export const mockSetTheme = vi.fn();

type AuthModalView = "login" | "signup";
interface MockAuthModalState {
  isOpen: boolean;
  view: AuthModalView;
  openModal: (view: AuthModalView) => void;
  closeModal: () => void;
  switchView: (view: AuthModalView) => void;
}

const useMockAuthModalStore = create<MockAuthModalState>((set) => ({
  isOpen: false,
  view: "login",
  openModal: vi.fn((view: AuthModalView) => {
    mockOpenModal(view);
    set({ isOpen: true, view });
  }),
  closeModal: vi.fn(() => set({ isOpen: false })),
  switchView: vi.fn((view: AuthModalView) => set({ view })),
}));

vi.mock("@/lib/hooks/ui/useAuthModalStore", () => ({
  useAuthModalStore: useMockAuthModalStore,
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({ setTheme: mockSetTheme, theme: "dark" }),
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    promise: vi.fn(
      (
        promise: Promise<any>,
        {
          success,
        }: {
          loading: React.ReactNode;
          success: (data: any) => React.ReactNode;
          error: (err: any) => React.ReactNode;
        }
      ) => promise.then((data) => success(data))
    ),
  },
}));

vi.mock("server-only", () => ({}));

export const setupGlobalMocks = () => {
  setupNextIntlMock();
  setupNavigationMock();
  setupActionsMock();
  setupSupabaseMock();
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error de Infraestructura**: ((Implementada)) El mock para `React.cache` y `next/cache` resuelve el `TypeError` fundamental, estabilizando el entorno de pruebas para toda la capa de datos.
 *
 * =====================================================================
 */
