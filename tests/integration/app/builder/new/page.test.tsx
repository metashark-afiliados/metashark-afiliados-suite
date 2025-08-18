// tests/integration/app/builder/new/page.test.tsx
/**
 * @file page.test.tsx
 * @description Arnés de pruebas de integración para el punto de entrada
 *              del builder `CreateCampaignLoader`.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { redirect } from "next/navigation";
import { describe, expect, it, vi } from "vitest";

import * as helpers from "@/lib/actions/_helpers";
import * as actions from "@/lib/actions";
import CreateCampaignLoader from "@/app/[locale]/builder/new/page";

// --- Mocks ---
vi.mock("next/navigation");
vi.mock("@/lib/actions");
vi.mock("@/lib/actions/_helpers");

describe("Arnés de Pruebas: CreateCampaignLoader Page", () => {
  it("Camino Feliz: debe llamar a la acción de creación y redirigir en caso de éxito", async () => {
    // Arrange
    const mockAction = vi
      .mocked(actions.campaigns.createCampaignFromTemplateAction)
      .mockResolvedValue({ success: true, data: { id: "new-campaign-123" } });

    const props = {
      params: { locale: "es-ES" },
      searchParams: { type: "landing", siteId: "site-456" },
    };

    // Act
    await CreateCampaignLoader(props);

    // Assert
    expect(mockAction).toHaveBeenCalledWith("landing", "site-456");
    expect(redirect).toHaveBeenCalledWith("/builder/new-campaign-123");
  });

  it("Manejo de Errores: debe registrar un error persistente y no redirigir en caso de fallo", async () => {
    // Arrange
    vi.mocked(
      actions.campaigns.createCampaignFromTemplateAction
    ).mockResolvedValue({ success: false, error: "error_creation_failed" });
    const mockLogError = vi.spyOn(helpers, "createPersistentErrorLog");

    const props = {
      params: { locale: "es-ES" },
      searchParams: { type: "landing" },
    };

    // Act
    // RSCs devuelven una promesa que resuelve al JSX a renderizar
    const ErrorComponentPromise = CreateCampaignLoader(props);
    const ErrorComponent = await ErrorComponentPromise;

    // Assert
    expect(ErrorComponent).toBeDefined();
    expect(ErrorComponent.type).toBe("main"); // Verifica que se renderiza el layout de error
    expect(mockLogError).toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Prueba de Lógica de Servidor**: ((Implementada)) La suite valida la lógica del Server Component, incluyendo llamadas a Server Actions y redirecciones.
 *
 * @subsection Melhorias Futuras
 * 1. **Aserción de Renderizado**: ((Vigente)) Utilizar `@testing-library/react` para renderizar el `ErrorComponent` y hacer aserciones sobre su contenido textual.
 *
 * =====================================================================
 */
// tests/integration/app/builder/new/page.test.tsx
