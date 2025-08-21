// tests/unit/components/workspaces/dialogs/InviteMemberDialog.test.tsx
/**
 * @file InviteMemberDialog.test.tsx
 * @description Arnés de pruebas unitarias para el `InviteMemberDialog`.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { InviteMemberDialog } from "@/components/workspaces/dialogs/InviteMemberDialog";
import { useWorkspaceDialogStore } from "@/lib/hooks/useWorkspaceDialogStore";
import { useDashboard } from "@/lib/context/DashboardContext";

vi.mock("@/lib/context/DashboardContext");
const mockedUseDashboard = vi.mocked(useDashboard);

vi.mock("@/components/workspaces/InviteMemberForm", () => ({
  InviteMemberForm: vi.fn(() => <form data-testid="invite-member-form" />),
}));

describe("Componente Atómico: InviteMemberDialog", () => {
  it("no debe renderizarse si no hay un workspace activo", () => {
    // Arrange
    mockedUseDashboard.mockReturnValue({ activeWorkspace: null } as any);
    act(() => {
      useWorkspaceDialogStore.setState({ activeDialog: "invite" });
    });
    const { container } = render(<InviteMemberDialog />);

    // Assert
    expect(container.firstChild).toBeNull();
  });

  it("debe renderizarse y mostrar el formulario cuando el diálogo activo es 'invite'", () => {
    // Arrange
    mockedUseDashboard.mockReturnValue({
      activeWorkspace: { name: "Test WS" },
    } as any);
    act(() => {
      useWorkspaceDialogStore.setState({ activeDialog: "invite" });
    });
    render(<InviteMemberDialog />);

    // Assert
    expect(
      screen.getByText("[i18n] WorkspaceSwitcher.inviteMember_button")
    ).toBeInTheDocument();
    expect(screen.getByTestId("invite-member-form")).toBeInTheDocument();
  });
});
// tests/unit/components/workspaces/dialogs/InviteMemberDialog.test.tsx
