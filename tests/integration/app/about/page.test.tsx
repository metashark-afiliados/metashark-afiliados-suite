// tests/integration/app/about/page.test.tsx
/**
 * @file page.test.tsx
 * @description Arnés de pruebas de integración para la página "Sobre Nosotros".
 *              Valida que el Server Component se renderice correctamente y
 *              ensamble sus componentes hijos con los datos esperados.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AboutPage from "@/app/[locale]/about/page";
import { render } from "@tests/utils/render";

describe("Página de Integración: AboutPage", () => {
  it("debe renderizar el título principal y las secciones de misión y equipo", async () => {
    // Arrange
    await render(await AboutPage({ params: { locale: "es-ES" } }), {
      namespaces: ["pages.AboutPage"],
      locale: "es-ES",
    });

    // Assert
    expect(
      screen.getByRole("heading", { name: /sobre convertikit/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: /nuestra misión/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /el equipo central/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Arquitecto de Software Principal")
    ).toBeInTheDocument();
  });
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Prueba de Ensamblaje Servidor-Cliente**: ((Implementada)) Esta prueba valida el patrón de arquitectura clave donde un Server Component obtiene datos y los pasa a Client Components para el renderizado interactivo.
 *
 * =====================================================================
 */
// tests/integration/app/about/page.test.tsx
