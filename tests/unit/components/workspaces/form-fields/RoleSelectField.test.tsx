// tests/unit/components/workspaces/form-fields/RoleSelectField.test.tsx
import React from "react";
import { describe, expect, it } from "vitest";
import { useForm } from "react-hook-form";

import { RoleSelectField } from "@/components/workspaces/form-fields/RoleSelectField";
import { render, screen } from "@tests/utils/render";

const TestHarness = ({ errors = {}, isPending = false }) => {
  const { control } = useForm({
    defaultValues: { role: "member" },
  });
  return (
    <RoleSelectField control={control} errors={errors} isPending={isPending} />
  );
};

describe("Componente Atómico: RoleSelectField", () => {
  it("debe renderizar la etiqueta y el selector con el valor por defecto", () => {
    // Arrange
    render(<TestHarness />);

    // Assert
    expect(
      screen.getByLabelText("[i18n] WorkspaceSwitcher.invite_form.role_label")
    ).toBeInTheDocument();
    expect(
      screen.getByText("[i18n] WorkspaceSwitcher.invite_form.role_member")
    ).toBeInTheDocument();
  });

  it("debe mostrar un mensaje de error cuando se proporciona", () => {
    // Arrange
    const errors = { role: { message: "role_required" } }; // Clave de error genérica para la prueba
    render(<TestHarness errors={errors} />);

    // Assert
    expect(
      screen.getByText("[i18n] ValidationErrors.role_required")
    ).toBeInTheDocument();
  });

  it("debe deshabilitar el selector cuando isPending es true", () => {
    // Arrange
    render(<TestHarness isPending={true} />);

    // Assert
    // El 'combobox' es el rol del trigger del Select
    expect(screen.getByRole("combobox")).toBeDisabled();
  });
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Prueba de `Controller`**: ((Implementada)) El arnés de pruebas utiliza un `TestHarness` que instancia `useForm` para proporcionar el `control` necesario al componente, validando su integración con `react-hook-form`.
 *
 * =====================================================================
 */
// tests/unit/components/workspaces/form-fields/RoleSelectField.test.tsx
