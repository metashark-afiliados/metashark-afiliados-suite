// tests/mocks/vi/navigation.mock.ts
/**
 * @file tests/mocks/vi/navigation.mock.ts
 * @description Mock de navegación corregido para replicar la estructura de
 *              módulo de `next-router-mock`.
 * @author L.I.A. Legacy
 * @version 2.2.0
 */
import { vi } from "vitest";
import mockRouter from "next-router-mock";

export const routerMock = mockRouter;

export const setupNavigationMock = () => {
  // --- INICIO DE CORRECCIÓN DE ESTRUCTURA DE MÓDULO ---
  vi.mock("next/navigation", async () => {
    const nextRouterMock = await import("next-router-mock");
    return {
      useRouter: nextRouterMock.useRouter,
      usePathname: vi.fn(() => "/mock-pathname"),
      // ... otras exportaciones de next/navigation si son necesarias
    };
  });

  vi.mock("@/lib/navigation", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@/lib/navigation")>();
    const nextRouterMock = await import("next-router-mock");
    const NextLink = (await import("next/link")).default;
    return {
      ...actual,
      useRouter: nextRouterMock.useRouter,
      usePathname: () => mockRouter.pathname,
      Link: NextLink,
      redirect: vi.fn((path: string) => mockRouter.push(path)),
    };
  });

  vi.mock("next-intl/navigation", async (importOriginal) => {
    const actual =
      await importOriginal<typeof import("next-intl/navigation")>();
    const nextRouterMock = await import("next-router-mock");
    const NextLink = (await import("next/link")).default;
    return {
      ...actual,
      useRouter: nextRouterMock.useRouter,
      usePathname: () => mockRouter.pathname,
      Link: NextLink,
      redirect: vi.fn((path: string) => mockRouter.push(path)),
    };
  });
  // --- FIN DE CORRECCIÓN DE ESTRUCTURA DE MÓDULO ---
};
