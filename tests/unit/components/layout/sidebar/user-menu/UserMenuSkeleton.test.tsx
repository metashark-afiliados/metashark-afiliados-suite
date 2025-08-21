// tests/unit/components/layout/sidebar/user-menu/UserMenuSkeleton.test.tsx
import { describe, expect, it } from "vitest";

import { UserMenuSkeleton } from "@/components/layout/sidebar/user-menu/UserMenuSkeleton";
import { render, screen } from "@tests/utils/render";

/**
 * @file UserMenuSkeleton.test.tsx
 * @description Arnés de pruebas unitarias para el componente de presentación puro
 *              `UserMenuSkeleton`. Valida que el componente se renderiza
 *              correctamente y es accesible.
 * @author Raz Podestá
 * @version 1.0.0
 */
describe("Componente Atómico: UserMenuSkeleton", () => {
  it("debe renderizar sin errores y ser accesible", () => {
    // Arrange
    render(<UserMenuSkeleton />);

    // Act
    const skeleton = screen.getByRole("status", {
      name: /loading user menu/i,
    });

    // Assert
    expect(skeleton).toBeInTheDocument();
  });
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Prueba de Humo (Smoke Test)**: ((Implementada)) Este arnés de pruebas proporciona una validación fundamental de que el componente se renderiza sin errores en el entorno de pruebas.
 * 2. **Prueba de Accesibilidad**: ((Implementada)) La prueba busca explícitamente el `role="status"` y el `aria-label`, garantizando que el contrato de accesibilidad del componente se cumpla.
 *
 * @subsection Melhorias Futuras
 * 1. **Pruebas de Estilo Visual (Snapshot)**: ((Vigente)) Se podría añadir una prueba de snapshot para asegurar que la estructura visual del esqueleto no cambie accidentalmente.
 * 2. **Auditoría de Accesibilidad con `axe`**: ((Vigente)) Integrar `jest-axe` para realizar una auditoría automática de accesibilidad en el DOM renderizado, validando el cumplimiento de los estándares WCAG.
 *
 * =====================================================================
 */