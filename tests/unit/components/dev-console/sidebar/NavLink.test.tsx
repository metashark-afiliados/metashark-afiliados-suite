// tests/unit/components/dev-console/sidebar/NavLink.test.tsx
/**
 * @file NavLink.test.tsx
 * @description Arnés de pruebas estabilizado con Inyección de Dependencias.
 * @author L.I.A. Legacy
 * @version 3.0.0
 */
import { describe, expect, it, vi } from "vitest";
import { Home } from "lucide-react";

import { NavLink } from "@/components/dev-console/sidebar/NavLink";
import { render, screen } from "@tests/utils/render";

describe("Primitiva de UI: NavLink", () => {
  it("debe aplicar estilos activos cuando el pathname inyectado coincide", () => {
    // Arrange: Inyectamos un mock de `usePathname` que devuelve una ruta específica.
    const mockUsePathname = vi.fn(() => "/active-link");

    // Act
    render(
      <NavLink
        href={"/active-link" as any}
        label="Active Link"
        icon={Home}
        _usePathname={mockUsePathname}
      />
    );

    // Assert
    expect(screen.getByRole("link", { name: "Active Link" })).toHaveClass(
      "bg-primary/10"
    );
    expect(mockUsePathname).toHaveBeenCalledOnce();
  });

  it("no debe aplicar estilos activos cuando el pathname inyectado no coincide", () => {
    // Arrange
    const mockUsePathname = vi.fn(() => "/other-page");

    // Act
    render(
      <NavLink
        href={"/inactive-link" as any}
        label="Inactive Link"
        icon={Home}
        _usePathname={mockUsePathname}
      />
    );

    // Assert
    expect(screen.getByRole("link", { name: "Inactive Link" })).not.toHaveClass(
      "bg-primary/10"
    );
  });
});
