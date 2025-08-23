// tests/integration/components/auth/SignUpForm.test.tsx
/**
 * @file SignUpForm.test.tsx
 * @description Arnés de pruebas de integración para el componente `SignUpForm`.
 *              Valida la lógica de `react-hook-form`, la validación del lado
 *              del cliente con Zod, y la interacción con la Server Action.
 * @author L.I.A. Legacy
 * @version 1.0.1
 */
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";

import { signUpAction } from "@/lib/actions/auth.actions";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { render, screen, waitFor } from "@tests/utils/render";

import signUpMessages from "@/messages/app/[locale]/auth/signup/page.json";
import validationErrorMessages from "@/messages/shared/ValidationErrors.json";

const t = signUpMessages["es-ES"];
const tErrors = validationErrorMessages["es-ES"];

const mockMessages = {
  SignUpPage: t,
  ValidationErrors: tErrors,
};

vi.mock("@/lib/actions/auth.actions", () => ({
  signUpAction: vi.fn(),
}));
const mockedSignUpAction = vi.mocked(signUpAction);

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));
const mockedRedirect = vi.mocked(redirect);

describe("Integration Test: SignUpForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const fillFormWithValidData = async (
    user: ReturnType<typeof userEvent.setup>
  ) => {
    await user.type(screen.getByLabelText(t.email_label), "test@example.com");
    await user.type(
      screen.getByLabelText(t.password_label),
      "ValidPassword123!"
    );
    await user.type(
      screen.getByLabelText(t.confirm_password_label),
      "ValidPassword123!"
    );
    await user.click(screen.getByLabelText(t.terms_label));
  };

  it("debe invocar la signUpAction con datos válidos y redirigir", async () => {
    const user = userEvent.setup();
    // --- INICIO DE CORRECCIÓN: Tipado explícito de la implementación del mock ---
    mockedSignUpAction.mockImplementation(
      async (prevState: any, formData: FormData) => {
        redirect("/auth-notice");
        return { success: true, data: undefined as never };
      }
    );
    // --- FIN DE CORRECCIÓN ---

    render(<SignUpForm />, { messages: mockMessages });

    await fillFormWithValidData(user);
    await user.click(screen.getByRole("button", { name: t.signUpButton }));

    await waitFor(() => {
      expect(mockedSignUpAction).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(mockedRedirect).toHaveBeenCalledWith("/auth-notice");
    });
  });

  it("debe mostrar un error de validación de cliente si las contraseñas no coinciden y no llamar a la acción", async () => {
    const user = userEvent.setup();
    render(<SignUpForm />, { messages: mockMessages });

    await user.type(screen.getByLabelText(t.email_label), "test@example.com");
    await user.type(screen.getByLabelText(t.password_label), "password123");
    await user.type(
      screen.getByLabelText(t.confirm_password_label),
      "password456"
    );
    await user.click(screen.getByLabelText(t.terms_label));

    await user.click(screen.getByRole("button", { name: t.signUpButton }));

    await waitFor(() => {
      expect(
        screen.getByText(tErrors.passwords_do_not_match)
      ).toBeInTheDocument();
    });
    expect(mockedSignUpAction).not.toHaveBeenCalled();
  });

  it("debe mostrar un toast de error si la Server Action falla", async () => {
    const user = userEvent.setup();
    mockedSignUpAction.mockResolvedValue({
      success: false,
      error: "error_user_already_exists",
    });

    render(<SignUpForm />, { messages: mockMessages });

    await fillFormWithValidData(user);
    await user.click(screen.getByRole("button", { name: t.signUpButton }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        tErrors.error_user_already_exists
      );
    });
    expect(mockedRedirect).not.toHaveBeenCalled();
  });
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error de Tipado (TS7006)**: ((Implementada)) Se han añadido tipos explícitos a la implementación del mock de `signUpAction`, resolviendo el error de compilación.
 *
 * =====================================================================
 */
