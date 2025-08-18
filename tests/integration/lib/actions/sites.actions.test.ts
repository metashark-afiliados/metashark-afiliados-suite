// tests/integration/lib/actions/sites.actions.test.ts
/**
 * @file tests/integration/lib/actions/sites.actions.test.ts
 * @description Arnés de pruebas de integración de élite para las Server Actions de Sitios.
 *              Valida la lógica de negocio, seguridad y contratos de datos, utilizando
 *              la infraestructura de mocks de alta fidelidad para un control total.
 * @author Raz Podestá
 * @version 1.4.0
 */
import { revalidatePath } from "next/cache";
import {
  createMockSupabaseClient,
  createMockUser,
  type MockSupabaseClient,
} from "tests/utils/factories";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createSiteAction } from "@/lib/actions/sites.actions";
import { requireWorkspacePermission } from "@/lib/auth/user-permissions";
import { createClient } from "@/lib/supabase/server";

// --- Mocks de Dependencias ---
// LIMPIEZA: Mock local eliminado. Ahora es gestionado globalmente por `tests/setup.ts`.
vi.mock("@/lib/supabase/server");
vi.mock("@/lib/auth/user-permissions");
vi.mock("@/lib/actions/_helpers");
vi.mock("next/cache");
vi.mock("@/lib/logging");

describe("Arnés de Pruebas: lib/actions/sites.actions.ts", () => {
  let supabaseMocks: MockSupabaseClient["mocks"];
  const MOCK_WORKSPACE_ID = "00000000-0000-0000-0000-000000000001";
  const MOCK_USER = createMockUser({
    id: "00000000-0000-0000-0000-000000000002",
  });
  const MOCK_USER_AUTHDATA = {
    user: MOCK_USER,
    appRole: "developer" as const,
    activeWorkspaceId: MOCK_WORKSPACE_ID,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    const { supabase, mocks } = createMockSupabaseClient();
    supabaseMocks = mocks;
    vi.mocked(createClient).mockReturnValue(supabase as any);
  });

  describe("Acción: createSiteAction", () => {
    it("Seguridad: debe fallar si el guardián de permisos `requireWorkspacePermission` falla", async () => {
      // Arrange
      vi.mocked(requireWorkspacePermission).mockResolvedValue({
        success: false,
        error: "PERMISSION_DENIED",
        data: MOCK_USER_AUTHDATA,
      });
      const formData = new FormData();
      formData.append("workspaceId", MOCK_WORKSPACE_ID);
      formData.append("name", "Sitio No Autorizado");
      formData.append("subdomain", "no-autorizado");

      // Act
      const result = await createSiteAction(formData);

      // Assert
      expect(requireWorkspacePermission).toHaveBeenCalledWith(
        MOCK_WORKSPACE_ID,
        ["owner", "admin", "member"]
      );
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("No tienes permiso");
      }
      expect(supabaseMocks.mockFrom).not.toHaveBeenCalled();
    });

    it("Camino Feliz: debe crear un sitio y revalidar la caché en caso de éxito", async () => {
      // Arrange
      vi.mocked(requireWorkspacePermission).mockResolvedValue({
        success: true,
        data: MOCK_USER_AUTHDATA,
      });
      supabaseMocks.mockSingle.mockResolvedValue({
        data: { id: "new-site-uuid" },
        error: null,
      });
      const formData = new FormData();
      formData.append("workspaceId", MOCK_WORKSPACE_ID);
      formData.append("name", "Mi Sitio Élite");
      formData.append("subdomain", "elite");
      formData.append("description", "Descripción de prueba");

      // Act
      const result = await createSiteAction(formData);

      // Assert
      expect(result.success).toBe(true);
      expect(supabaseMocks.mockFrom).toHaveBeenCalledWith("sites");
      expect(supabaseMocks.mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          workspace_id: MOCK_WORKSPACE_ID,
          owner_id: MOCK_USER.id,
          name: "Mi Sitio Élite",
          subdomain: "elite",
        })
      );
      expect(revalidatePath).toHaveBeenCalledWith("/dashboard/sites");
    });

    it("Manejo de Errores: debe devolver un error si el subdominio ya está en uso (error DB 23505)", async () => {
      // Arrange
      vi.mocked(requireWorkspacePermission).mockResolvedValue({
        success: true,
        data: MOCK_USER_AUTHDATA,
      });
      supabaseMocks.mockSingle.mockResolvedValue({
        data: null,
        error: { code: "23505", message: "duplicate key value" },
      });
      const formData = new FormData();
      formData.append("workspaceId", MOCK_WORKSPACE_ID);
      formData.append("name", "Sitio Duplicado");
      formData.append("subdomain", "duplicado");

      // Act
      const result = await createSiteAction(formData);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Este subdominio ya está en uso.");
      }
    });
  });
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Principio DRY**: ((Implementada)) El mock local para `React.cache` ha sido eliminado, ya que ahora es gestionado globalmente por `tests/setup.ts`. Esto limpia el archivo y se adhiere a las mejores prácticas.
 *
 * @subsection Melhorias Futuras
 * 1. **Cobertura de Acciones CRUD**: ((Vigente)) Expandir esta suite para incluir pruebas para `updateSiteAction` y `deleteSiteAction`.
 *
 * =====================================================================
 */
// tests/integration/lib/actions/sites.actions.test.ts
