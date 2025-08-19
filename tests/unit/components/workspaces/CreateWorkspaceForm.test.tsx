// tests/unit/components/workspaces/CreateWorkspaceForm.test.tsx
/**
 * @file tests/unit/components/workspaces/CreateWorkspaceForm.test.tsx
 * @description Suite de pruebas de élite v16.0. Simplificada y robusta.
 * @author Raz Podestá
 * @version 16.0.0
 */
import { screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CreateWorkspaceForm } from "@/components/workspaces/CreateWorkspaceForm";
import * as actions from "@/lib/actions";
import { render } from "@tests/utils/render";

vi.mock("@/lib/actions", () => ({
  workspaces: {
    createWorkspaceAction: vi
      .fn()
      .mockResolvedValue({ success: true, data: { id: "ws-123" } }),
  },
}));

describe("Arnés de Pruebas de Élite: CreateWorkspaceForm", () => {
  it("Debe mostrar error si el nombre está vacío", async () => {
    render(<CreateWorkspaceForm onSuccess={() => {}} />);
    await userEvent.click(
      screen.getByRole("button", { name: "[i18n] create_form.create_button" })
    );
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("[i18n] name_required");
  });

  it("Debe llamar a la acción en un envío exitoso", async () => {
    const mockOnSuccess = vi.fn();
    render(<CreateWorkspaceForm onSuccess={mockOnSuccess} />);
    await userEvent.type(
      screen.getByLabelText("[i18n] create_form.name_label"),
      "Proyecto Válido"
    );
    await userEvent.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    });
  });
});
// tests/unit/components/workspaces/CreateWorkspaceForm.test.tsx
