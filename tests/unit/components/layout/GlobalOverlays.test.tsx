// tests/unit/components/layout/GlobalOverlays.test.tsx
/**
 * @file GlobalOverlays.test.tsx
 * @description Arnés de pruebas unitarias para el inyector de UI `GlobalOverlays`.
 *              Refactorizado para utilizar la factoría de contexto de forma correcta,
 *              garantizando la integridad de los tipos de datos.
 * @author L.I.A. Legacy
 * @version 2.0.0
 */
import { describe, it, expect, vi } from "vitest";

import { GlobalOverlays } from "@/components/layout/GlobalOverlays";
import { createMockDashboardContext } from "@tests/mocks/factories/context.factory";
import { render, screen } from "@tests/utils/render";

vi.mock("@/components/auth/AuthDialog", () => ({
  AuthDialog: () => <div data-testid="auth-dialog" />,
}));
vi.mock("@/components/feedback/CommandPalette", () => ({
  CommandPalette: () => <div data-testid="command-palette" />,
}));
vi.mock("@/components/feedback/LiaChatWidget", () => ({
  LiaChatWidget: () => <div data-testid="lia-chat-widget" />,
}));
vi.mock("@/components/onboarding/WelcomeModal", () => ({
  WelcomeModal: () => <div data-testid="welcome-modal" />,
}));
vi.mock("@/components/workspaces/dialogs", () => ({
  CreateWorkspaceDialog: () => <div data-testid="create-workspace-dialog" />,
  DeleteWorkspaceDialog: () => <div data-testid="delete-workspace-dialog" />,
  InviteMemberDialog: () => <div data-testid="invite-member-dialog" />,
  RenameWorkspaceDialog: () => <div data-testid="rename-workspace-dialog" />,
}));

describe("Componente Inyector de UI: GlobalOverlays", () => {
  it("debe renderizar todos los overlays estándar", () => {
    const mockContext = createMockDashboardContext();
    render(<GlobalOverlays />, { dashboardContext: mockContext });

    expect(screen.getByTestId("auth-dialog")).toBeInTheDocument();
    expect(screen.getByTestId("command-palette")).toBeInTheDocument();
    expect(screen.getByTestId("lia-chat-widget")).toBeInTheDocument();
    expect(screen.getByTestId("create-workspace-dialog")).toBeInTheDocument();
  });

  it("debe renderizar el WelcomeModal si el onboarding del perfil no está completado", () => {
    // --- INICIO DE CORRECCIÓN ---
    const mockContext = createMockDashboardContext();
    mockContext.profile.has_completed_onboarding = false;
    // --- FIN DE CORRECCIÓN ---

    render(<GlobalOverlays />, { dashboardContext: mockContext });

    expect(screen.getByTestId("welcome-modal")).toBeInTheDocument();
  });

  it("NO debe renderizar el WelcomeModal si el onboarding del perfil está completado", () => {
    // --- INICIO DE CORRECCIÓN ---
    const mockContext = createMockDashboardContext();
    mockContext.profile.has_completed_onboarding = true;
    // --- FIN DE CORRECCIÓN ---

    render(<GlobalOverlays />, { dashboardContext: mockContext });

    expect(screen.queryByTestId("welcome-modal")).not.toBeInTheDocument();
  });
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error de Tipo (TS2740)**: ((Implementada)) La prueba ahora genera un objeto de contexto completo y válido usando la factoría, y luego modifica la propiedad necesaria, resolviendo el error de compilación y respetando el contrato de tipos.
 * 2. **Adhesión a Patrones de Prueba**: ((Implementada)) La corrección se alinea con las mejores prácticas para el uso de factorías de mocks, asegurando que las pruebas sean robustas y mantenibles.
 *
 * =====================================================================
 */
