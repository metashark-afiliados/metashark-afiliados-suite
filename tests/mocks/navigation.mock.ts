// tests/mocks/navigation.mock.ts
/**
 * @file navigation.mock.ts
 * @description Mock de navegación de élite, definitivo y de máxima fidelidad.
 *              Refactorizado para exportar un mock funcional de `useSearchParams`
 *              y otros hooks de enrutamiento, resolviendo fallos sistémicos.
 * @author L.I.A. Legacy
 * @version 10.0.0
 */
import NextLink from "next/link";
import mockRouter from "next-router-mock";
import { vi } from "vitest";
// Importa los hooks simulados de la librería de mocks de enrutamiento
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams, // <-- IMPORTACIÓN CRÍTICA
} from "next-router-mock/navigation";

// Spies para aserciones en pruebas
export const refreshSpy = vi.fn();
export const redirectSpy = vi.fn((path: string) => mockRouter.push(path));

const mockedImplementation = {
  usePathname,
  useRouter: () => ({ ...useRouter(), refresh: refreshSpy }),
  useParams,
  useSearchParams, // <-- EXPORTACIÓN CRÍTICA
  Link: NextLink,
  redirect: redirectSpy,
};

export const setupNavigationMock = () => {
  // Mockea ambas librerías de enrutamiento
  vi.mock("next-intl/navigation", () => ({
    createLocalizedPathnamesNavigation: vi.fn(() => mockedImplementation),
  }));

  vi.mock("@/lib/navigation", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@/lib/navigation")>();
    return {
      ...actual,
      ...mockedImplementation,
    };
  });

  vi.mock("next/navigation", () => ({
    ...mockedImplementation,
  }));
};
