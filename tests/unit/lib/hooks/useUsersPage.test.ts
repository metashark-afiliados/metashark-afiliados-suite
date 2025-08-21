// tests/unit/lib/hooks/useUsersPage.test.ts
/**
 * @file useUsersPage.test.ts
 * @description Arnés de pruebas de alta calidad para el hook soberano `useUsersPage`.
 *              Actualizado para consumir el nuevo `refreshSpy`.
 * @author Raz Podestá
 * @version 2.1.0
 */
import { act, renderHook, waitFor } from "@testing-library/react";
import toast from "react-hot-toast";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { useUsersPage } from "@/lib/hooks/useUsersPage";
import { type ActionResult } from "@/lib/validators";
import { refreshSpy } from "@tests/mocks/vi/navigation.mock";
import { mockActions } from "@tests/mocks/vi/actions.mock";

vi.mock("@/lib/hooks/ui/useSearchSync", () => ({
  useSearchSync: vi.fn(({ initialQuery }) => ({
    searchTerm: initialQuery,
    setSearchTerm: vi.fn(),
    isSyncing: false,
  })),
}));

describe("Hook Soberano: useUsersPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    refreshSpy.mockClear(); // Limpiamos el espía de refresh
  });

  it("debe invocar la Server Action, mostrar toast de éxito y refrescar el router", async () => {
    // Arrange
    const { result } = renderHook(() =>
      useUsersPage({ initialSearchQuery: "" })
    );
    mockActions.admin.updateUserRoleAction.mockResolvedValueOnce({
      success: true,
      data: undefined,
    });

    // Act
    act(() => {
      result.current.handleRoleChange("user-123", "admin");
    });

    // Assert
    await waitFor(() => {
      expect(mockActions.admin.updateUserRoleAction).toHaveBeenCalledWith(
        "user-123",
        "admin"
      );
      expect(toast.success).toHaveBeenCalledWith(
        "[i18n] app.dev-console.AdminDashboard.admin_toasts.user_role_updated_success"
      );
      expect(refreshSpy).toHaveBeenCalledOnce(); // Aserción sobre el espía exportado
    });
  });

  it("debe mostrar un toast de error si la Server Action falla", async () => {
    // Arrange
    const { result } = renderHook(() =>
      useUsersPage({ initialSearchQuery: "" })
    );
    const mockErrorResponse: ActionResult<void> = {
      success: false,
      error: "error_permission_denied",
    };
    mockActions.admin.updateUserRoleAction.mockResolvedValueOnce(
      mockErrorResponse
    );

    // Act
    act(() => {
      result.current.handleRoleChange("user-123", "admin");
    });

    // Assert
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "[i18n] app.dev-console.AdminDashboard.admin_errors.error_permission_denied"
      );
      expect(refreshSpy).not.toHaveBeenCalled();
    });
  });
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Aserción Robusta**: ((Implementada)) La prueba ahora importa `refreshSpy` directamente, permitiendo aserciones más robustas y desacopladas de la implementación interna del mock del router.
 *
 * =====================================================================
 */
// tests/unit/lib/hooks/useUsersPage.test.ts