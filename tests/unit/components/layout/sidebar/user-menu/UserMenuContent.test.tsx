// tests/unit/components/layout/sidebar/user-menu/UserMenuContent.test.tsx
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { UserMenuContent } from "@/components/layout/sidebar/user-menu/UserMenuContent";
import { mockActions } from "@tests/mocks/vi/actions.mock";
import { render, screen } from "@tests/utils/render";

/**
 * @file UserMenuContent.test.tsx
 * @description Arnés de pruebas unitarias para el componente de presentación puro
 *              `UserMenuContent`. Valida el renderizado correcto y la interacción
 *              con la acción de cierre de sesión.
 * @author Raz Podestá
 * @version 1.0.0
 */
describe("Componente Atómico: UserMenuContent", () => {
  const mockUserProps = {
    userName: "Raz Podestá",
    userEmail: "dev@convertikit.com",
  };

  it("debe renderizar la información del usuario y los items del menú", () => {
    // Arrange
    render(<UserMenuContent {...mockUserProps} />);

    // Assert
    expect(screen.getByText("Raz Podestá")).toBeInTheDocument();
    expect(screen.getByText("dev@convertikit.com")).toBeInTheDocument();
    expect(
      screen.getByText("[i18n] DashboardSidebar.userMenu_accountSettings")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", {
        name: "[i18n] DashboardSidebar.userMenu_signOut",
      })
    ).toBeInTheDocument();
  });

  it("debe invocar la signOutAction cuando se hace clic en el item de cerrar sesión", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<UserMenuContent {...mockUserProps} />);
    const signOutButton = screen.getByRole("button", {
      name: /signOut/i,
    });

    // Act
    await user.click(signOutButton);

    // Assert
    // La aserción se hace sobre el mock de la acción, ya que el formulario la invoca.
    // No necesitamos simular el envío del formulario, `userEvent` lo maneja.
    expect(mockActions.session.signOutAction).toHaveBeenCalledOnce();
  });
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Prueba de Interacción Crítica**: ((Implementada)) La prueba valida que la interacción del usuario con el item de menú invoca correctamente la `signOutAction` simulada, confirmando que el contrato funcional del componente es correcto.
 * 2. **Aislamiento de Componente**: ((Implementada)) Las pruebas se centran exclusivamente en el `UserMenuContent`, validando sus responsabilidades sin depender de otros componentes del ecosistema.
 *
 * @subsection Melhorias Futuras
 * 1. **Pruebas de Navegación**: ((Vigente)) Se podría añadir una prueba que verifique que el enlace "Account Settings" tiene el `href` correcto (`/dashboard/settings`).
 *
 * =====================================================================
 */
