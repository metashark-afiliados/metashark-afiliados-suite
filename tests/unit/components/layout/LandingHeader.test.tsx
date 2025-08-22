// tests/unit/components/layout/LandingHeader.test.tsx
/**
 * @file LandingHeader.test.tsx
 * @description Arnés de pruebas unitarias de élite para el componente LandingHeader.
 *              Valida que la refactorización del flujo modal es correcta.
 * @author L.I.A. Legacy
 * @version 4.0.0
 */
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LandingHeader } from "@/components/layout/LandingHeader";
import { mockOpenModal } from "@tests/mocks";
import { render, screen } from "@tests/utils/render";

// Datos de prueba canónicos
const mockProps = {
  navLinks: [
    { href: "/#features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
  ],
  signInText: "Sign In",
  signUpText: "Sign Up Free",
  openMenuText: "Open menu",
};

describe("Componente Orquestador: LandingHeader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debe renderizar todos los enlaces de navegación principales", () => {
    render(<LandingHeader {...mockProps} />);
    expect(screen.getByRole("link", { name: /features/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /pricing/i })).toBeInTheDocument();
  });

  it("debe invocar openModal('login') al hacer clic en 'Sign In'", async () => {
    const user = userEvent.setup();
    render(<LandingHeader {...mockProps} />);

    const signInButton = screen.getByRole("button", { name: /sign in/i });
    await user.click(signInButton);

    expect(mockOpenModal).toHaveBeenCalledTimes(1);
    expect(mockOpenModal).toHaveBeenCalledWith("login");
  });

  it("debe invocar openModal('signup') al hacer clic en 'Sign Up Free'", async () => {
    const user = userEvent.setup();
    render(<LandingHeader {...mockProps} />);

    const signUpButton = screen.getByRole("button", { name: /sign up free/i });
    await user.click(signUpButton);

    expect(mockOpenModal).toHaveBeenCalledTimes(1);
    expect(mockOpenModal).toHaveBeenCalledWith("signup");
  });
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Validación de Contrato**: ((Implementada)) ((Vigente)) Las aserciones ahora validan que se llame a `mockOpenModal`, confirmando que el `LandingHeader` se integra correctamente con el nuevo sistema de estado global.
 * 2. **No Regresión**: ((Implementada)) ((Vigente)) La prueba de renderizado de enlaces de navegación se mantiene, asegurando que la refactorización no rompió la funcionalidad existente.
 *
 * @subsection Melhorias Futuras
 * 1. **Pruebas de Menú Móvil**: ((Pendiente)) Añadir pruebas específicas para simular un clic en el `SheetTrigger` y verificar que el menú móvil (`SheetContent`) se abre y contiene los botones que también invocan `openModal`.
 *
 * =====================================================================
 */
// tests/unit/components/layout/LandingHeader.test.tsx
