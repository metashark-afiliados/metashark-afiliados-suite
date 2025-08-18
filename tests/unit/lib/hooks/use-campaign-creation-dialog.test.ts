// tests/unit/lib/hooks/use-campaign-creation-dialog.test.ts
/**
 * @file use-campaign-creation-dialog.test.ts
 * @description Arnés de pruebas unitarias para el hook soberano `useCampaignCreationDialog`.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useCampaignCreationDialog } from "@/lib/hooks/use-campaign-creation-dialog";

// --- Mocks ---
const mockHandleCreate = vi.fn();

describe("Hook Soberano: useCampaignCreationDialog", () => {
  const defaultProps = {
    siteId: "site-123",
    handleCreate: mockHandleCreate,
  };

  it("debe gestionar correctamente el estado del diálogo", () => {
    // Arrange
    const { result } = renderHook(() =>
      useCampaignCreationDialog(defaultProps)
    );

    // Assert (Initial State)
    expect(result.current.isCreateDialogOpen).toBe(false);

    // Act
    act(() => {
      result.current.openCreateDialog();
    });

    // Assert (After Open)
    expect(result.current.isCreateDialogOpen).toBe(true);
  });

  it("handleCreateCampaign: debe llamar a handleCreate con un objeto optimista y cerrar el diálogo", () => {
    // Arrange
    const { result } = renderHook(() =>
      useCampaignCreationDialog(defaultProps)
    );
    const formData = new FormData();
    formData.append("name", "Nueva Campaña");

    // Act
    act(() => {
      result.current.openCreateDialog(); // Abrir para luego verificar que se cierra
      result.current.handleCreateCampaign(formData);
    });

    // Assert
    expect(mockHandleCreate).toHaveBeenCalledTimes(1);
    expect(mockHandleCreate).toHaveBeenCalledWith(
      formData,
      expect.objectContaining({
        name: "Nueva Campaña",
        status: "draft",
        site_id: "site-123",
      })
    );
    expect(result.current.isCreateDialogOpen).toBe(false);
  });
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Cobertura de Pruebas Atómica**: ((Implementada)) La suite valida la lógica del hook en aislamiento.
 * 2. **Validación de Contrato**: ((Implementada)) La prueba verifica que el hook llame a sus dependencias (`handleCreate`) con el contrato de datos correcto, asegurando una integración robusta.
 *
 * @subsection Melhorias Futuras
 * 1. **Pruebas de Lógica Condicional**: ((Vigente)) Si el hook se expande para manejar la creación desde plantillas, se deben añadir pruebas para validar esa nueva rama lógica.
 *
 * =====================================================================
 */
// tests/unit/lib/hooks/use-campaign-creation-dialog.test.ts
