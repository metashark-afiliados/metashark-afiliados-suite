// tests/unit/components/ui/button/Button.test.tsx
import { render, screen } from "@tests/utils/render";
import { Save } from "lucide-react";
import { describe, expect, it } from "vitest";
import { Button } from "@/components/ui/button";

describe("Ecosistema de Diseño Atómico: Button", () => {
  it("debe renderizar un <button> con iconos y estado de carga", () => {
    const { rerender } = render(<Button leftIcon={<Save />}>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save" }).querySelector("svg")
    ).toBeInTheDocument();

    rerender(
      <Button isLoading loadingText="Saving...">
        Save
      </Button>
    );
    expect(screen.getByRole("button", { name: "Saving..." })).toBeDisabled();
    expect(
      screen
        .getByRole("button", { name: "Saving..." })
        .querySelector(".animate-spin")
    ).toBeInTheDocument();
  });

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
