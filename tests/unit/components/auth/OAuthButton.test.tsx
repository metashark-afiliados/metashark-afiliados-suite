// tests/unit/components/auth/OAuthButton.test.tsx
/**
 * @file tests/unit/components/auth/OAuthButton.test.tsx
 * @description Arnés de pruebas unitarias para el componente atómico `OAuthButton`.
 *              Corregido para usar el mock centralizado de `next-intl`.
 * @author Raz Podestá
 * @version 1.1.0
 */
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { OAuthButton } from "@/components/auth/OAuthButton";
import { mockNextIntl } from "@tests/mocks"; // CORRECCIÓN: Usar mock centralizado
import { render } from "@tests/utils/render";

// Mock de dependencias
mockNextIntl(); // CORRECCIÓN: Invocar mock centralizado
vi.mock("@/lib/actions/auth.actions", () => ({
  signInWithOAuthAction: vi.fn(),
}));

describe("Componente Atómico: OAuthButton", () => {
  it("debe renderizar correctamente para el proveedor 'google'", async () => {
    // Arrange
    await render(<OAuthButton provider="google" />);

    // Assert
    const button = screen.getByRole("button", {
      name: /\[i18n\] OAuthButton.signInWithProvider {\"provider\":\"Google\"}/i,
    });
    expect(button).toBeInTheDocument();

    const hiddenInput = document.querySelector(
      'input[type="hidden"][name="provider"]'
    );
    expect(hiddenInput).toHaveValue("google");

    const svgTitle = screen.getByTitle("Google Logo");
    expect(svgTitle).toBeInTheDocument();
  });

  it("no debe renderizar nada para un proveedor no soportado", async () => {
    // Arrange
    const { container } = await render(
      <OAuthButton provider={"facebook" as any} />
    );

    // Assert
    expect(container.firstChild).toBeNull();
  });
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Consistencia de Mocks (DRY)**: ((Implementada)) La suite ahora utiliza la factoría `mockNextIntl` del banco de mocks, eliminando la duplicación y asegurando que las pruebas se mantengan sincronizadas con la infraestructura global.
 *
 * @subsection Melhorias Futuras
 * 1. **Prueba de Interacción**: ((Vigente)) Simular un clic en el botón y verificar que la Server Action `signInWithOAuthAction` es invocada.
 *
 * =====================================================================
 */
// tests/unit/components/auth/OAuthButton.test.tsx
