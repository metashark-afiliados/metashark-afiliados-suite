// tests/unit/components/dev-console/DevSidebarClient.test.tsx
/**
 * @file DevSidebarClient.test.tsx
 * @description Arnés de pruebas para `DevSidebarClient`, validando la
 *              interacción de cierre de sesión refactorizada.
 * @author L.I.A. Legacy
 * @version 2.0.0
 */
import { userEvent } from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DevSidebarClient } from "@/components/dev-console/DevSidebarClient";
import * as NavLinkModule from "@/components/dev-console/sidebar/NavLink";
import * as RouteTreeViewerModule from "@/components/dev-console/sidebar/RouteTreeViewer";
import { mockActions } from "@tests/mocks/vi/actions.mock";
import { render, screen } from "@tests/utils/render";

vi.spyOn(NavLinkModule, "NavLink").mockImplementation(() => (
  <div data-testid="nav-link" />
));
vi.spyOn(RouteTreeViewerModule, "RouteTreeViewer").mockImplementation(() => (
  <div data-testid="route-tree-viewer" />
));

describe("Componente Ensamblador: DevSidebarClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debe renderizar la estructura principal y sus hijos atómicos", () => {
    // Arrange
    render(<DevSidebarClient />);

    // Assert
    expect(
      screen.getByRole("button", {
        name: "[i18n] components.dev-console.DevSidebar.signOut",
      })
    ).toBeInTheDocument();
    expect(screen.getAllByTestId("nav-link").length).toBeGreaterThan(0);
    expect(screen.getByTestId("route-tree-viewer")).toBeInTheDocument();
  });

  it("debe invocar signOutAction al hacer clic en el botón de cerrar sesión", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<DevSidebarClient />);
    const signOutButton = screen.getByRole("button", {
      name: /signOut/i,
    });

    // Act
    await user.click(signOutButton);

    // Assert
    expect(mockActions.session.signOutAction).toHaveBeenCalledOnce();
  });
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Validación de Interacción**: ((Implementada)) La prueba ahora valida que `userEvent.click` invoca correctamente la `signOutAction` simulada, confirmando el contrato funcional del componente refactorizado.
 *
 * @subsection Melhorias Futuras
 * 1. **Prueba de Estado de Carga**: ((Vigente)) Se podría extender la prueba para simular una `signOutAction` de larga duración y verificar que el botón se deshabilita y muestra el spinner.
 *
 * =====================================================================
 */
// tests/unit/components/dev-console/DevSidebarClient.test.tsx
