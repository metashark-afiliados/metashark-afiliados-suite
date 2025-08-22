// tests/integration/app/auth/SignUp.test.tsx
/**
 * @file tests/integration/app/auth/SignUp.test.tsx
 * @description Arnés de pruebas de integración de "caja negra" para el flujo de registro.
 *              Refactorizado con aserciones de alta fidelidad.
 * @author L.I.A. Legacy
 * @version 7.1.0
 */
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { http, HttpResponse } from "msw";
import toast from "react-hot-toast";
import mockRouter from "next-router-mock";

import { signUpAction } from "@/lib/actions/auth.actions";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { redirectSpy } from "@tests/mocks/navigation.mock";
import { server } from "@tests/mocks/server";
import { render, screen, waitFor } from "@tests/utils/render";
import signUpMessages from "@/messages/app/[locale]/auth/signup/page.json";
// --- INICIO DE REFACTORIZACIÓN: Importar mensajes de error ---
import validationErrorMessages from "@/messages/shared/ValidationErrors.json";
const t = signUpMessages["es-ES"];
const tErrors = validationErrorMessages["es-ES"];
// --- FIN DE REFACTORIZACIÓN ---

vi.mock("@/lib/actions/auth.actions", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/lib/actions/auth.actions")>();
  return {
    ...actual,
    signUpAction: vi.fn(actual.signUpAction),
  };
});

const mockedSignUpAction = vi.mocked(signUpAction);

describe("Integration Test: Flujo de Registro de Usuario", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    server.resetHandlers();
    mockRouter.setCurrentUrl("/signup");
  });

  it("debe registrar un usuario exitosamente y llamar a redirect", async () => {
    const user = userEvent.setup();
    mockedSignUpAction.mockImplementation(() => {
      redirectSpy("/auth-notice?message=check-email-for-confirmation");
      return new Promise(() => {});
    });

    render(<SignUpForm />);

    await user.type(
      screen.getByLabelText(new RegExp(`^${t.email_label}$`, "i")),
      "test@example.com"
    );
    await user.type(
      screen.getByLabelText(new RegExp(`^${t.password_label}$`, "i")),
      "password123"
    );
    await user.type(
      screen.getByLabelText(new RegExp(`^${t.confirm_password_label}$`, "i")),
      "password123"
    );
    await user.click(
      screen.getByLabelText(new RegExp(`^${t.terms_label}$`, "i"))
    );

    const submitButton = screen.getByRole("button", {
      name: new RegExp(`^${t.signUpButton}$`, "i"),
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(redirectSpy).toHaveBeenCalledWith(
        "/auth-notice?message=check-email-for-confirmation"
      );
    });
  });

  it("debe mostrar un toast de error si el usuario ya existe", async () => {
    const user = userEvent.setup();
    mockedSignUpAction.mockResolvedValue({
      success: false,
      error: "error_user_already_exists",
    });

    render(<SignUpForm />);

    await user.type(
      screen.getByLabelText(new RegExp(`^${t.email_label}$`, "i")),
      "existing@example.com"
    );
    await user.type(
      screen.getByLabelText(new RegExp(`^${t.password_label}$`, "i")),
      "password123"
    );
    await user.type(
      screen.getByLabelText(new RegExp(`^${t.confirm_password_label}$`, "i")),
      "password123"
    );
    await user.click(
      screen.getByLabelText(new RegExp(`^${t.terms_label}$`, "i"))
    );

    const submitButton = screen.getByRole("button", {
      name: new RegExp(`^${t.signUpButton}$`, "i"),
    });
    await user.click(submitButton);

    await waitFor(() => {
      // --- INICIO DE REFACTORIZACIÓN: Aserción de Alta Fidelidad ---
      expect(toast.error).toHaveBeenCalledWith(
        tErrors.error_user_already_exists
      );
      // --- FIN DE REFACTORIZACIÓN ---
    });
    expect(redirectSpy).not.toHaveBeenCalled();
  });
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Aserción de Alta Fidelidad**: ((Implementada)) ((Vigente)) La prueba ahora valida que se muestra el mensaje de error exacto y completo, aumentando la precisión y robustez del arnés.
 *
 * =====================================================================
 */
// tests/integration/app/auth/SignUp.test.tsx
