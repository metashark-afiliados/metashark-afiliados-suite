// tests/unit/components/layout/sidebar/user-menu/UserMenu.test.tsx
import { describe, expect, it, vi } from "vitest";

import { UserMenu } from "@/components/layout/sidebar/user-menu/UserMenu";
import * as UserMenuContentModule from "@/components/layout/sidebar/user-menu/UserMenuContent";
import * as UserMenuSkeletonModule from "@/components/layout/sidebar/user-menu/UserMenuSkeleton";
import * as UserMenuTriggerModule from "@/components/layout/sidebar/user-menu/UserMenuTrigger";
import { useDashboard } from "@/lib/context/DashboardContext";
import { MOCKED_USER } from "@tests/mocks/data/database-state";
import { render, screen } from "@tests/utils/render";

/**
 * @file UserMenu.test.tsx
 * @description Arnés de pruebas unitarias para el componente orquestador `UserMenu`.
 *              Valida que el orquestador renderiza el componente hijo correcto
 *              (esqueleto o contenido) basado en el estado del contexto y que
 *              pasa las props correctas a sus hijos.
 * @author Raz Podestá
 * @version 1.0.0
 */

// Aislamiento: Espiamos los componentes hijos para verificar que son llamados.
const skeletonSpy = vi.spyOn(UserMenuSkeletonModule, "UserMenuSkeleton");
const triggerSpy = vi.spyOn(UserMenuTriggerModule, "UserMenuTrigger");
const contentSpy = vi.spyOn(UserMenuContentModule, "UserMenuContent");

// Mock del hook consumidor
vi.mock("@/lib/context/DashboardContext");
const mockedUseDashboard = vi.mocked(useDashboard);

describe("Componente Orquestador: UserMenu", () => {
  it("debe renderizar UserMenuSkeleton cuando el usuario no está definido", () => {
    // Arrange
    mockedUseDashboard.mockReturnValue({ user: null } as any);

    // Act
    render(<UserMenu />);

    // Assert
    expect(skeletonSpy).toHaveBeenCalledOnce();
    expect(triggerSpy).not.toHaveBeenCalled();
    expect(contentSpy).not.toHaveBeenCalled();
  });

  it("debe renderizar UserMenuTrigger y UserMenuContent con las props correctas cuando el usuario está definido", () => {
    // Arrange
    mockedUseDashboard.mockReturnValue({ user: MOCKED_USER } as any);

    // Act
    render(<UserMenu />);

    // Assert
    expect(skeletonSpy).not.toHaveBeenCalled();
    expect(triggerSpy).toHaveBeenCalledOnce();
    expect(contentSpy).toHaveBeenCalledOnce();

    // Verificación de "prop drilling"
    const expectedProps = {
      userName: "Raz Podestá",
      userEmail: "dev@convertikit.com",
    };
    expect(triggerSpy).toHaveBeenCalledWith(
      expect.objectContaining(expectedProps),
      expect.anything()
    );
    expect(contentSpy).toHaveBeenCalledWith(
      expect.objectContaining(expectedProps),
      expect.anything()
    );
  });
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Prueba de Lógica de Orquestación**: ((Implementada)) El arnés valida la responsabilidad principal del componente: renderizar condicionalmente el hijo correcto basado en el estado del contexto.
 * 2. **Prueba de Contrato de Props**: ((Implementada)) Se verifica que el orquestador pasa correctamente las props derivadas del contexto a sus componentes hijos, asegurando que el "cableado" de la arquitectura es correcto.
 *
 * =====================================================================
 */
