// tests/unit/app/not-found.test.tsx
/**
 * @file not-found.test.tsx
 * @description Arnés de pruebas para validar la infraestructura de mocks reconstruida.
 * @author L.I.A. Legacy
 * @version 1.3.1
 */
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import NotFound from "@/app/not-found";
import { render } from "@tests/utils/render";

describe("Componente Atómico: NotFound", () => {
  it("debe renderizar correctamente sin errores de composición o i18n", () => {
    // Arrange
    // La utilidad `render` ya se encarga de los mocks.
    // El mock de `useTranslations` ahora devuelve claves predecibles y no necesita datos reales.
    render(<NotFound /> /* Eliminado: , { messages: {} } */);

    // Assert
    // Las aserciones ahora verifican las claves de i18n devueltas por el mock.
    expect(
      screen.getByRole("heading", {
        name: /\[i18n\] pages.NotFoundPage.title/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText("[i18n] pages.NotFoundPage.description")
    ).toBeInTheDocument();

    const homeLink = screen.getByRole("link", {
      name: /\[i18n\] pages.NotFoundPage.backToHome/i,
    });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");

    const dashboardLink = screen.getByRole("link", {
      name: /\[i18n\] pages.NotFoundPage.goToDashboard/i,
    });
    expect(dashboardLink).toBeInTheDocument();
    expect(dashboardLink).toHaveAttribute("href", "/dashboard");
  });
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Principios DRY y Coherencia**: ((Implementada)) Se ha eliminado el parámetro `messages: {}` redundante de la llamada `render`, ya que el mock global de `next-intl` no lo requiere, lo que mejora la limpieza del código de prueba y se alinea con la arquitectura de mocks global.
 * 2. **Aserciones actualizadas**: ((Implementada)) Las aserciones ahora se basan en el formato de salida del mock de `next-intl` (ej. `[i18n] pages.NotFoundPage.title`).
 *
 * @subsection Melhorias Futuras
 * 1. **Sincronización con Infraestructura v3.0**: ((Vigente)) Las aserciones han sido actualizadas para coincidir con la salida del nuevo mock de `useTranslations`.
 *
 * =====================================================================
 */
