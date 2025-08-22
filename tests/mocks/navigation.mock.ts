// tests/mocks/navigation.mock.ts
/**
 * @file tests/mocks/navigation.mock.ts
 * @description Mock de navegación de élite, definitivo y de máxima fidelidad.
 *              Exporta spies para permitir aserciones en las pruebas.
 * @author L.I.A. Legacy
 * @version 10.0.0
 */
import NextLink from "next/link";
import mockRouter from "next-router-mock";
import { vi } from "vitest";
import { useParams, usePathname, useRouter } from "next-router-mock/navigation";

export const refreshSpy = vi.fn();
export const redirectSpy = vi.fn((path: string) => mockRouter.push(path));

const mockedImplementation = {
  usePathname,
  useRouter: () => ({ ...useRouter(), refresh: refreshSpy }),
  useParams,
  Link: NextLink,
  redirect: redirectSpy,
};

export const setupNavigationMock = () => {
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

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Spy Exportable Consistente**: ((Implementada)) ((Vigente)) Se exporta `redirectSpy` de forma consistente para ser consumido por cualquier arnés de pruebas.
 *
 * =====================================================================
 */
// tests/mocks/navigation.mock.ts
