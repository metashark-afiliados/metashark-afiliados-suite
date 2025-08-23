// tests/unit/components/auth/OAuthButton.test.tsx
/**
 * @file OAuthButton.test.tsx
 * @description Arnés de pruebas unitarias para el componente atómico OAuthButton.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { OAuthButton } from "@/components/auth/OAuthButton";
import { signInWithOAuthAction } from "@/lib/actions/auth.actions";
import { render, screen } from "@tests/utils/render";

// Mock de la Server Action
vi.mock("@/lib/actions/auth.actions", () => ({
  signInWithOAuthAction: vi.fn(),
}));
const mockedSignInWithOAuthAction = vi.mocked(signInWithOAuthAction);

describe("Componente Atómico de UI: OAuthButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debe renderizar el botón con el texto e icono correctos para el proveedor 'google'", () => {
    render(<OAuthButton provider="google" />);

    const button = screen.getByRole("button", {
      name: /continuar con google/i,
    });
    expect(button).toBeInTheDocument();
    expect(screen.getByTitle(/google logo/i)).toBeInTheDocument();
  });

  it("debe invocar la signInWithOAuthAction con el proveedor correcto al hacer clic", async () => {
    const user = userEvent.setup();
    render(<OAuthButton provider="google" />);

    const button = screen.getByRole("button", {
      name: /continuar con google/i,
    });
    await user.click(button);

    expect(mockedSignInWithOAuthAction).toHaveBeenCalledTimes(1);

    // Verificar que el FormData enviado contiene el input oculto correcto
    const formData = mockedSignInWithOAuthAction.mock.calls[0][0];
    expect(formData.get("provider")).toBe("google");
  });

  it("no debe renderizar nada si se pasa un proveedor no soportado", () => {
    // Silenciar el console.error esperado para esta prueba
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { container } = render(
      <OAuthButton provider={"unsupported" as any} />
    );

    expect(container.firstChild).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        "[OAuthButton] Proveedor no soportado: unsupported"
      )
    );

    consoleErrorSpy.mockRestore();
  });
});
