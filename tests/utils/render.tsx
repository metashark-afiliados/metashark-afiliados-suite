// tests/utils/render.tsx
/**
 * @file tests/utils/render.tsx
 * @description Utilidad de renderizado de élite v7.1.
 *              Simple, robusta y completamente desacoplada de la lógica de mocks.
 *              Ahora soporta la inyección de `locale` para pruebas de i18n.
 * @author Raz Podestá
 * @version 7.1.0
 */
import React, { type ReactElement } from "react";
import {
  render as testingLibraryRender,
  type RenderResult,
} from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import {
  DashboardProvider,
  type DashboardContextProps,
} from "@/lib/context/DashboardContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import * as DUMMY_DATA from "@tests/mocks/data/database-state";

// Un objeto de mensajes vacío es suficiente porque nuestro mock global
// de `next-intl` ya no lee archivos.
const MOCK_MESSAGES = {};

interface CustomRenderOptions {
  dashboardContext?: Partial<DashboardContextProps>;
  locale?: string; // Add locale property
}

const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
): RenderResult => {
  const { dashboardContext: dashboardContextOverrides, locale = "es-ES" } =
    options; // Default to 'es-ES'

  const dashboardContextValue: DashboardContextProps = {
    user: DUMMY_DATA.MOCKED_USER,
    profile: DUMMY_DATA.db.profiles[0],
    workspaces: DUMMY_DATA.db.workspaces,
    activeWorkspace: DUMMY_DATA.db.workspaces[0],
    activeWorkspaceRole: "owner",
    pendingInvitations: [],
    modules: DUMMY_DATA.db.feature_modules,
    recentCampaigns: [],
    ...dashboardContextOverrides,
  };

  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return (
      <NextIntlClientProvider locale={locale} messages={MOCK_MESSAGES}>
        {" "}
        {/* Use provided locale */}
        <DashboardProvider value={dashboardContextValue}>
          <TooltipProvider>{children}</TooltipProvider>
        </DashboardProvider>
      </NextIntlClientProvider>
    );
  };

  return testingLibraryRender(ui, { wrapper: AllTheProviders });
};

export * from "@testing-library/react";
export { customRender as render };
