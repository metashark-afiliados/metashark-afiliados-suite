// tests/integration/app/legal/DisclaimerPage.test.tsx
/**
 * @file tests/integration/app/legal/DisclaimerPage.test.tsx
 * @description Arnés de pruebas de integración para la página de Disclaimer.
 *              Valida que la página renderice correctamente el layout legal
 *              con el contenido y el icono correctos.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import DisclaimerPage from "@/app/[locale]/disclaimer/page";
import * as DynamicIconModule from "@/components/ui/DynamicIcon";
import { render } from "@tests/utils/render";

// Mock del componente que renderiza el icono dinámicamente
const DynamicIconSpy = vi.spyOn(DynamicIconModule, "DynamicIcon");

describe("Página de Integración: DisclaimerPage", () => {
  it("debe renderizar el título y pasar el nombre de icono 'AlertOctagon' correcto a LegalPageLayout", async () => {
    // Arrange: Renderiza el Server Component
    // La utilidad `render` manejará la carga de namespaces si fuera necesario.
    await render(
      await DisclaimerPage({
        params: { locale: "es-ES" },
      })
    );

    // Assert: Verifica que el título principal de la página se renderice
    expect(
      screen.getByRole("heading", { name: /descargo de responsabilidad/i })
    ).toBeInTheDocument();

    // Assert: Verifica que el componente DynamicIcon fue llamado con la prop 'name' correcta
    expect(DynamicIconSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "AlertOctagon",
      }),
      expect.anything()
    );
  });
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Garantía de Calidad y No Regresión**: ((Implementada)) Se ha creado una suite de pruebas de integración que valida explícitamente que el nombre del icono se pasa correctamente, previniendo futuras regresiones.
 *
 * @subsection Melhorias Futuras
 * 1. **Pruebas de Contenido Dinámico**: ((Vigente)) La prueba podría ser expandida para verificar que los títulos y párrafos del contenido de la página se renderizan correctamente, validando la integración con la capa de i18n.
 *
 * =====================================================================
 */
// tests/integration/app/legal/DisclaimerPage.test.tsx
