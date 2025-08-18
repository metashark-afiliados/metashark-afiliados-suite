// tests/unit/components/dashboard/dashboard-client.test.tsx
/**
 * @file dashboard-client.test.tsx
 * @description Arnés de pruebas unitarias para el ensamblador `DashboardClient`.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { render } from "@testing-library/react";
import { mockNextIntl } from "tests/mocks";
import { describe, expect, it, vi } from "vitest";

import { ActionDock } from "@/components/dashboard/ActionDock";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { WelcomeHero } from "@/components/dashboard/WelcomeHero";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { useDashboard } from "@/lib/context/DashboardContext";

// --- Mocks ---
mockNextIntl();
vi.mock("@/lib/context/DashboardContext");
vi.mock("@/components/dashboard/ActionDock");
vi.mock("@/components/dashboard/RecentActivity");
vi.mock("@/components/dashboard/WelcomeHero");
vi.mock("@/components/layout/DashboardHeader");

describe("Aparato Ensamblador: DashboardClient", () => {
  it("debe renderizar y ensamblar correctamente todos sus componentes hijos", () => {
    // Arrange
    vi.mocked(useDashboard).mockReturnValue({
      user: { user_metadata: { full_name: "Test User" } },
      recentCampaigns: [],
    } as any);

    // Act
    render(<DashboardClient />);

    // Assert
    expect(DashboardHeader).toHaveBeenCalledTimes(1);
    expect(WelcomeHero).toHaveBeenCalledTimes(1);
    expect(ActionDock).toHaveBeenCalledTimes(1);
    expect(RecentActivity).toHaveBeenCalledTimes(1);
  });
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Prueba de Composición**: ((Implementada)) La prueba valida que el `DashboardClient` cumple su única responsabilidad: ensamblar sus componentes hijos.
 *
 * @subsection Melhorias Futuras
 * 1. **Pruebas de Contrato de Contexto**: ((Vigente)) Se podría expandir la prueba para verificar que los datos correctos del `useDashboard` mock (username, recentCampaigns) se pasen como props a los componentes hijos.
 *
 * =====================================================================
 */
// tests/unit/components/dashboard/dashboard-client.test.tsx
