// tests/unit/components/feedback/CommandPalette.test.tsx
import { describe, expect, it, vi } from "vitest";

import { CommandPalette } from "@/components/feedback/CommandPalette";
import * as CommandPaletteContentModule from "@/components/feedback/CommandPaletteContent";
import { useDashboard } from "@/lib/context/DashboardContext";
import { useCommandPaletteStore } from "@/lib/hooks/use-command-palette";
import { render } from "@tests/utils/render";

vi.mock("@/lib/context/DashboardContext");
vi.mock("@/lib/hooks/use-command-palette");
const mockedUseDashboard = vi.mocked(useDashboard);
const mockedUseCommandPaletteStore = vi.mocked(useCommandPaletteStore);
const contentSpy = vi.spyOn(
  CommandPaletteContentModule,
  "CommandPaletteContent"
);

describe("Orquestador de UI: CommandPalette", () => {
  it("debe pasar las props correctas al componente de presentación", () => {
    // Arrange
    const mockContext = {
      user: { id: "user-1" },
      workspaces: [{ id: "ws-1", name: "Test WS" }],
      activeWorkspace: { id: "ws-1" },
      modules: [{ id: "mod-1", status: "active" }],
    };
    const mockStore = {
      isOpen: true,
      close: vi.fn(),
      toggle: vi.fn(),
    };
    mockedUseDashboard.mockReturnValue(mockContext as any);
    mockedUseCommandPaletteStore.mockReturnValue(mockStore as any);

    // Act
    render(<CommandPalette />);

    // Assert
    expect(contentSpy).toHaveBeenCalledOnce();
    expect(contentSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        isOpen: true,
        mainNavLinks: mockContext.modules,
        workspaces: mockContext.workspaces,
        activeWorkspaceId: "ws-1",
        runCommand: expect.any(Function),
        handleWorkspaceSelect: expect.any(Function),
      }),
      expect.anything()
    );
  });
});
