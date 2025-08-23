// tests/integration/app/dashboard/layout.test.tsx
/**
 * @file layout.test.tsx
 * @description Arnés de pruebas de integración para el `DashboardLayout`.
 *              Refactorizado con una aserción de redirección de alta fidelidad,
 *              alineada con el comportamiento del mock `next-router-mock`.
 * @author L.I.A. Legacy
 * @version 1.0.2
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

import DashboardLayout from "@/app/[locale]/dashboard/layout";
import * as dashboardLoader from "@/components/layout/dashboard.loader";
import { createMockDashboardContext } from "@tests/mocks/factories/context.factory";
import { redirectSpy } from "@tests/mocks/navigation.mock";
import { render, screen, waitFor } from "@tests/utils/render";

vi.mock("@/components/layout/DashboardSidebar", () => ({
  DashboardSidebar: () => <aside data-testid="dashboard-sidebar" />,
}));
vi.mock("@/components/layout/GlobalOverlays", () => ({
  GlobalOverlays: () => <div data-testid="global-overlays" />,
}));
vi.mock("@/components/shared/ErrorBoundary", () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe("Integration Test: DashboardLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    redirectSpy.mockClear();
  });

  it("debe redirigir a /auth/login si no hay datos de layout (usuario no autenticado)", async () => {
    const loaderSpy = vi
      .spyOn(dashboardLoader, "getLayoutData")
      .mockResolvedValue(null);

    // Ejecuta el Server Component. No necesitamos capturar su valor de retorno.
    await DashboardLayout({ children: <div>Child Content</div> });

    expect(loaderSpy).toHaveBeenCalledTimes(1);

    // La aserción clave es verificar que el spy de redirección fue llamado.
    await waitFor(() => {
      expect(redirectSpy).toHaveBeenCalledWith("/auth/login?next=/dashboard");
    });
  });

  it("debe renderizar el layout, sus hijos y proveer el contexto si el usuario está autenticado", async () => {
    const mockContextData = createMockDashboardContext();
    vi.spyOn(dashboardLoader, "getLayoutData").mockResolvedValue(
      mockContextData
    );

    const LayoutComponent = await DashboardLayout({
      children: <div>Child Content</div>,
    });
    render(LayoutComponent);

    expect(screen.getByTestId("dashboard-sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("global-overlays")).toBeInTheDocument();
    expect(screen.getByText("Child Content")).toBeInTheDocument();
    expect(redirectSpy).not.toHaveBeenCalled();
  });
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Aserción de Alta Fidelidad**: ((Implementada)) La prueba ahora valida el efecto secundario observable (la llamada a `redirectSpy`), que es una forma más robusta y precisa de probar la lógica de redirección en este entorno de pruebas. Esto resuelve el `AssertionError`.
 *
 * =====================================================================
 */
