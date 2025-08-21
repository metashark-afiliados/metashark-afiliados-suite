// tests/unit/components/layout/sidebar/user-menu/UserMenuTrigger.test.tsx
/**
 * @file UserMenuTrigger.test.tsx
 * @description Arnés de pruebas para la primitiva de UI `UserMenuTrigger`.
 * @author Raz Podestá
 * @version 2.0.0
 */
import { describe, expect, it } from "vitest";

import { UserMenuTrigger } from "@/components/layout/sidebar/user-menu/UserMenuTrigger";
import { render, screen } from "@tests/utils/render";
import { MOCKED_USER } from "@tests/mocks/data/database-state";

describe("Primitiva de UI: UserMenuTrigger", () => {
  it("debe renderizar un elemento button con la información del usuario", () => {
    // Arrange
    render(
      <UserMenuTrigger
        userName={MOCKED_USER.user_metadata.full_name as string}
        userEmail={MOCKED_USER.email as string}
        userAvatarUrl={MOCKED_USER.user_metadata.avatar_url as string}
      />
    );

    // Assert
    const button = screen.getByRole("button", {
      name: /raz podestá/i,
    });
    expect(button).toBeInTheDocument();
    expect(screen.getByText(MOCKED_USER.email as string)).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      MOCKED_USER.user_metadata.avatar_url
    );
  });

  it("debe aplicar las clases de variante 'ghost' correctamente", () => {
    // Arrange
    render(
      <UserMenuTrigger
        userName="Test"
        userEmail="test@test.com"
        userAvatarUrl=""
      />
    );

    // Assert
    const button = screen.getByRole("button");
    // Verificamos una clase clave de la variante 'ghost'
    expect(button).toHaveClass("hover:bg-accent");
  });
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Prueba de Implementación Primitiva**: ((Implementada)) El arnés ahora valida que el componente renderiza un `<button>` nativo y que aplica correctamente los estilos de `buttonVariants`.
 *
 * =====================================================================
 */
// tests/unit/components/layout/sidebar/user-menu/UserMenuTrigger.test.tsx
