// tests/unit/components/dashboard/WelcomeHero.test.tsx
/**
 * @file WelcomeHero.test.tsx
 * @description Arnés de pruebas unitarias para el componente atómico `WelcomeHero`.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { render, screen } from "@testing-library/react";
import { mockNextIntl } from "tests/mocks";
import { describe, expect, it, vi } from "vitest";

import { WelcomeHero } from "@/components/dashboard/WelcomeHero";

// --- Mocks ---
mockNextIntl();
vi.mock("@/components/ui/SearchInput", () => ({
  SearchInput: (props: any) => (
    <input
      type="search"
      placeholder={props.placeholder}
      aria-label="search-input"
    />
  ),
}));

describe("Aparato Atómico: WelcomeHero", () => {
  it("debe renderizar el título de bienvenida personalizado y el placeholder de búsqueda", async () => {
    // Arrange
    const props = {
      username: "Raz",
      searchPlaceholder: "Search everything...",
    };

    // Act
    render(<WelcomeHero {...props} />);

    // Assert
    expect(
      screen.getByRole("heading", {
        name: /\[i18n\] DashboardPage.welcomeHero.title {\"username\":\"Raz\"}/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Search everything...")
    ).toBeInTheDocument();
  });
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Prueba de Contrato de Props**: ((Implementada)) La prueba valida que el componente renderiza correctamente el contenido dinámico (`username`, `searchPlaceholder`) pasado a través de sus props.
 *
 * @subsection Melhorias Futuras
 * 1. **Pruebas de Accesibilidad (a11y)**: ((Vigente)) Integrar `jest-axe` para validar la estructura semántica.
 *
 * =====================================================================
 */
// tests/unit/components/dashboard/WelcomeHero.test.tsx
