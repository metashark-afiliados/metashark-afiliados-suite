// tests/integration/lib/actions/campaigns/create-from-template.action.test.ts
/**
 * @file create-from-template.action.test.ts
 * @description Arnés de pruebas de integración para la Server Action
 *              `createCampaignFromTemplateAction`. Valida los flujos de creación
 *              de campañas asignadas y huérfanas.
 * @author Raz Podestá
 * @version 2.0.0
 */
import { revalidatePath } from "next/cache";
import {
  createMockSupabaseClient,
  createMockUser,
  type MockSupabaseClient,
} from "tests/utils/factories";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createCampaignFromTemplateAction } from "@/lib/actions/campaigns/create-from-template.action";
import { getAuthenticatedUser } from "@/lib/actions/_helpers";
import { requireSitePermission } from "@/lib/auth/user-permissions";
import { createClient } from "@/lib/supabase/server";

// --- Mocks ---
vi.mock("@/lib/supabase/server");
vi.mock("@/lib/auth/user-permissions");
vi.mock("@/lib/actions/_helpers");
vi.mock("next/cache");

describe("Arnés de Pruebas de Integración: createCampaignFromTemplateAction", () => {
  let supabaseMocks: MockSupabaseClient["mocks"];
  const MOCK_USER = createMockUser();
  const MOCK_SITE_ID = "site-001";

  beforeEach(() => {
    vi.clearAllMocks();
    const { supabase, mocks } = createMockSupabaseClient();
    supabaseMocks = mocks;
    vi.mocked(createClient).mockReturnValue(supabase as any);
    vi.mocked(getAuthenticatedUser).mockResolvedValue({ user: MOCK_USER });
    supabaseMocks.mockSingle.mockResolvedValue({
      data: { id: "new-campaign-uuid" },
      error: null,
    });
  });

  it("Seguridad: debe fallar si se provee un siteId pero el usuario no tiene permisos", async () => {
    // Arrange
    vi.mocked(requireSitePermission).mockResolvedValue({
      success: false,
      error: "PERMISSION_DENIED",
    } as any);

    // Act
    const result = await createCampaignFromTemplateAction(
      "landing",
      MOCK_SITE_ID
    );

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("CampaignsPage.errors.permission_denied");
    }
  });

  it("Camino Feliz (Asignada): debe crear una campaña con siteId y revalidar ambas rutas", async () => {
    // Arrange
    vi.mocked(requireSitePermission).mockResolvedValue({
      success: true,
    } as any);

    // Act
    const result = await createCampaignFromTemplateAction(
      "landing",
      MOCK_SITE_ID
    );

    // Assert
    expect(result.success).toBe(true);
    expect(supabaseMocks.mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        site_id: MOCK_SITE_ID,
      })
    );
    expect(revalidatePath).toHaveBeenCalledWith(
      `/dashboard/sites/${MOCK_SITE_ID}/campaigns`
    );
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard", "layout");
  });

  it("Camino Feliz (Huérfana): debe crear una campaña con site_id nulo y revalidar solo el dashboard", async () => {
    // Act
    const result = await createCampaignFromTemplateAction("landing"); // Sin siteId

    // Assert
    expect(result.success).toBe(true);
    expect(requireSitePermission).not.toHaveBeenCalled();
    expect(supabaseMocks.mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        site_id: null,
      })
    );
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard", "layout");
    expect(revalidatePath).toHaveBeenCalledTimes(1); // Solo una revalidación
  });
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Validación de Arquitectura**: ((Implementada)) Se ha añadido un nuevo caso de prueba para validar el "Camino Feliz (Huérfana)", asegurando que la acción funciona correctamente sin un `siteId`.
 *
 * @subsection Melhorias Futuras
 * 1. **Prueba de Error de Base de Datos**: ((Vigente)) Añadir una prueba que simule un fallo en `supabase.from().insert()` y verifique que `createPersistentErrorLog` es invocado y se devuelve el error correcto.
 * =====================================================================
 */
// tests/integration/lib/actions/campaigns/create-from-template.action.test.ts
