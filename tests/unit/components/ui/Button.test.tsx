// tests/unit/components/ui/Button.test.tsx
/**
 * @file Button.test.tsx
 * @description Arnés de pruebas unitarias de élite para el componente `Button`.
 *              Valida el renderizado, los estados (incluyendo isLoading) y la
 *              funcionalidad `asChild`.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "@/components/ui/button";
import { render } from "@tests/utils/render";

describe("Componente Atómico de Élite: Button", () => {
  it("debe renderizar correctamente con su contenido", async () => {
    await render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it("debe mostrar un spinner y estar deshabilitado cuando isLoading es true", async () => {
    await render(<Button isLoading>Submitting</Button>);
    const button = screen.getByRole("button", { name: /submitting/i });
    expect(button).toBeDisabled();
    expect(button.querySelector("svg.animate-spin")).toBeInTheDocument();
  });

  it("debe seguir deshabilitado si props.disabled es true, incluso si isLoading es false", async () => {
    await render(<Button disabled>Disabled Button</Button>);
    expect(
      screen.getByRole("button", { name: /disabled button/i })
    ).toBeDisabled();
  });

  it("debe renderizar como un componente hijo cuando asChild es true", async () => {
    await render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );
    const link = screen.getByRole("link", { name: /link button/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/test");
    // Verifica que no se renderice un botón anidado
    expect(link.tagName).toBe("A");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Arnés de Pruebas Unitarias**: ((Implementada)) Se ha creado una suite de pruebas completa desde cero para un componente de UI fundamental, estableciendo un estándar de calidad.
 * 2. **Validación de Contrato de Props**: ((Implementada)) Las pruebas validan explícitamente el comportamiento de las props `isLoading`, `disabled` y `asChild`.
 *
 * @subsection Melhorias Futuras
 * 1. **Pruebas de Regresión Visual**: ((Vigente)) Integrar Storybook o Ladle con un addon de snapshot visual para capturar y comparar imágenes del componente en todos sus estados.
 *
 * =====================================================================
 */
// tests/unit/components/ui/Button.test.tsx
