// tests/unit/components/dashboard/WelcomeHero.test.tsx
/**
 * @file tests/unit/components/dashboard/WelcomeHero.test.tsx
 * @description Arnés de pruebas unitarias para el componente atómico `WelcomeHero`.
 *              Refactorizado para depender únicamente del setup de mocks global.
 * @author L.I.A. Legacy
 * @version 1.1.0
 */
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { WelcomeHero } from "@/components/dashboard/WelcomeHero";

// --- Mocks ---
// Eliminada la importación explícita de mockNextIntl.
// Ahora se confía en el setup global definido en tests/setup.ts
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
 * 1. **Coherencia de Mocks**: ((Implementada)) Se ha eliminado la importación directa de `mockNextIntl`, asegurando que el test depende únicamente del setup global de mocks, lo que mejora la consistencia y el Principio DRY de la infraestructura de pruebas.
 *
 * @subsection Melhorias Futuras
 * 1. **Pruebas de Accesibilidad (a11y)**: ((Vigente)) Integrar `jest-axe` para validar la estructura semántica.
 *
 * =====================================================================
 */
