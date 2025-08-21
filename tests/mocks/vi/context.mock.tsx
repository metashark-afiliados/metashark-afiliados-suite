// tests/mocks/vi/context.mock.tsx
import React from "react";
import { vi } from "vitest";

import { createMockDashboardContext } from "@tests/mocks/factories/context.factory";

export const setupDashboardContextMock = () => {
  vi.mock("@/lib/context/DashboardContext", () => {
    const mockContextValue = createMockDashboardContext();
    return {
      useDashboard: vi.fn(() => mockContextValue),
      DashboardProvider: ({ children }: { children: React.ReactNode }) =>
        React.createElement(React.Fragment, null, children),
    };
  });
};
