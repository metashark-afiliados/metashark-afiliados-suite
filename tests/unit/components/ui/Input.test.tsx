// tests/unit/components/ui/Input.test.tsx
/**
 * @file Input.test.tsx
 * @description Arnés de pruebas unitarias de élite para el componente `Input`.
 *              Valida el renderizado, los estados (incluyendo hasError) y la
 *              accesibilidad básica.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Input } from "@/components/ui/input";
import { render } from "@tests/utils/render";

describe("Componente Atómico de Élite: Input", () => {
  it("debe renderizar correctamente con un placeholder y un tipo", async () => {
    await render(<Input type="email" placeholder="Enter your email" />);
    const input = screen.getByPlaceholderText("Enter your email");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "email");
  });

  it("debe aplicar clases de error cuando hasError es true", async () => {
    await render(<Input hasError placeholder="Input with error" />);
    const input = screen.getByPlaceholderText("Input with error");
    expect(input).toHaveClass("border-destructive");
    expect(input).toHaveClass("text-destructive");
    expect(input).toHaveClass("focus-visible:ring-destructive");
  });

  it("no debe aplicar clases de error cuando hasError es false o undefined", async () => {
    await render(<Input placeholder="Normal input" />);
    const input = screen.getByPlaceholderText("Normal input");
    expect(input).not.toHaveClass("border-destructive");
  });

  it("debe estar deshabilitado cuando la prop disabled es true", async () => {
    await render(<Input disabled placeholder="Disabled input" />);
    expect(screen.getByPlaceholderText("Disabled input")).toBeDisabled();
  });
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Arnés de Pruebas Unitarias**: ((Implementada)) Se ha creado una suite de pruebas completa desde cero, validando la nueva funcionalidad `hasError` y los estados base del componente.
 *
 * @subsection Melhorias Futuras
 * 1. **Pruebas de Accesibilidad (a11y)**: ((Vigente)) Integrar `jest-axe` para validar que el componente, especialmente en su estado de error, sigue siendo accesible.
 *
 * =====================================================================
 */
// tests/unit/components/ui/Input.test.tsx
