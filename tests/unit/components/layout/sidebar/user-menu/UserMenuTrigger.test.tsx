// tests/unit/components/layout/sidebar/user-menu/UserMenuTrigger.test.tsx
import { describe, expect, it } from "vitest";

import { UserMenuTrigger } from "@/components/layout/sidebar/user-menu/UserMenuTrigger";
import { render, screen } from "@tests/utils/render";

/**
 * @file UserMenuTrigger.test.tsx
 * @description Arnés de pruebas unitarias para la primitiva de UI `UserMenuTrigger`.
 *              Valida que el componente renderiza correctamente la información del
 *              usuario y se comporta como un botón accesible.
 * @author Raz Podestá
 * @version 1.0.0
 */
describe("Primitiva de UI: UserMenuTrigger", () => {
  const mockUserProps = {
    userName: "Raz Podestá",
    userEmail: "dev@convertikit.com",
    userAvatarUrl: "https://avatar.url/raz.png",
  };

  it("debe renderizar un elemento <button> con la información del usuario", () => {
    // Arrange
    render(<UserMenuTrigger {...mockUserProps} />);

    // Act
    const button = screen.getByRole("button", { name: /Raz Podestá/i });
    const avatarImage = screen.getByRole("img", {
      name: /Avatar de Raz Podestá/i,
    });

    // Assert
    expect(button).toBeInTheDocument();
    expect(screen.getByText("dev@convertikit.com")).toBeInTheDocument();
    expect(avatarImage).toBeInTheDocument();
    expect(avatarImage).toHaveAttribute("src", mockUserProps.userAvatarUrl);
  });

  it("debe mostrar el fallback del avatar si la URL de la imagen está ausente", () => {
    // Arrange
    render(
      <UserMenuTrigger
        {...mockUserProps}
        userAvatarUrl="" // Simula una URL de imagen vacía
      />
    );

    // Act
    const fallback = screen.getByText("R");

    // Assert
    expect(fallback).toBeInTheDocument();
  });
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Prueba de Contrato de Props**: ((Implementada)) El arnés valida que el componente renderiza correctamente todos los datos pasados a través de su contrato de props (`userName`, `userEmail`, `userAvatarUrl`).
 * 2. **Prueba de Lógica de Fallback**: ((Implementada)) Se valida explícitamente el comportamiento del componente `Avatar` anidado, asegurando que el `AvatarFallback` se muestre cuando la imagen no está disponible.
 *
 * @subsection Melhorias Futuras
 * 1. **Prueba de Interacción (`onClick`)**: ((Vigente)) Añadir una prueba que simule un clic del usuario y verifique que un `onClick` handler pasado como prop es invocado correctamente.
 *
 * =====================================================================
 */
