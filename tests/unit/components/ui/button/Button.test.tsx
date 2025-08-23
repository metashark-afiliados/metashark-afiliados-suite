// tests/unit/components/ui/button/Button.test.tsx
/**
 * @file Button.test.tsx
 * @description Arnés de pruebas unitarias de élite para el componente Button.
 *              Valida todos los casos de uso, incluyendo el nuevo estado `isLoading`
 *              centralizado.
 * @author L.I.A. Legacy
 * @version 2.2.0
 */
import { ArrowRight } from "lucide-react";
import { axe } from "jest-axe";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";

import { Button } from "@/components/ui/button";
import { render, screen } from "@tests/utils/render";

describe("Componente Atómico de UI: Button", () => {
  it("debe renderizar un botón con el texto correcto", () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it("debe invocar el manejador onClick cuando se hace clic", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("debe estar deshabilitado cuando la prop disabled es verdadera", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole("button", { name: /disabled/i });
    expect(button).toBeDisabled();
  });

  it("debe renderizar como una etiqueta de ancla con el href correcto", () => {
    render(<Button href="/dashboard">Go to Dashboard</Button>);
    const link = screen.getByRole("link", { name: /go to dashboard/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/dashboard");
  });

  it("debe renderizar como un componente hijo cuando asChild es verdadero", () => {
    render(
      <Button asChild>
        <div>Child Element</div>
      </Button>
    );
    const childElement = screen.getByText("Child Element");
    expect(childElement).toBeInTheDocument();
    expect(childElement.tagName).toBe("DIV");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("debe mostrar un spinner y estar deshabilitado en estado de carga", () => {
    render(
      <Button isLoading loadingText="Saving...">
        Save
      </Button>
    );
    const button = screen.getByRole("button", { name: /saving.../i });
    expect(button).toBeDisabled();
    expect(screen.getByText("Saving...")).toBeInTheDocument();
    // El texto original se oculta por CSS (opacity-0), por lo que no debe ser visible para las aserciones
    expect(screen.queryByText("Save")).not.toBeVisible();
  });

  it("debe renderizar iconos a la izquierda y a la derecha", () => {
    render(
      <Button
        leftIcon={<ArrowRight data-testid="left-icon" />}
        rightIcon={<ArrowRight data-testid="right-icon" />}
      >
        Submit
      </Button>
    );
    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
  });

  it("no debe tener violaciones de accesibilidad", async () => {
    const { container } = render(<Button>Accessible Button</Button>);
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
 * 1. **Cobertura de Estado de Carga**: ((Implementada)) Se ha añadido una nueva prueba que valida explícitamente el comportamiento `isLoading`, asegurando que el botón se deshabilite y muestre el texto de carga correctamente.
 *
 * @subsection Melhorias Futuras
 * 1. **Pruebas de Accesibilidad para `isLoading`**: ((Vigente)) Añadir una aserción para verificar que el botón tiene `aria-busy="true"` y `aria-live="polite"` durante el estado de carga para una accesibilidad de élite.
 *
 * =====================================================================
 */
// tests/unit/components/ui/button/Button.test.tsx
