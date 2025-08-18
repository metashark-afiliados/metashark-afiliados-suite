// tests/integration/lib/actions/campaigns/assign-site.action.test.ts
/**
 * @file assign-site.action.test.ts
 * @description Arnés de pruebas de integración para la Server Action
 *              `assignSiteToCampaignAction`, validando la lógica de negocio y seguridad.
 * @author Raz Podestá
 * @version 1.0.0
 */
import {
  createMockSupabaseClient,
  createMockUser,
  type MockSupabaseClient,
} from "tests/utils/factories";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { assignSiteToCampaignAction } from "@/lib/actions/campaigns/assign-site.action";
import { getAuthenticatedUser } from "@/lib/actions/_helpers";
import { requireSitePermission } from "@/lib/auth/user-permissions";
import { createClient } from "@/lib/supabase/server";

vi.mock("@/lib/supabase/server");
vi.mock("@/lib/auth/user-permissions");
vi.mock("@/lib/actions/_helpers");
vi.mock("next/cache");

describe("Arnés de Pruebas de Integración: assignSiteToCampaignAction", () => {
  let supabaseMocks: MockSupabaseClient["mocks"];
  const MOCK_USER = createMockUser({ id: "user-owner-123" });
  const MOCK_SITE_ID = "site-xyz-789";
  const MOCK_CAMPAIGN_ID = "campaign-abc-123";

  beforeEach(() => {
    vi.clearAllMocks();
    const { supabase, mocks } = createMockSupabaseClient();
    supabaseMocks = mocks;
    vi.mocked(createClient).mockReturnValue(supabase as any);
    vi.mocked(getAuthenticatedUser).mockResolvedValue({ user: MOCK_USER });
  });

  it("Seguridad: debe fallar si el usuario no tiene permisos sobre el sitio de destino", async () => {
    vi.mocked(requireSitePermission).mockResolvedValue({
      success: false,
      error: "PERMISSION_DENIED",
    } as any);

    const result = await assignSiteToCampaignAction(
      MOCK_CAMPAIGN_ID,
      MOCK_SITE_ID
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("CampaignsPage.errors.permission_denied_site");
    }
  });

  it("Seguridad: debe fallar si la campaña ya está asignada a un sitio", async () => {
    vi.mocked(requireSitePermission).mockResolvedValue({
      success: true,
      data: { site: {} },
    } as any);
    supabaseMocks.mockSingle.mockResolvedValue({
      data: {
        id: MOCK_CAMPAIGN_ID,
        created_by: MOCK_USER.id,
        site_id: "another-site-id", // Ya asignada
      },
      error: null,
    });

    const result = await assignSiteToCampaignAction(
      MOCK_CAMPAIGN_ID,
      MOCK_SITE_ID
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("CampaignsPage.errors.assignment_not_allowed");
    }
  });

  it("Camino Feliz: debe asignar el sitio a la campaña con éxito", async () => {
    vi.mocked(requireSitePermission).mockResolvedValue({
      success: true,
      data: { site: { subdomain: "test-site" } },
    } as any);
    supabaseMocks.mockSingle.mockResolvedValue({
      data: {
        id: MOCK_CAMPAIGN_ID,
        created_by: MOCK_USER.id,
        site_id: null, // Huérfana
        name: "Campaña de Prueba",
      },
      error: null,
    });
    supabaseMocks.mockUpdate.mockResolvedValue({ error: null });

    const result = await assignSiteToCampaignAction(
      MOCK_CAMPAIGN_ID,
      MOCK_SITE_ID
    );

    expect(result.success).toBe(true);
    expect(supabaseMocks.mockUpdate).toHaveBeenCalledWith({
      site_id: MOCK_SITE_ID,
    });
  });
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Arnés de Pruebas de Seguridad**: ((Implementada)) Se han creado pruebas específicas para validar cada capa de la lógica de seguridad, garantizando la robustez de la acción.
 *
 * @subsection Melhorias Futuras
 * 1. **Pruebas de Revalidación**: ((Vigente)) Añadir aserciones para verificar que `revalidatePath` es llamado con las rutas correctas en el camino feliz.
 *
 * =====================================================================
 */
// tests/integration/lib/actions/campaigns/assign-site.action.test.ts
