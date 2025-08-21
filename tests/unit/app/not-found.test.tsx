// tests/unit/app/not-found.test.tsx
/**
 * @file not-found.test.tsx
 * @description Arnés de pruebas para `NotFound`. Valida el renderizado y la
 *              navegación utilizando la infraestructura de mocks `next-router-mock`.
 *              Ahora se ejecuta correctamente gracias a la infraestructura de
 *              pruebas "Reloj Suizo".
 * @author L.I.A. Legacy
 * @version 3.0.0
 */
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import NotFound from "@/app/not-found";
import { render } from "@tests/utils/render";

describe("Componente Atómico: NotFound", () => {
  it("debe renderizar los textos de i18n y los enlaces con los href correctos", () => {
    // Arrange
    render(<NotFound />);

    // Assert: Contenido de i18n
    expect(
      screen.getByRole("heading", {
        name: /\[i18n\] pages.NotFoundPage.title/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText("[i18n] pages.NotFoundPage.description")
    ).toBeInTheDocument();

    // Assert: Enlaces y Navegación
    const homeLink = screen.getByRole("link", {
      name: /\[i18n\] pages.NotFoundPage.backToHome/i,
    });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");

    const dashboardLink = screen.getByRole("link", {
      name: /\[i18n\] pages.NotFoundPage.goToDashboard/i,
    });
    expect(dashboardLink).toBeInTheDocument();
    expect(dashboardLink).toHaveAttribute("href", "/dashboard");
  });
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Prueba Estabilizada**: ((Implementada)) Este arnés de pruebas ahora pasa, validando que la infraestructura de mocks y el componente `NotFound` funcionan correctamente en conjunto.
 * =====================================================================
 */
// tests/unit/app/not-found.test.tsx
