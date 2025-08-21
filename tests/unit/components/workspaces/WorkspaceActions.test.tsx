// tests/unit/components/workspaces/WorkspaceActions.test.tsx
import { describe, expect, it, vi } from "vitest";
import { userEvent } from "@testing-library/user-event";

import { Command } from "@/components/ui/command";
import { WorkspaceActions } from "@/components/workspaces/WorkspaceActions";
import { render, screen } from "@tests/utils/render";

/**
 * @file WorkspaceActions.test.tsx
 * @description Arnés de pruebas de alta calidad para el componente de presentación
 *              puro `WorkspaceActions`. Valida el renderizado condicional basado
 *              en permisos y la correcta invocación de los callbacks.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */

// SSoT para los callbacks de prueba, permite aserciones en las llamadas.
const mockCallbacks = {
  onSelectCreate: vi.fn(),
  onSelectInvite: vi.fn(),
  onSelectRename: vi.fn(),
  onSelectSettings: vi.fn(),
  onSelectDelete: vi.fn(),
};

// Helper de renderizado local para mantener el código DRY.
const renderComponent = (
  props: Partial<React.ComponentProps<typeof WorkspaceActions>>
) => {
  render(
    <Command>
      <WorkspaceActions
        canEdit={false}
        canDelete={false}
        {...mockCallbacks}
        {...props}
      />
    </Command>
  );
};

describe("Componente Atómico: WorkspaceActions", () => {
  // Limpia los mocks antes de cada prueba para garantizar el aislamiento.
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debe renderizar únicamente la acción 'Crear Workspace' si no hay permisos de edición o eliminación", () => {
    // Arrange
    renderComponent({ canEdit: false, canDelete: false });

    // Assert
    expect(screen.getByText(/createWorkspace_button/i)).toBeInTheDocument();
    expect(screen.queryByText(/inviteMember_button/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/deleteWorkspace_button/i)
    ).not.toBeInTheDocument();
  });

  it("debe renderizar las acciones de edición cuando `canEdit` es true", () => {
    // Arrange
    renderComponent({ canEdit: true, canDelete: false });

    // Assert
    expect(screen.getByText(/inviteMember_button/i)).toBeInTheDocument();
    expect(screen.getByText(/renameWorkspace_button/i)).toBeInTheDocument();
    expect(screen.getByText(/workspaceSettings_button/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/deleteWorkspace_button/i)
    ).not.toBeInTheDocument();
  });

  it("debe renderizar la acción de eliminación cuando `canDelete` es true", () => {
    // Arrange
    renderComponent({ canEdit: false, canDelete: true });

    // Assert
    expect(screen.getByText(/deleteWorkspace_button/i)).toBeInTheDocument();
  });

  it("debe invocar el callback correcto al hacer clic en una acción", async () => {
    // Arrange
    const user = userEvent.setup();
    renderComponent({ canEdit: true, canDelete: true });

    // Act
    await user.click(screen.getByText(/inviteMember_button/i));

    // Assert
    expect(mockCallbacks.onSelectInvite).toHaveBeenCalledOnce();
    expect(mockCallbacks.onSelectCreate).not.toHaveBeenCalled();
  });
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Pruebas de Lógica Condicional**: ((Implementada)) El arnés valida exhaustivamente todos los caminos de renderizado condicional basados en los flags de permisos, garantizando que la UI se adapte correctamente a los roles del usuario.
 * 2. **Pruebas de Interacción**: ((Implementada)) Se valida que `userEvent` dispare correctamente los callbacks pasados como props, confirmando el contrato funcional del componente.
 * 3. **Código DRY**: ((Implementada)) El uso de un `renderComponent` helper y un SSoT para los mocks (`mockCallbacks`) mantiene el código de prueba limpio y mantenible.
 *
 * @subsection Melhorias Futuras
 * 1. **Pruebas Parametrizadas (`it.each`)**: ((Vigente)) Los casos de prueba para los diferentes roles podrían ser refactorizados usando `it.each` de Vitest para reducir aún más la duplicación de código.
 *
 * =====================================================================
 */
// tests/unit/components/workspaces/WorkspaceActions.test.tsx
