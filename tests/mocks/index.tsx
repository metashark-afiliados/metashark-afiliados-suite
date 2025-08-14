// tests/mocks/index.tsx
/**
 * @file tests/mocks/index.tsx
 * @description Librería de Utilidades para Mocks de Alta Fidelidad.
 *              Este aparato centraliza factorías de mocks configurables que pueden ser
 *              invocadas dentro de suites de pruebas para un control granular sobre
 *              las dependencias. Ha sido refactorizado a `.tsx` para soportar JSX
 *              en futuros mocks de componentes.
 * @author Raz Podestá
 * @version 1.0.0
 */
import React from "react";
import { vi } from "vitest";

/**
 * @public
 * @function mockNextIntl
 * @description Factoría de mock de alta fidelidad para `next-intl`.
 *              Simula `useTranslations` para que devuelva una función `t` que
 *              también posee el método `.rich`, replicando la API real.
 */
export const mockNextIntl = (): void => {
  vi.mock("next-intl", () => ({
    useTranslations: (namespace?: string) => {
      const t = (key: string, values?: any): string => {
        const valueString = values ? ` ${JSON.stringify(values)}` : "";
        return `[i18n] ${namespace ? `${namespace}.` : ""}${key}${valueString}`;
      };
      t.rich = (key: string, values: any): React.ReactElement => (
        <span data-testid="rich-text">
          {`[i18n-rich] ${namespace ? `${namespace}.` : ""}${key} ${JSON.stringify(values)}`}
        </span>
      );
      return t;
    },
    useFormatter: () => ({
      dateTime: (date: Date): string => date.toISOString(),
    }),
  }));
};

/**
 * @public
 * @function mockNavigation
 * @description Factoría de mock para `next/navigation` y `@/lib/navigation`.
 * @returns {{ mockRouter: { push: Function, replace: Function, refresh: Function } }} Un objeto con el mock del router para espiar sus métodos.
 */
export const mockNavigation = (): {
  mockRouter: {
    push: ReturnType<typeof vi.fn>;
    replace: ReturnType<typeof vi.fn>;
    refresh: ReturnType<typeof vi.fn>;
  };
} => {
  const mockRouter = {
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  };

  const MockLink = (props: any): React.ReactElement => {
    const { href, ...rest } = props;
    const finalHref =
      typeof href === "string" ? href : href.pathname || "/mock-path";
    return React.createElement("a", { href: finalHref, ...rest });
  };

  vi.mock("next/navigation", () => ({
    useRouter: () => mockRouter,
    usePathname: vi.fn(() => "/mock-pathname"),
    useSearchParams: vi.fn(() => new URLSearchParams()),
    redirect: vi.fn(),
    useParams: vi.fn(() => ({})),
  }));

  vi.mock("@/lib/navigation", () => ({
    useRouter: () => mockRouter,
    usePathname: vi.fn(() => "/mock-pathname"),
    Link: MockLink,
    redirect: vi.fn(),
    locales: ["en-US", "es-ES", "pt-BR"],
  }));

  return { mockRouter };
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Principio DRY**: ((Implementada)) Centraliza la lógica de simulación de módulos externos, eliminando la duplicación de código en las suites de pruebas y mejorando drásticamente la mantenibilidad.
 * 2. **Alta Fidelidad**: ((Implementada)) Los mocks replican la API de las librerías reales, incluyendo métodos anidados como `t.rich`, lo que permite pruebas más realistas.
 *
 * @subsection Melhorias Futuras
 * 1. **Factoría de Contexto de Dashboard**: ((Vigente)) Añadir una factoría `mockDashboardContext` para simplificar las pruebas de componentes que dependen del hook `useDashboard`.
 *
 * =====================================================================
 */
// tests/mocks/index.tsx
