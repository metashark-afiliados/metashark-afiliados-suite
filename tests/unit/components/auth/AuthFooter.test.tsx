// tests/unit/components/auth/AuthFooter.test.tsx
/**
 * @file tests/unit/components/auth/AuthFooter.test.tsx
 * @description Arnés de pruebas unitarias para el componente `AuthFooter`.
 *              Refactorizado para depender únicamente del setup de mocks global.
 * @author Raz Podestá
 * @version 1.1.1
 */
import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AuthFooter } from "@/components/auth/AuthFooter";
import { render } from "@tests/utils/render";

const mockOnSwitchView = vi.fn();

describe("Componente Atómico: AuthFooter", () => {
  // `messages` object is no longer needed here as useTranslations is globally mocked
  // const messages = { ... };

  it("Vista Login: debe renderizar el enlace para registrarse", async () => {
    render(
      <AuthFooter
        type="login"
        onSwitchView={mockOnSwitchView}
      /> /* Eliminado: , { messages } */
    );
    await userEvent.click(
      screen.getByRole("button", {
        name: /\[i18n\] SignUpPage.dontHaveAccount/i,
      })
    );
    expect(mockOnSwitchView).toHaveBeenCalledWith("signup");
  });

  it("Vista Signup: debe renderizar el aviso legal", async () => {
    render(
      <AuthFooter
        type="signup"
        onSwitchView={mockOnSwitchView}
      /> /* Eliminado: , { messages } */
    );
    expect(
      screen.getByText(
        /\[i18n-rich\] SignUpPage.legalNotice {\"terms\":{},\"privacy\":{}}/i
      )
    ).toBeInTheDocument();
  });
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Principios DRY y Coherencia**: ((Implementada)) Se ha eliminado el objeto `messages` y el parámetro `messages` redundante de la llamada `render`, ya que el mock global de `next-intl` no lo requiere. Las aserciones han sido actualizadas para reflejar el output del mock global.
 *
 * @subsection Melhorias Futuras
 * 1. **Pruebas de Accesibilidad (a11y)**: ((Vigente)) Utilizar `jest-axe` para validar la estructura semántica.
 *
 * =====================================================================
 */
