// tests/unit/components/workspaces/WorkspacePopoverContent.test.tsx
import { describe, expect, it, vi } from "vitest";

import { Command } from "@/components/ui/command";
import { WorkspaceActions } from "@/components/workspaces/WorkspaceActions";
import { WorkspaceList } from "@/components/workspaces/WorkspaceList";
import { WorkspacePopoverContent } from "@/components/workspaces/WorkspacePopoverContent";
import { createMockWorkspace } from "@tests/mocks/factories";
import { render, screen } from "@tests/utils/render";

/**
 * @file WorkspacePopoverContent.test.tsx
 * @description Arnés de pruebas de élite para el componente ensamblador
 *              `WorkspacePopoverContent`. Valida que el componente orquesta
 *              correctamente sus hijos atómicos, pasando las props adecuadas.
 * @author Raz Podestá
 * @version 1.0.0
 */

// Aislamiento del Aparato Bajo Prueba: Simulamos sus hijos.
vi.mock("@/components/workspaces/WorkspaceList", () => ({
  WorkspaceList: vi.fn(() => <div data-testid="mock-workspace-list" />),
}));
vi.mock("@/components/workspaces/WorkspaceActions", () => ({
  WorkspaceActions: vi.fn(() => <div data-testid="mock-workspace-actions" />),
}));

// SSoT para las props de prueba.
const mockWorkspaces = [
  createMockWorkspace({ id: "ws-1", name: "Workspace Activo" }),
  createMockWorkspace({ id: "ws-2", name: "Otro Workspace" }),
];

const mockProps = {
  workspaces: mockWorkspaces,
  activeWorkspaceId: "ws-1",
  onWorkspaceSelect: vi.fn(),
  canEdit: true,
  canDelete: true,
  onSelectCreate: vi.fn(),
  onSelectInvite: vi.fn(),
  onSelectRename: vi.fn(),
  onSelectSettings: vi.fn(),
  onSelectDelete: vi.fn(),
};

describe("Componente Ensamblador: WorkspacePopoverContent", () => {
  it("debe renderizar sus componentes hijos y pasarles las props correctas", () => {
    // Arrange
    render(
      <Command>
        <WorkspacePopoverContent {...mockProps} />
      </Command>
    );

    // Assert: Verificar que los hijos se renderizan
    expect(screen.getByTestId("mock-workspace-list")).toBeInTheDocument();
    expect(screen.getByTestId("mock-workspace-actions")).toBeInTheDocument();

    // Assert (Élite): Verificar que el prop drilling es correcto.
    expect(WorkspaceList).toHaveBeenCalledWith(
      expect.objectContaining({
        workspaces: mockProps.workspaces,
        activeWorkspaceId: mockProps.activeWorkspaceId,
        onWorkspaceSelect: mockProps.onWorkspaceSelect,
      }),
      expect.anything()
    );

    expect(WorkspaceActions).toHaveBeenCalledWith(
      expect.objectContaining({
        canEdit: mockProps.canEdit,
        canDelete: mockProps.canDelete,
        onSelectCreate: mockProps.onSelectCreate,
        onSelectInvite: mockProps.onSelectInvite,
        onSelectRename: mockProps.onSelectRename,
        onSelectSettings: mockProps.onSelectSettings,
        onSelectDelete: mockProps.onSelectDelete,
      }),
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
 * 1. **Prueba de Orquestación de Alta Fidelidad**: ((Implementada)) El arnés valida que el componente bajo prueba pasa el subconjunto correcto de props a cada hijo.
 * 2. **Aislamiento de Componente (SRP)**: ((Implementada)) Al simular los componentes hijos, la prueba se enfoca exclusivamente en la responsabilidad del `WorkspacePopoverContent`: la correcta orquestación de props.
 *
 * @subsection Melhorias Futuras
 * 1. **Pruebas de Permisos**: ((Vigente)) Añadir casos de prueba que pasen `canEdit: false` y verifiquen que `WorkspaceActions` recibe correctamente ese flag.
 *
 * =====================================================================
 */
// tests/unit/components/workspaces/WorkspacePopoverContent.test.tsx
