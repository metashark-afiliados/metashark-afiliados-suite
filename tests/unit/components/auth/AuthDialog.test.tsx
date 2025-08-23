// tests/unit/components/auth/AuthDialog.test.tsx
/**
 * @file AuthDialog.test.tsx
 * @description Arnés de pruebas unitarias para el orquestador modal `AuthDialog`.
 *              Refactorizado para proveer un entorno de i18n completo, cargando
 *              todos los namespaces de mensajes necesarios para el componente y sus hijos.
 * @author L.I.A. Legacy
 * @version 2.5.0
 */
import { act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";

import { AuthDialog } from "@/components/auth/AuthDialog";
import { useAuthModalStore } from "@/lib/hooks/ui/useAuthModalStore";
import loginMessages from "@/messages/app/[locale]/auth/login/page.json";
import signupMessages from "@/messages/app/[locale]/auth/signup/page.json";
import { render, screen } from "@tests/utils/render";

const tLogin = loginMessages["es-ES"];
const tSignUp = signupMessages["es-ES"];

// --- Entorno de Mensajes de Alta Fidelidad ---
const mockMessages = {
  LoginPage: tLogin,
  SignUpPage: tSignUp,
};

vi.mock("@/components/auth/LoginForm", () => ({
  LoginForm: () => <div data-testid="login-form" />,
}));
vi.mock("@/components/auth/SignUpForm", () => ({
  SignUpForm: () => <div data-testid="signup-form" />,
}));

describe("Componente Orquestador de UI: AuthDialog", () => {
  beforeEach(() => {
    act(() => {
      useAuthModalStore.getState().closeModal();
    });
    vi.clearAllMocks();
  });

  it("debe renderizar el LoginForm y los textos correctos cuando se abre en vista 'login'", () => {
    act(() => {
      useAuthModalStore.getState().openModal("login");
    });
    render(<AuthDialog />, { messages: mockMessages });
    expect(
      screen.getByRole("heading", { name: tLogin.title })
    ).toBeInTheDocument();
  });

  it("debe cambiar de la vista de login a signup al interactuar con el footer", async () => {
    const user = userEvent.setup();
    act(() => {
      useAuthModalStore.getState().openModal("login");
    });

    const { rerender } = render(<AuthDialog />, { messages: mockMessages });

    // La clave `dontHaveAccount` ahora existe en tSignUp
    const switchButton = screen.getByRole("button", {
      name: tSignUp.dontHaveAccount,
    });

    // Simula el clic que invoca la acción del store
    await user.click(switchButton);

    // El store mockeado actualiza el estado. Re-renderizamos para que el componente lo recoja.
    rerender(<AuthDialog />);

    // Ahora las aserciones se hacen sobre el DOM actualizado
    expect(screen.getByTestId("signup-form")).toBeInTheDocument();
    expect(screen.queryByTestId("login-form")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: tSignUp.title })
    ).toBeInTheDocument();
  });
});
