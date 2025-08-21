// tests/mocks/vi/navigation.mock.ts
/**
 * @file tests/mocks/vi/navigation.mock.ts
 * @description Mock de navegación de élite. Simula `next/navigation` y
 *              `@/lib/navigation`, delegando al motor `next-router-mock` para
 *              una alta fidelidad y control granular en las pruebas.
 * @author L.I.A. Legacy
 * @version 3.0.0
 */
import { vi } from "vitest";
import mockRouter from "next-router-mock";
import NextLink from "next/link";

/**
 * @public
 * @constant routerMock
 * @description Re-exportación del singleton de `next-router-mock` para control
 *              directo en los arneses de prueba.
 */
export const routerMock = mockRouter;

/**
 * @public
 * @function setupNavigationMock
 * @description Orquesta la simulación de todos los módulos de enrutamiento.
 */
export const setupNavigationMock = () => {
  // --- INICIO DE REFACTORIZACIÓN DE ÉLITE ---
  // SSoT para el mock de `next/navigation`.
  // Es la implementación que todos los demás mocks consumirán.
  vi.mock("next/navigation", () => {
    const { usePathname, useRouter } = require("next-router-mock");
    return {
      usePathname, // Exporta el hook simulado
      useRouter, // Exporta el hook simulado
      redirect: vi.fn((path: string) => mockRouter.push(path)),
      // Añadir otros hooks si son necesarios
    };
  });

  // El mock de nuestro wrapper ahora consume el mock de `next/navigation`
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

  // El mock de `next-intl` también debe ser consistente
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
  // --- FIN DE REFACTORIZACIÓN DE ÉLITE ---
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución Sistémica de `usePathname`**: ((Implementada)) El mock para `next/navigation` ahora exporta `usePathname` y `useRouter` desde `next-router-mock`, resolviendo la causa raíz del error en tiempo de ejecución.
 *
 * =====================================================================
 */
// tests/mocks/vi/navigation.mock.ts
