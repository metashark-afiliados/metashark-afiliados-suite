// tests/integration/app/auth/SignUp.test.tsx
/**
 * @file tests/integration/app/auth/SignUp.test.tsx
 * @description Arnés de pruebas de integración para el flujo de registro modal.
 *              Refactorizado para alinearse con la arquitectura de "Formulario
 *              Soberano" y consumir los mensajes de i18n correctos.
 * @author L.I.A. Legacy
 * @version 8.1.0
 */
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";

import { signUpAction } from "@/lib/actions/auth.actions";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { render, screen, waitFor } from "@tests/utils/render";

// --- Importación corregida a la ruta canónica del snapshot ---
import signUpMessages from "@/messages/app/[locale]/auth/signup/page.json";
import validationErrorMessages from "@/messages/shared/ValidationErrors.json";

const t = signUpMessages["es-ES"];
const tErrors = validationErrorMessages["es-ES"];

// --- Mock de la Server Action ---
vi.mock("@/lib/actions/auth.actions", () => ({
  signUpAction: vi.fn(),
}));
const mockedSignUpAction = vi.mocked(signUpAction);

// --- Mock de next/navigation para capturar redirect ---
vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));
const mockedRedirect = vi.mocked(redirect);

describe("Integration Test: Flujo de Registro (Formulario Soberano)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debe registrar un usuario exitosamente y llamar a redirect", async () => {
    const user = userEvent.setup();
    // --- Tipado explícito para resolver TS7006 ---
    mockedSignUpAction.mockImplementation(
      async (prevState: any, formData: FormData) => {
        redirect("/auth-notice?message=check-email-for-confirmation");
        return { success: true, data: undefined as never };
      }
    );

    render(<SignUpForm />);

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

    const submitButton = screen.getByRole("button", { name: t.signUpButton });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockedSignUpAction).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(mockedRedirect).toHaveBeenCalledWith(
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
      screen.getByLabelText(t.email_label),
      "existing@example.com"
    );
    await user.type(screen.getByLabelText(t.password_label), "password123");
    await user.type(
      screen.getByLabelText(t.confirm_password_label),
      "password123"
    );
    await user.click(screen.getByLabelText(t.terms_label));

    const submitButton = screen.getByRole("button", { name: t.signUpButton });
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        tErrors.error_user_already_exists
      );
    });

    expect(mockedRedirect).not.toHaveBeenCalled();
  });

  it("debe mostrar errores de validación de cliente si las contraseñas no coinciden", async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);

    await user.type(screen.getByLabelText(t.email_label), "test@example.com");
    await user.type(screen.getByLabelText(t.password_label), "password123");
    await user.type(
      screen.getByLabelText(t.confirm_password_label),
      "password456"
    );
    await user.click(screen.getByLabelText(t.terms_label));

    const submitButton = screen.getByRole("button", { name: t.signUpButton });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(tErrors.passwords_do_not_match)
      ).toBeInTheDocument();
    });

    expect(mockedSignUpAction).not.toHaveBeenCalled();
  });
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error de Compilación (TS2307)**: ((Implementada)) Se ha corregido la ruta de importación del archivo de mensajes a la ruta canónica `src/messages/app/...`, resolviendo el error de módulo no encontrado.
 * 2. **Resolución de Error de Tipado (TS7006)**: ((Implementada)) Se han añadido tipos explícitos (`prevState: any`, `formData: FormData`) a la implementación del mock de `signUpAction`, satisfaciendo al compilador de TypeScript.
 *
 * =====================================================================
 */
