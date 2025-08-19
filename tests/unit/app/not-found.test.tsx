// tests/unit/app/not-found.test.tsx
/**
 * @file not-found.test.tsx
 * @description Arnés de pruebas unitarias para el componente `NotFound`.
 *              Valida que el componente refactorizado renderice correctamente el
 *              contenido internacionalizado y los enlaces de navegación.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import NotFound from "@/app/not-found";
import { render } from "@tests/utils/render";

describe("Componente Atómico: NotFound", () => {
  it("debe renderizar los textos internacionalizados y los enlaces correctamente", async () => {
    // Arrange
    await render(<NotFound />, {
      namespaces: ["pages.NotFoundPage"],
      locale: "es-ES",
    });

    // Assert Text
    expect(
      screen.getByRole("heading", { name: "Error 404: Página No Encontrada" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "La página que buscas no existe o ha sido movida. Volvamos al camino correcto."
      )
    ).toBeInTheDocument();

    // Assert Links
    const homeLink = screen.getByRole("link", { name: "Volver al Inicio" });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/es-ES");

    const dashboardLink = screen.getByRole("link", { name: "Ir al Dashboard" });
    expect(dashboardLink).toBeInTheDocument();
    expect(dashboardLink).toHaveAttribute("href", "/es-ES/dashboard");
  });
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Garantía de Calidad**: ((Implementada)) Se ha creado una nueva suite de pruebas que valida la refactorización, asegurando que la nueva versión internacionalizada se renderice correctamente.
 *
 * =====================================================================
 */
// tests/unit/app/not-found.test.tsx
