// tests/unit/components/dev-console/DevSidebarClient.test.tsx
import { describe, expect, it, vi } from "vitest";
import { DevSidebarClient } from "@/components/dev-console/DevSidebarClient";
import * as NavLinkModule from "@/components/dev-console/sidebar/NavLink";
import * as RouteTreeViewerModule from "@/components/dev-console/sidebar/RouteTreeViewer";
import { render, screen } from "@tests/utils/render";

// Simular los hijos atómicos para aislar el ensamblador
vi.spyOn(NavLinkModule, "NavLink").mockImplementation(() => (
  <div data-testid="nav-link" />
));
vi.spyOn(RouteTreeViewerModule, "RouteTreeViewer").mockImplementation(() => (
  <div data-testid="route-tree-viewer" />
));

describe("Componente Ensamblador: DevSidebarClient", () => {
  it("debe renderizar la estructura principal y sus hijos atómicos", () => {
    render(<DevSidebarClient />);

    // Valida la estructura
    expect(
      screen.getByRole("link", { name: /DEV CONSOLE/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "[i18n] components.dev-console.DevSidebar.signOut",
      })
    ).toBeInTheDocument();

    // Valida que los hijos fueron ensamblados
    expect(screen.getAllByTestId("nav-link").length).toBeGreaterThan(0);
    expect(screen.getByTestId("route-tree-viewer")).toBeInTheDocument();
  });
});
