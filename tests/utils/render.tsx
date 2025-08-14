// tests/utils/render.tsx
/**
 * @file tests/utils/render.tsx
 * @description Utilidad de renderizado de élite para pruebas de componentes de React.
 *              Este aparato envuelve el `render` de React Testing Library con proveedores
 *              de contexto globales (`TooltipProvider`) y una verificación de
 *              accesibilidad automática con `jest-axe`. Cada componente renderizado
 *              en pruebas es auditado contra las normas WCAG, garantizando un
 *              estándar de accesibilidad de producción.
 * @author Raz Podestá
 * @version 1.0.0
 */
import React, { type ReactElement } from "react";
import {
  render,
  type RenderOptions,
  type RenderResult,
} from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { expect } from "vitest";

import { TooltipProvider } from "@/components/ui/tooltip";

// Extiende `expect` con los matchers de `jest-axe`.
expect.extend(toHaveNoViolations);

/**
 * @private
 * @component AllTheProviders
 * @description Un componente wrapper que provee todos los contextos globales
 *              necesarios para que los componentes se rendericen correctamente en las pruebas.
 * @param {{ children: React.ReactNode }} props - Los componentes hijos a envolver.
 * @returns {React.ReactElement}
 */
const AllTheProviders = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  // Nota: NextIntlClientProvider no es necesario aquí porque los mocks de
  // `next-intl` simulan los hooks directamente, haciendo que los componentes
  // funcionen sin un proveedor real en el entorno de pruebas.
  return <TooltipProvider>{children}</TooltipProvider>;
};

/**
 * @public
 * @function customRender
 * @description Exportación personalizada de la función `render` de RTL.
 * @param {ReactElement} ui - El componente de React a renderizar.
 * @param {Omit<RenderOptions, "wrapper">} [options] - Opciones de renderizado de RTL.
 * @returns {Promise<RenderResult>} El resultado del renderizado.
 */
const customRender = async (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
): Promise<RenderResult> => {
  const renderResult = render(ui, { wrapper: AllTheProviders, ...options });

  // Auditoría de accesibilidad automática.
  const results = await axe(renderResult.container);
  expect(results).toHaveNoViolations();

  return renderResult;
};

// Re-exporta todo desde @testing-library/react
export * from "@testing-library/react";

// Sobrescribe la exportación de `render` con nuestra versión personalizada.
export { customRender as render };

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Auditoría de Accesibilidad Automática**: ((Implementada)) La integración con `jest-axe` asegura que cada componente renderizado en pruebas sea validado contra violaciones de accesibilidad, un pilar de la ingeniería de UI de élite.
 * 2. **Principio DRY**: ((Implementada)) Centraliza la provisión de contextos globales, eliminando la necesidad de envolver cada prueba de componente en proveedores.
 *
 * @subsection Melhorias Futuras
 * 1. **Proveedor de Contexto de Dashboard Simulado**: ((Vigente)) Se podría añadir un `DashboardProvider` simulado al wrapper `AllTheProviders` para simplificar las pruebas de componentes que dependen del hook `useDashboard`.
 *
 * =====================================================================
 */
// tests/utils/render.tsx
