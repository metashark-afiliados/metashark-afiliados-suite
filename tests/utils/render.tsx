// tests/utils/render.tsx
/**
 * @file tests/utils/render.tsx
 * @description Orquestador de Renderizado de Élite y SSoT para la ejecución de pruebas.
 * @author Raz Podestá
 * @version 14.0.0
 */
import React, { type ReactElement } from "react";
import {
  render as testingLibraryRender,
  type RenderOptions,
  type RenderResult,
} from "@testing-library/react";

import { createMockDashboardContext } from "@tests/mocks/factories/context.factory";
import { ProvidersWrapper } from "./ProvidersWrapper";

const MOCK_MESSAGES = {};

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  dashboardContext?: Partial<
    React.ComponentProps<typeof ProvidersWrapper>["dashboardContextValue"]
  >;
  locale?: string;
  messages?: Record<string, any>;
}

/**
 * @public
 * @function customRender
 * @description Renderiza un componente React en un entorno de prueba de alta fidelidad.
 *              Es la única SSoT para proveer contexto a los componentes bajo prueba.
 * @param {ReactElement} ui - El componente a renderizar.
 * @param {CustomRenderOptions} [options] - Opciones para anular la configuración por defecto.
 * @returns {RenderResult} El resultado de React Testing Library.
 */
const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
): RenderResult => {
  const {
    dashboardContext: dashboardContextOverrides,
    locale = "es-ES",
    messages,
    ...renderOptions
  } = options;

  const dashboardContextValue = createMockDashboardContext(
    dashboardContextOverrides
  );
  const finalMessages = messages
    ? { ...MOCK_MESSAGES, ...messages }
    : MOCK_MESSAGES;

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <ProvidersWrapper
      dashboardContextValue={dashboardContextValue}
      locale={locale}
      messages={finalMessages}
    >
      {children}
    </ProvidersWrapper>
  );

  return testingLibraryRender(ui, { wrapper: Wrapper, ...renderOptions });
};

export * from "@testing-library/react";
export { customRender as render };

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **SSoT de Inyección de Contexto**: ((Implementada)) Con la eliminación del mock global, esta utilidad se convierte en la única y predecible fuente de contexto para las pruebas.
 *
 * =====================================================================
 */
// tests/utils/render.tsx
