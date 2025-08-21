// tests/mocks/vi/navigation.mock.ts
/**
 * @file tests/mocks/vi/navigation.mock.ts
 * @description Mock de navegación de élite. Simula `next/navigation` y
 *              `@/lib/navigation`, delegando al motor `next-router-mock` y
 *              aumentando su `useRouter` para incluir `refresh`.
 * @author L.I.A. Legacy
 * @version 5.0.0
 */
import { vi } from "vitest";
import mockRouter from "next-router-mock";
import NextLink from "next/link";

// SSoT para el mock de `refresh`, exportado para aserciones en pruebas.
export const refreshSpy = vi.fn();

export const routerMock = mockRouter;

export const setupNavigationMock = () => {
  vi.mock("next/navigation", () => {
    const {
      usePathname,
      useRouter: useMockRouter,
    } = require("next-router-mock");

    // --- INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA ---
    // Aumentamos el hook `useRouter` para que incluya nuestra simulación de `refresh`.
    const useCustomRouter = () => {
      const router = useMockRouter();
      return {
        ...router,
        refresh: refreshSpy,
      };
    };
    // --- FIN DE REFACTORIZACIÓN ARQUITECTÓNICA ---

    return {
      usePathname,
      useRouter: useCustomRouter, // Devolvemos nuestra versión aumentada.
      redirect: vi.fn((path: string) => mockRouter.push(path)),
    };
  });

  // Los mocks subsiguientes consumirán automáticamente la versión aumentada.
  vi.mock("@/lib/navigation", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@/lib/navigation")>();
    const mockedNavigation = await import("next/navigation");
    return {
      ...actual,
      useRouter: mockedNavigation.useRouter,
      usePathname: mockedNavigation.usePathname,
      Link: NextLink,
      redirect: mockedNavigation.redirect,
    };
  });

  vi.mock("next-intl/navigation", async (importOriginal) => {
    const actual =
      await importOriginal<typeof import("next-intl/navigation")>();
    const mockedNavigation = await import("next/navigation");
    return {
      ...actual,
      useRouter: mockedNavigation.useRouter,
      usePathname: mockedNavigation.usePathname,
      Link: NextLink,
      redirect: mockedNavigation.redirect,
    };
  });
};
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución Definitiva de TS2339**: ((Implementada)) Al aumentar el hook `useRouter` simulado en lugar de mutar el objeto importado, resolvemos el error de tipo de forma limpia y arquitectónicamente sólida.
 * 2. **Espía Exportado para Aserciones**: ((Implementada)) Ahora se exporta `refreshSpy`, permitiendo a los arneses de prueba importar este espía y hacer aserciones directas sobre él (`expect(refreshSpy).toHaveBeenCalled()`).
 *
 * @subsection Melhorias Futuras
 * 1. **Mock de `useSearchParams`**: ((Vigente)) La librería `next-router-mock` también provee un mock para `useSearchParams`. Este podría ser integrado de manera similar para aumentar la fidelidad de las pruebas que dependen de parámetros de búsqueda.
 *
 * =====================================================================
 */
// tests/mocks/vi/navigation.mock.ts
