// tests/integration/components/authentication/LoginForm.test.tsx
/**
 * @file LoginForm.test.tsx
 * @description Arnés de pruebas de integración para el nuevo LoginForm.
 *              Alineado con la arquitectura de feedback de UI (react-hot-toast).
 * @author L.I.A. Legacy
 * @version 2.0.0
 */
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import toast from "react-hot-toast"; // <-- Importación canónica de la librería de toasts
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";

import { LoginForm } from "@/components/authentication/login-form";
import { signInWithEmailAction } from "@/lib/actions/auth.actions";
import { render, screen, waitFor } from "@tests/utils/render";

import loginMessages from "@/messages/app/[locale]/auth/login/page.json";
import supabaseAuthUiMessages from "@/messages/components/auth/SupabaseAuthUI.json";
import loginFormMessages from "@/messages/components/auth/LoginForm.json";

const tLogin = loginMessages["es-ES"];
const tSupabase = supabaseAuthUiMessages["es-ES"];
const tForm = loginFormMessages["es-ES"];

const mockMessages = {
  LoginPage: tLogin,
  SupabaseAuthUI: tSupabase,
  LoginForm: tForm,
};

vi.mock("@/lib/actions/auth.actions", () => ({
  signInWithEmailAction: vi.fn(),
}));
const mockedSignInWithEmailAction = vi.mocked(signInWithEmailAction);

describe("Componente de Ensamblaje: LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debe invocar la acción de login con los datos del formulario al enviar", async () => {
    const user = userEvent.setup();
    render(<LoginForm />, { messages: mockMessages });

    const emailInput = screen.getByLabelText(tSupabase.email_label);
    const passwordInput = screen.getByLabelText(tSupabase.password_label);
    const submitButton = screen.getByRole("button", {
      name: tLogin.signInButton,
    });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");

    await user.click(submitButton);

    await waitFor(() => {
      expect(mockedSignInWithEmailAction).toHaveBeenCalledTimes(1);
      const formData = mockedSignInWithEmailAction.mock.calls[0][1];
      expect(formData.get("email")).toBe("test@example.com");
      expect(formData.get("password")).toBe("password123");
    });
  });

  it("debe mostrar un toast de error si la acción de login falla", async () => {
    const user = userEvent.setup();
    mockedSignInWithEmailAction.mockResolvedValue({
      success: false,
      error: "error_invalid_credentials",
    });

    render(<LoginForm />, { messages: mockMessages });

    const submitButton = screen.getByRole("button", {
      name: tLogin.signInButton,
    });
    await user.click(submitButton);

    await waitFor(() => {
      // La aserción se hace sobre el mock de react-hot-toast
      expect(toast.error).toHaveBeenCalledWith(
        tLogin.error_invalid_credentials
      );
    });
  });

  it("debe mostrar una alerta de error si la URL contiene parámetros de OAuth", () => {
    const initialUrl = "/login?error=true&message=error_oauth_failed";
    render(
      <MemoryRouterProvider url={initialUrl}>
        <LoginForm />
      </MemoryRouterProvider>,
      { messages: mockMessages }
    );

    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(tLogin.error_oauth_failed);
  });
});
