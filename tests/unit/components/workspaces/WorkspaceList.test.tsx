// tests/unit/components/workspaces/WorkspaceList.test.tsx
/**
 * @file WorkspaceList.test.tsx
 * @description Arnés de pruebas unitarias de élite para el componente atómico
 *              `WorkspaceList`. Valida el renderizado, la selección, el estado
 *              activo y la funcionalidad de búsqueda en un entorno de prueba
 *              de alta fidelidad.
 * @author Raz Podestá
 * @version 2.0.0
 */
import { describe, expect, it, vi, beforeEach } from "vitest";
import { userEvent } from "@testing-library/user-event";

import { WorkspaceList } from "@/components/workspaces/WorkspaceList";
import { Command } from "@/components/ui/command";
import { createMockWorkspace } from "@tests/mocks/factories";
import { render, screen } from "@tests/utils/render";

const mockWorkspaces = [
  createMockWorkspace({ id: "ws-1", name: "Workspace Uno" }),
  createMockWorkspace({ id: "ws-2", name: "Workspace Dos" }),
];

const mockOnWorkspaceSelect = vi.fn();

const defaultProps = {
  workspaces: mockWorkspaces,
  activeWorkspaceId: "ws-1",
  onWorkspaceSelect: mockOnWorkspaceSelect,
};

describe("Componente Atómico: WorkspaceList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debe renderizar la lista de workspaces y marcar correctamente el activo", () => {
    // Arrange
    render(
      <Command>
        <WorkspaceList {...defaultProps} />
      </Command>
    );

    // Assert
    const items = screen.getAllByRole("option");
    expect(items).toHaveLength(2);

    const workspaceOne = screen.getByRole("option", {
      name: "Workspace Uno",
    });
    const workspaceTwo = screen.getByRole("option", {
      name: "Workspace Dos",
    });

    expect(workspaceOne).toBeInTheDocument();
    expect(workspaceOne).toHaveAttribute("aria-selected", "true");
    expect(workspaceTwo).toBeInTheDocument();
    expect(workspaceTwo).toHaveAttribute("aria-selected", "false");
  });

  it("debe invocar onWorkspaceSelect con el ID correcto al hacer clic en un workspace", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Command>
        <WorkspaceList {...defaultProps} />
      </Command>
    );
    const workspaceTwo = screen.getByRole("option", { name: "Workspace Dos" });

    // Act
    await user.click(workspaceTwo);

    // Assert
    expect(mockOnWorkspaceSelect).toHaveBeenCalledOnce();
    expect(mockOnWorkspaceSelect).toHaveBeenCalledWith("ws-2");
  });

  it("debe filtrar la lista de workspaces al escribir en el campo de búsqueda", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Command>
        <WorkspaceList {...defaultProps} />
      </Command>
    );
    const searchInput = screen.getByPlaceholderText(
      "[i18n] WorkspaceSwitcher.search_placeholder"
    );

    // Act
    await user.type(searchInput, "Dos");

    // Assert
    expect(
      screen.queryByRole("option", { name: "Workspace Uno" })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Workspace Dos" })
    ).toBeInTheDocument();
  });

  it("debe mostrar el estado vacío si la búsqueda no produce resultados", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Command>
        <WorkspaceList {...defaultProps} />
      </Command>
    );
    const searchInput = screen.getByPlaceholderText(
      "[i18n] WorkspaceSwitcher.search_placeholder"
    );

    // Act
    await user.type(searchInput, "Inexistente");

    // Assert
    expect(
      screen.getByText("[i18n] WorkspaceSwitcher.empty_results")
    ).toBeInTheDocument();
  });
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Estabilidad del Arnés**: ((Implementada)) El componente bajo prueba ahora está envuelto en el `<Command>` provider, resolviendo el error `cmdk` y estabilizando la suite de pruebas.
 * 2. **Cobertura de Pruebas Completa**: ((Implementada)) El arnés ahora valida todos los casos de uso principales: renderizado, selección, estado activo, filtrado y estado vacío, garantizando una cobertura de élite.
 * 3. **Alta Fidelidad de Interacción**: ((Implementada)) Utiliza `userEvent` para simular las interacciones del usuario de la forma más realista posible.
 *
 * @subsection Melhorias Futuras
 * 1. **Pruebas de Accesibilidad (a11y)**: ((Vigente)) Integrar `jest-axe` para ejecutar una auditoría de accesibilidad en el DOM renderizado, asegurando que el componente cumpla con los estándares WCAG.
 *
 * =====================================================================
 */
// tests/unit/components/workspaces/WorkspaceList.test.tsx
