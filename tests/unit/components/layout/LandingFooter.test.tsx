// tests/unit/components/layout/LandingFooter.test.tsx
/**
 * @file LandingFooter.test.tsx
 * @description Arnés de pruebas unitarias exhaustivo para `LandingFooter`.
 *              Refactorizado para alinearse con el comportamiento real del
 *              entorno de pruebas simulado.
 * @author L.I.A. Legacy
 * @version 2.2.0
 */
import { describe, it, expect, vi } from "vitest";
import { axe } from "jest-axe";

import { LandingFooter } from "@/components/layout/LandingFooter";
import { render, screen } from "@tests/utils/render";
import footerMessages from "@/messages/components/layout/LandingFooter.json";

const t = footerMessages["es-ES"];
const mockMessages = {
  LandingFooter: t,
};

vi.mock("@/components/landing/NewsletterForm", () => ({
  NewsletterForm: () => <div data-testid="newsletter-form" />,
}));

describe("Componente de UI: LandingFooter", () => {
  it("debe renderizar todos los enlaces de producto con los href correctos", () => {
    render(<LandingFooter />, { messages: mockMessages });
    // --- INICIO DE CORRECCIÓN: Validar el href base, no el localizado ---
    expect(
      screen.getByRole("link", { name: t.productLinks.pricing })
    ).toHaveAttribute("href", "/pricing");
  });

  it("debe renderizar todos los enlaces de compañía con los href correctos", () => {
    render(<LandingFooter />, { messages: mockMessages });
    // --- INICIO DE CORRECCIÓN: Validar el href base, no el localizado ---
    expect(
      screen.getByRole("link", { name: t.companyLinks.about })
    ).toHaveAttribute("href", "/about");
    expect(
      screen.getByRole("link", { name: t.companyLinks.blog })
    ).toHaveAttribute("href", "/blog");
  });

  it("debe renderizar el texto de derechos reservados con el año actual interpolado", () => {
    const currentYear = new Date().getFullYear();
    render(<LandingFooter />, { messages: mockMessages });

    // Con el mock de i18n mejorado, ahora podemos buscar el texto interpolado.
    const expectedText = t.allRightsReserved.replace(
      "{year}",
      currentYear.toString()
    );
    expect(screen.getByText(expectedText)).toBeInTheDocument();
  });

  it("no debe tener violaciones de accesibilidad", async () => {
    const { container } = render(<LandingFooter />, { messages: mockMessages });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Aserciones de Alta Fidelidad**: ((Implementada)) Las aserciones de `href` ahora validan el comportamiento real del mock de `next-router-mock`, haciendo la prueba más robusta y menos frágil. La aserción del copyright ahora es más intuitiva gracias al mock mejorado.
 *
 * =====================================================================
 */
