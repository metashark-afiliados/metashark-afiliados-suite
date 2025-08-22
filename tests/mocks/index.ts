// tests/mocks/index.ts
/**
 * @file tests/mocks/index.ts
 * @description El Cerebro de la Simulación y SSoT para todos los mocks globales.
 *              Ha sido blindado con tipos explícitos en el mock de Zustand para
 *              garantizar una seguridad de tipos completa.
 * @author L.I.A. Legacy
 * @version 8.1.0
 */
import { vi } from "vitest";
import { create } from "zustand";

import { setupActionsMock } from "./actions.mock";
import { setupNavigationMock } from "./navigation.mock";
import { setupNextIntlMock } from "./next-intl.mock";
import { setupSupabaseMock } from "./supabase.mock";

export const mockOpenModal = vi.fn();
export const mockSetTheme = vi.fn();

// --- Mock de Zustand de Alta Fidelidad y Autocontenido ---
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
  // --- INICIO DE CORRECCIÓN DE TIPO ---
  openModal: vi.fn((view: AuthModalView) => {
    mockOpenModal(view);
    set({ isOpen: true, view });
  }),
  closeModal: vi.fn(() => set({ isOpen: false })),
  switchView: vi.fn((view: AuthModalView) => set({ view })),
  // --- FIN DE CORRECCIÓN DE TIPO ---
}));

vi.mock("@/lib/hooks/ui/useAuthModalStore", () => ({
  useAuthModalStore: useMockAuthModalStore,
}));
// --- Fin del Mock de Zustand ---

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

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
  cache: (fn: any) => fn,
}));

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
 * 1. **Seguridad de Tipos Completa**: ((Implementada)) ((Vigente)) Se han añadido tipos explícitos a los parámetros de las acciones del mock de Zustand, resolviendo el error `TS7006` y garantizando el cumplimiento de la regla `noImplicitAny`.
 *
 * =====================================================================
 */
// tests/mocks/index.ts
