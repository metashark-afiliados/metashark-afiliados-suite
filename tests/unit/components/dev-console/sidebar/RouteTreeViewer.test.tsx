// tests/unit/components/dev-console/sidebar/RouteTreeViewer.test.tsx
/**
 * @file RouteTreeViewer.test.tsx
 * @description Arnés de pruebas de élite para el componente de presentación puro
 *              `RouteTreeViewer`.
 * @author L.I.A. Legacy
 * @version 2.2.0
 */
import { describe, expect, it } from "vitest";
// --- INICIO DE CORRECCIÓN DE DEPENDENCIA ---
import { userEvent } from "@testing-library/user-event";
// --- FIN DE CORRECCIÓN DE DEPENDENCIA ---

import {
  RouteTreeViewer,
  type RouteNode,
} from "@/components/dev-console/sidebar/RouteTreeViewer";
import { render, screen } from "@tests/utils/render";

const mockRouteManifest: RouteNode = {
  name: "root",
  path: "/",
  isPage: true,
  children: [{ name: "about", path: "/about", isPage: true, children: [] }],
};

describe("Componente de Presentación: RouteTreeViewer", () => {
  it("debe mostrar el estado de carga cuando `routes` es null", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<RouteTreeViewer routes={null} />);

    // Act
    const trigger = screen.getByRole("button", { name: /routeViewer/i });
    await user.click(trigger);

    // Assert
    expect(
      screen.getByText("[i18n] components.dev-console.DevSidebar.loadingRoutes")
    ).toBeInTheDocument();
  });

  it("debe renderizar el árbol de rutas cuando se proporcionan los datos", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<RouteTreeViewer routes={mockRouteManifest} />);

    // Act
    const trigger = screen.getByRole("button", { name: /routeViewer/i });
    await user.click(trigger);

    // Assert
    expect(screen.getByText("root")).toBeInTheDocument();
    expect(screen.getByText("about")).toBeInTheDocument();
    expect(
      screen.queryByText(
        "[i18n] components.dev-console.DevSidebar.loadingRoutes"
      )
    ).not.toBeInTheDocument();
  });
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Dependencia Crítica (TS2552)**: ((Implementada)) Se ha añadido la importación de `userEvent`, resolviendo el error de compilación.
 *
 * =====================================================================
 */
// tests/unit/components/dev-console/sidebar/RouteTreeViewer.test.tsx
