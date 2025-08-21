// tests/unit/components/ui/button/Button.ecosystem.test.tsx
import { describe, expect, it } from "vitest";
import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { render, screen } from "@tests/utils/render";

/**
 * @file Button.ecosystem.test.tsx
 * @description Arnés de pruebas de integración de élite para todo el ecosistema Button.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
describe("Ecosistema de Diseño Atómico: Button", () => {
  describe("1. Primitivas (Renderizado Puro)", () => {
    it("Button (primitiva Base) debe aplicar variantes CVA correctamente", () => {
      render(
        <Button variant="outline" size="sm" colorScheme="destructive">
          Delete
        </Button>
      );
      const button = screen.getByRole("button", { name: "Delete" });
      expect(button).toHaveClass("border-destructive", "h-9");
    });

    it("Button (primitiva Link) debe renderizar un <a> con variantes CVA", () => {
      render(
        <Button href={"/test" as any} variant="link">
          Navigate
        </Button>
      );
      const link = screen.getByRole("link", { name: "Navigate" });
      expect(link).toHaveAttribute("href", "/test");
      expect(link).toHaveClass("text-primary");
    });

    it("Button (primitiva Slot) debe fusionar variantes CVA con su hijo", () => {
      render(
        <Button asChild colorScheme="success">
          <div data-testid="child">Slotted</div>
        </Button>
      );
      expect(screen.getByTestId("child")).toHaveClass("bg-green-600");
    });
  });

  describe("2. Contenido (Lógica Visual Interna)", () => {
    it("debe mostrar un spinner y deshabilitarse cuando `isLoading` es true", () => {
      render(<Button isLoading>Cargando</Button>);
      const button = screen.getByRole("button", { name: "Cargando" });
      expect(button).toBeDisabled();
      expect(button.querySelector("svg.animate-spin")).toBeInTheDocument();
    });

    it("debe mostrar `loadingText` en lugar de `children` cuando está cargando", () => {
      render(
        <Button isLoading loadingText="Guardando...">
          Guardar
        </Button>
      );
      expect(
        screen.getByRole("button", { name: "Guardando..." })
      ).toBeInTheDocument();
      expect(screen.queryByText("Guardar")).not.toBeInTheDocument();
    });

    it("debe renderizar `leftIcon` y `rightIcon` correctamente", () => {
      render(
        <Button leftIcon={<Save />} rightIcon={<Save />}>
          Iconos
        </Button>
      );
      const icons = screen
        .getByRole("button", { name: "Iconos" })
        .querySelectorAll("svg");
      expect(icons).toHaveLength(2);
      expect(icons[0]).toHaveClass("mr-2");
      expect(icons[1]).toHaveClass("ml-2");
    });
  });

  describe("3. Composición (Layout)", () => {
    it("Button.Group debe aplicar las clases de grupo correctamente", () => {
      render(
        <Button.Group>
          <Button>Uno</Button>
          <Button>Dos</Button>
        </Button.Group>
      );
      expect(screen.getByRole("group")).toHaveClass(
        "[&>button:first-child]:rounded-r-none"
      );
    });
  });
});
// tests/unit/components/ui/button/Button.ecosystem.test.tsx
