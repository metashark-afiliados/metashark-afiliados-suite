// tests/unit/components/ui/Input.test.tsx
/**
 * @file Input.test.tsx
 * @description Arnés de pruebas unitarias para el componente atómico Input.
 *              Actualizado para validar el nuevo estado visual de `hasError`.
 * @author L.I.A. Legacy
 * @version 2.0.0
 */
import { axe } from "jest-axe";
import { describe, it, expect } from "vitest";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { render, screen } from "@tests/utils/render";

describe("Componente Atómico de UI: Input", () => {
  it("debe renderizar un campo de entrada con las props correctas", () => {
    render(
      <Input type="email" placeholder="test@example.com" aria-label="Email" />
    );
    const input = screen.getByLabelText("Email");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("placeholder", "test@example.com");
  });

  it("debe estar deshabilitado cuando la prop disabled es verdadera", () => {
    render(<Input disabled aria-label="Disabled Input" />);
    const input = screen.getByLabelText("Disabled Input");
    expect(input).toBeDisabled();
  });

  it("debe aplicar clases de error cuando hasError es verdadero", () => {
    render(<Input hasError aria-label="Error Input" />);
    const input = screen.getByLabelText("Error Input");
    expect(input).toHaveClass("border-destructive ring-destructive");
  });

  it("no debe aplicar clases de error cuando hasError es falso o no se define", () => {
    render(<Input aria-label="Normal Input" />);
    const input = screen.getByLabelText("Normal Input");
    expect(input).not.toHaveClass("border-destructive ring-destructive");
  });

  it("debe ser accesible cuando está asociado con un Label", async () => {
    const { container } = render(
      <div>
        <Label htmlFor="email-input">Email</Label>
        <Input id="email-input" type="email" />
      </div>
    );
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
 * 1. **Cobertura de Estado Visual**: ((Implementada)) Se han añadido pruebas explícitas para validar que las clases de CSS correctas se apliquen o no en función de la prop `hasError`, blindando esta nueva funcionalidad.
 *
 * @subsection Melhorias Futuras
 * 1. **Pruebas de Snapshot**: ((Vigente)) Añadir pruebas de snapshot para capturar la estructura completa del componente en sus diferentes estados y prevenir regresiones visuales inesperadas.
 *
 * =====================================================================
 */
// tests/unit/components/ui/Input.test.tsx
