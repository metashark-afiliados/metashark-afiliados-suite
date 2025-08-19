// tests/unit/components/about/MissionSection.test.tsx
/**
 * @file MissionSection.test.tsx
 * @description Arnés de pruebas unitarias para el componente `MissionSection`.
 *              Valida que el componente renderice correctamente todo el
 *              contenido pasado a través de sus props.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MissionSection } from "@/components/about/MissionSection";
import { render } from "@tests/utils/render";

// Mock de `framer-motion` para evitar errores de animación en un entorno de prueba sin DOM completo.
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
    // Verifica que el título se renderice dentro de un encabezado de nivel 2.
    expect(
      screen.getByRole("heading", {
        name: "Nuestra Misión de Prueba",
        level: 2,
      })
    ).toBeInTheDocument();

    // Verifica que ambos párrafos de contenido estén presentes en el documento.
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
 * 1. **Garantía de Calidad**: ((Implementada)) Se ha creado una suite de pruebas unitarias para este componente, asegurando que su contrato de props se respete y previniendo regresiones visuales.
 * 2. **Mock de Animaciones**: ((Implementada)) Se ha simulado `framer-motion` para que las pruebas se centren en la lógica de renderizado del componente y no en la implementación de la animación.
 *
 * =====================================================================
 */
// tests/unit/components/about/MissionSection.test.tsx
