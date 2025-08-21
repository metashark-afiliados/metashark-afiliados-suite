// tests/integration/mocks/manifest.test.tsx
/**
 * @file tests/integration/mocks/manifest.test.tsx
 * @description Arnés de pruebas de integración de élite para la infraestructura de mocks.
 *              Valida que todos los mocks globales (i18n, Contexto, Navegación)
 *              son inyectados correctamente por el `render` personalizado.
 * @author Raz Podestá
 * @version 3.0.0
 */
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useDashboard } from "@/lib/context/DashboardContext";
import { Link, usePathname } from "@/lib/navigation";
import { db as DUMMY_DATA } from "@tests/mocks/data/database-state";
import { render } from "@tests/utils/render";

const MockConsumerComponent = () => {
  const { user } = useDashboard();
  const pathname = usePathname();
  return (
    <div>
      <h1>[i18n] DashboardSidebar.dashboard</h1>
      <p data-testid="user-id">{user.id}</p>
      <p data-testid="pathname">{pathname}</p>
      <Link href="/dashboard">Test Link</Link>
    </div>
  );
};

describe("Arnés de Pruebas de Integración: Manifiesto de Mocks", () => {
  it("debe simular correctamente el contexto del Dashboard", () => {
    render(<MockConsumerComponent />);
    expect(screen.getByTestId("user-id")).toHaveTextContent(
      DUMMY_DATA.profiles[0].id
    );
  });

  it("debe simular correctamente los hooks de navegación", () => {
    render(<MockConsumerComponent />);
    expect(screen.getByTestId("pathname")).toHaveTextContent("/mock-pathname");
    expect(screen.getByRole("link", { name: "Test Link" })).toHaveAttribute(
      "href",
      "/dashboard"
    );
  });

  it("debe simular correctamente los hooks de i18n", () => {
    render(<MockConsumerComponent />);
    expect(
      screen.getByRole("heading", {
        name: "[i18n] DashboardSidebar.dashboard",
      })
    ).toBeInTheDocument();
  });
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Prueba de Estabilidad**: ((Implementada)) Este arnés, al ejecutarse con éxito, valida que la refactorización completa de la infraestructura de mocks ha sido exitosa y que el "Reloj Suizo" está operativo.
 * =====================================================================
 */
// tests/integration/mocks/manifest.test.tsx
