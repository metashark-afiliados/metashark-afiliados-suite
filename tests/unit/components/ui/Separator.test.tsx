// tests/unit/components/ui/Separator.test.tsx
/**
 * @file Separator.test.tsx
 * @description Arnés de pruebas unitarias para el componente atómico Separator.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";

import { Separator } from "@/components/ui/separator";
import { render, screen } from "@tests/utils/render";

describe("Componente Atómico de UI: Separator", () => {
  it("debe renderizar un separador horizontal por defecto", () => {
    render(<Separator data-testid="separator" />);
    const separator = screen.getByTestId("separator");
    expect(separator).toBeInTheDocument();
    // Por defecto, Radix UI le asigna role="none" si es decorativo.
    expect(separator).toHaveAttribute("role", "none");
    expect(separator).toHaveAttribute("data-orientation", "horizontal");
  });

  it("debe renderizar un separador vertical cuando se especifica", () => {
    render(<Separator orientation="vertical" data-testid="separator" />);
    const separator = screen.getByTestId("separator");
    expect(separator).toHaveAttribute("data-orientation", "vertical");
  });

  it("no debe tener violaciones de accesibilidad", async () => {
    const { container } = render(<Separator />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Blindaje de Calidad**: ((Implementada)) El arnés valida las variantes y la accesibilidad del componente.
 *
 * @subsection Melhorias Futuras
 * 1. **Pruebas de Estilo**: ((Vigente)) Se podrían añadir pruebas de snapshot con `vitest-axe` para verificar que las clases de Tailwind correctas se aplican a cada orientación.
 *
 * =====================================================================
 */
