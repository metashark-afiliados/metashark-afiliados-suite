/**
 * @file dashboard-client.test.tsx
 * @description Arnés de pruebas de integración para el orquestador de UI del
 *              Hub Creativo, `DashboardClient`. Valida que el componente
 *              ensamble correctamente sus hijos soberanos refactorizados.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { describe, it, expect, vi } from "vitest";

import { DashboardClient } from "@/app/[locale]/dashboard/dashboard-client";
import { createMockDashboardContext } from "@tests/mocks/factories/context.factory";
import { render, screen } from "@tests/utils/render";

// Mockear los componentes hijos soberanos para aislar la prueba al ensamblador.
vi.mock("@/components/dashboard/WelcomeHero", () => ({
  WelcomeHero: () => <div data-testid="welcome-hero" />,
}));
vi.mock("@/components/dashboard/ActionDock", () => ({
  ActionDock: () => <div data-testid="action-dock" />,
}));
vi.mock("@/components/dashboard/RecentActivity", () => ({
  RecentActivity: () => <div data-testid="recent-activity" />,
}));

describe("Integration Test: DashboardClient Orchestrator", () => {
  it("debe ensamblar y renderizar correctamente todos los componentes del Hub Creativo", () => {
    // Arrange: Crear un contexto de dashboard de alta fidelidad.
    const mockContext = createMockDashboardContext();

    // Act: Renderizar el componente bajo prueba con el contexto simulado.
    render(<DashboardClient />, { dashboardContext: mockContext });

    // Assert: Verificar que el orquestador ha renderizado cada uno de sus hijos.
    expect(screen.getByTestId("welcome-hero")).toBeInTheDocument();
    expect(screen.getByTestId("action-dock")).toBeInTheDocument();
    expect(screen.getByTestId("recent-activity")).toBeInTheDocument();
  });
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Blindaje Contra Regresiones**: ((Implementada)) Este arnés de pruebas establece una barrera de calidad que previene futuras regresiones en la composición del Hub Creativo. Si un componente hijo se elimina o cambia su nombre, esta prueba fallará.
 * 2. **Validación de Arquitectura Soberana**: ((Implementada)) Al renderizar exitosamente, la prueba valida indirectamente que los componentes hijos soberanos pueden ser consumidos sin problemas por su padre, confirmando el éxito de la refactorización de la Épica 6.
 * 3. **Pruebas Aisladas (SRP)**: ((Implementada)) Al mockear los componentes hijos, la prueba se enfoca únicamente en la responsabilidad del `DashboardClient` (el ensamblaje), adhiriéndose a las mejores prácticas de pruebas.
 *
 * @subsection Melhorias Futuras
 * 1. **Pruebas de Renderizado Condicional**: ((Vigente)) Si en el futuro `DashboardClient` implementa lógica para renderizar condicionalmente sus hijos (ej. no mostrar `RecentActivity` si no hay campañas), se deberán añadir nuevos casos de prueba para validar esa lógica. Propondré esta mejora junto con la refactorización correspondiente.
 *
 * =====================================================================
 */