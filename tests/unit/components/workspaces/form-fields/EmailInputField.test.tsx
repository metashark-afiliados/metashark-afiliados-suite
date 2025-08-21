// tests/unit/components/workspaces/form-fields/EmailInputField.test.tsx
import { describe, expect, it } from "vitest";
import { useForm } from "react-hook-form";

import { EmailInputField } from "@/components/workspaces/form-fields/EmailInputField";
import { render, screen } from "@tests/utils/render";

const TestHarness = ({ errors = {}, isPending = false }) => {
  const { register } = useForm();
  return (
    <EmailInputField
      register={register}
      errors={errors}
      isPending={isPending}
    />
  );
};

describe("Componente Atómico: EmailInputField", () => {
  it("debe renderizar la etiqueta y el input correctamente", () => {
    // Arrange
    render(<TestHarness />);

    // Assert
    expect(
      screen.getByLabelText("[i18n] WorkspaceSwitcher.invite_form.email_label")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        "[i18n] WorkspaceSwitcher.invite_form.email_placeholder"
      )
    ).toBeInTheDocument();
  });

  it("debe mostrar un mensaje de error cuando se proporciona", () => {
    // Arrange
    const errors = { email: { message: "invalid_email" } };
    render(<TestHarness errors={errors} />);

    // Assert
    expect(
      screen.getByText("[i18n] ValidationErrors.invalid_email")
    ).toBeInTheDocument();
  });

  it("debe deshabilitar el input cuando isPending es true", () => {
    // Arrange
    render(<TestHarness isPending={true} />);

    // Assert
    expect(
      screen.getByLabelText("[i18n] WorkspaceSwitcher.invite_form.email_label")
    ).toBeDisabled();
  });
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Arnés de Pruebas de Alta Fidelidad**: ((Implementada)) Se utiliza un `TestHarness` para instanciar `useForm` y proporcionar un entorno realista para el componente bajo prueba.
 *
 * =====================================================================
 */
// tests/unit/components/workspaces/form-fields/EmailInputField.test.tsx
