// tests/unit/components/authentication/AuthenticationForm.test.tsx
/**
 * @file AuthenticationForm.test.tsx
 * @description Arnés de pruebas unitarias para el componente atómico AuthenticationForm.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { AuthenticationForm } from "@/components/authentication/authentication-form";
import { render, screen } from "@tests/utils/render";
import supabaseAuthUiMessages from "@/messages/components/auth/SupabaseAuthUI.json";

const tSupabase = supabaseAuthUiMessages["es-ES"];
const mockMessages = { SupabaseAuthUI: tSupabase };

describe("Componente Atómico de UI: AuthenticationForm", () => {
  it("debe renderizar los campos de email y contraseña", () => {
    render(
      <AuthenticationForm
        email=""
        password=""
        onEmailChange={() => {}}
        onPasswordChange={() => {}}
      />,
      { messages: mockMessages }
    );

    expect(screen.getByLabelText(tSupabase.email_label)).toBeInTheDocument();
    expect(screen.getByLabelText(tSupabase.password_label)).toBeInTheDocument();
  });

  it("debe invocar onEmailChange cuando el usuario escribe en el campo de email", async () => {
    const user = userEvent.setup();
    const onEmailChange = vi.fn();
    render(
      <AuthenticationForm
        email=""
        password=""
        onEmailChange={onEmailChange}
        onPasswordChange={() => {}}
      />,
      { messages: mockMessages }
    );

    const emailInput = screen.getByLabelText(tSupabase.email_label);
    await user.type(emailInput, "test@example.com");

    expect(onEmailChange).toHaveBeenCalled();
    expect(onEmailChange).toHaveBeenCalledWith("test@example.com");
  });

  it("debe invocar onPasswordChange cuando el usuario escribe en el campo de contraseña", async () => {
    const user = userEvent.setup();
    const onPasswordChange = vi.fn();
    render(
      <AuthenticationForm
        email=""
        password=""
        onEmailChange={() => {}}
        onPasswordChange={onPasswordChange}
      />,
      { messages: mockMessages }
    );

    const passwordInput = screen.getByLabelText(tSupabase.password_label);
    await user.type(passwordInput, "password123");

    expect(onPasswordChange).toHaveBeenCalled();
    expect(onPasswordChange).toHaveBeenCalledWith("password123");
  });
});
