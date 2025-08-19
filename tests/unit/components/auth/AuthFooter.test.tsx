// tests/unit/components/auth/AuthFooter.test.tsx
/**
 * @file tests/unit/components/auth/AuthFooter.test.tsx
 * @description Arnés de pruebas unitarias para el componente `AuthFooter`.
 *              Valida el renderizado condicional y la interacción del callback.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AuthFooter } from "@/components/auth/AuthFooter";
import { render } from "@tests/utils/render";

const mockOnSwitchView = vi.fn();

describe("Componente Atómico: AuthFooter", () => {
  const renderComponent = (type: "login" | "signup") =>
    render(<AuthFooter type={type} onSwitchView={mockOnSwitchView} />, {
      namespaces: [
        "SignUpPage", // Requerido para el texto del aviso legal
        "LoginPage", // Requerido para el texto de cambio de vista
      ],
      locale: "es-ES",
    });

  it("Vista Login: debe renderizar el enlace para registrarse y no mostrar el aviso legal", async () => {
    // Arrange
    await renderComponent("login");

    // Assert
    const switchToSignupLink = screen.getByRole("button", {
      name: /¿No tienes una cuenta\? Regístrate/i,
    });
    expect(switchToSignupLink).toBeInTheDocument();
    expect(
      screen.queryByText(/Al registrarte, aceptas nuestros/i)
    ).not.toBeInTheDocument();

    // Act
    await userEvent.click(switchToSignupLink);

    // Assert Callback
    expect(mockOnSwitchView).toHaveBeenCalledWith("signup");
  });

  it("Vista Signup: debe renderizar el enlace para iniciar sesión y mostrar el aviso legal", async () => {
    // Arrange
    await renderComponent("signup");

    // Assert
    const switchToLoginLink = screen.getByRole("button", {
      name: /¿Ya tienes una cuenta\? Inicia sesión/i,
    });
    expect(switchToLoginLink).toBeInTheDocument();
    expect(
      screen.getByText(/Al registrarte, aceptas nuestros/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Términos de Servicio/i })
    ).toBeInTheDocument();

    // Act
    await userEvent.click(switchToLoginLink);

    // Assert Callback
    expect(mockOnSwitchView).toHaveBeenCalledWith("login");
  });
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Garantía de Calidad**: ((Implementada)) Se ha creado una nueva suite de pruebas para un componente que carecía de ella, aumentando la cobertura de código y previniendo regresiones futuras.
 *
 * @subsection Melhorias Futuras
 * 1. **Pruebas de Accesibilidad (a11y)**: ((Vigente)) Integrar `jest-axe` en la utilidad `render` para validar automáticamente que el componente cumple con los estándares de accesibilidad WCAG.
 *
 * =====================================================================
 */
// tests/unit/components/auth/AuthFooter.test.tsx
