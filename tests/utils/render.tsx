// tests/utils/render.tsx
/**
 * @file tests/utils/render.tsx
 * @description Aparato de infraestructura de pruebas: La Herramienta de Precisión.
 *              Integra todos los proveedores y simuladores para crear un
 *              entorno de renderizado de máxima fidelidad. Es la SSoT para
 *              el renderizado en toda la suite de pruebas.
 * @author L.I.A. Legacy
 * @version 4.0.0
 */
import React, { type ReactElement } from "react";
import {
  render as testingLibraryRender,
  renderHook as testingLibraryRenderHook,
  type RenderHookOptions,
  type RenderHookResult,
  type RenderOptions,
  type RenderResult,
} from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";

import { TooltipProvider } from "@/components/ui/tooltip";
import {
  DashboardProvider,
  type DashboardContextProps,
} from "@/lib/context/DashboardContext";
import { WorkspaceProvider } from "@/lib/hooks/useWorkspaceContext.tsx";
import { createMockDashboardContext } from "@tests/mocks/factories/context.factory";

// --- Sistema de Caché en Memoria para Mensajes i18n ---
let cachedTestMessages: Record<string, any> = {};

/**
 * @internal
 * @function setCachedTestMessages
 * @description Almacena en caché los mensajes de i18n precargados. Es llamada por `vitest.setup.ts`.
 * @param {Record<string, any>} messages - El objeto de mensajes.
 */
export function setCachedTestMessages(messages: Record<string, any>) {
  cachedTestMessages = messages;
}

/**
 * @internal
 * @function getCachedTestMessagesForMock
 * @description Permite a los mocks de i18n (`next-intl.mock.ts`) acceder a los mensajes cacheados.
 * @returns {Record<string, any>} El objeto de mensajes.
 */
export function getCachedTestMessagesForMock(): Record<string, any> {
  return cachedTestMessages;
}
// --- Fin del Sistema de Caché ---

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  dashboardContext?: Partial<DashboardContextProps>;
  locale?: string;
  messages?: Record<string, any>;
}

const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
): RenderResult => {
  const {
    dashboardContext: dashboardContextOverrides,
    locale = "es-ES",
    messages: overrideMessages,
    ...renderOptions
  } = options;

  const dashboardContextValue = createMockDashboardContext(
    dashboardContextOverrides
  );
  // Usa los mensajes cacheados por defecto, permitiendo overrides por prueba.
  const messagesToUse = overrideMessages || cachedTestMessages;

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <MemoryRouterProvider url={`/${locale}`}>
      <NextIntlClientProvider
        locale={locale}
        messages={messagesToUse}
        timeZone="UTC"
      >
        <DashboardProvider value={dashboardContextValue}>
          <WorkspaceProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </WorkspaceProvider>
        </DashboardProvider>
      </NextIntlClientProvider>
    </MemoryRouterProvider>
  );

  return testingLibraryRender(ui, { wrapper: Wrapper, ...renderOptions });
};

const customRenderHook = <TResult, TProps>(
  renderCallback: (initialProps: TProps) => TResult,
  options: Omit<RenderHookOptions<TProps>, "wrapper"> & CustomRenderOptions = {}
): RenderHookResult<TResult, TProps> => {
  const {
    dashboardContext: dashboardContextOverrides,
    locale = "es-ES",
    messages: overrideMessages,
    ...renderHookOptions
  } = options;

  const dashboardContextValue = createMockDashboardContext(
    dashboardContextOverrides
  );
  const messagesToUse = overrideMessages || cachedTestMessages;

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <MemoryRouterProvider url={`/${locale}`}>
      <NextIntlClientProvider
        locale={locale}
        messages={messagesToUse}
        timeZone="UTC"
      >
        <DashboardProvider value={dashboardContextValue}>
          <WorkspaceProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </WorkspaceProvider>
        </DashboardProvider>
      </NextIntlClientProvider>
    </MemoryRouterProvider>
  );

  return testingLibraryRenderHook(renderCallback, {
    wrapper: Wrapper,
    ...renderHookOptions,
  });
};

export * from "@testing-library/react";
export { customRender as render, customRenderHook as renderHook };

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Rendimiento de Pruebas de Élite**: ((Implementada)) ((Vigente)) El arnés ahora utiliza mensajes de i18n cacheados, eliminando la sobrecarga de I/O en cada renderizado y acelerando la ejecución de la suite de pruebas.
 * 2. **Simulación de Enrutamiento Completa**: ((Implementada)) ((Vigente)) La integración permanente del `MemoryRouterProvider` resuelve de forma definitiva el error `invariant expected app router to be mounted` y sincroniza el router con el `locale`.
 *
 * @subsection Melhorias Futuras
 * 1. **`ProvidersWrapper` Atómico**: ((Pendiente)) La lógica del `Wrapper` podría ser extraída a su propio componente `ProvidersWrapper.tsx` para una máxima atomicidad y reutilización.
 *
 * =====================================================================
 */
// tests/utils/render.tsx
