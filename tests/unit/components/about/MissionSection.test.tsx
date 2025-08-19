// tests/unit/components/about/MissionSection.test.tsx
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { MissionSection } from "@/components/about/MissionSection";
import { render } from "@tests/utils/render";

vi.mock("framer-motion", () => ({
  motion: {
    section: "section",
  },
}));

describe("Componente Atómico: MissionSection", () => {
  const mockProps = {
    title: "Nuestra Misión de Prueba",
    content: ["Primer párrafo de contenido.", "Segundo párrafo de contenido."],
  };

  it("debe renderizar el título y los párrafos de contenido correctamente", async () => {
    // Arrange
    await render(<MissionSection {...mockProps} />);

    // Assert
    expect(
      screen.getByRole("heading", {
        name: "Nuestra Misión de Prueba",
        level: 2,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Primer párrafo de contenido.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Segundo párrafo de contenido.")
    ).toBeInTheDocument();
  });
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Garantía de Calidad**: ((Implementada)) La suite de pruebas existente valida que el contrato de props y la lógica de renderizado del componente se mantienen intactos tras la refactorización a Client Component.
 *
 * @subsection Melhorias Futuras
 * 1. **Pruebas de Accesibilidad (a11y)**: ((Vigente)) La utilidad `render` ya integra `jest-axe`. Se pueden añadir aserciones explícitas para validar la conformidad con WCAG.
 *
 * =====================================================================
 */
// tests/unit/components/about/MissionSection.test.tsx
