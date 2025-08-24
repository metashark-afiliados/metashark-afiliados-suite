// tests/integration/components/landing/NewsletterForm.test.tsx
/**
 * @file NewsletterForm.test.tsx
 * @description Arnés de pruebas de integración de élite para el `NewsletterForm`.
 *              Valida todos los flujos de interacción del usuario, incluyendo el
 *              feedback visual (toasts) para escenarios de éxito y error.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import toast from "react-hot-toast";

import { NewsletterForm } from "@/components/landing/NewsletterForm";
import { subscribeToNewsletterAction } from "@/lib/actions/newsletter.actions";
import { render, screen, waitFor } from "@tests/utils/render";

// Cargar mensajes para el componente y los toasts
import newsletterMessages from "@/messages/components/landing/Newsletter.json";
const t = newsletterMessages["es-ES"];
const mockMessages = { Newsletter: t };

// Mockear la Server Action
vi.mock("@/lib/actions/newsletter.actions", () => ({
  subscribeToNewsletterAction: vi.fn(),
}));
const mockedSubscribeAction = vi.mocked(subscribeToNewsletterAction);

describe("Prueba de Integración: NewsletterForm", () => {
  const mockProps = {
    ctaText: "Suscribirse",
    placeholderText: "Tu email...",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debe enviar el formulario con el email correcto y mostrar un toast de éxito", async () => {
    const user = userEvent.setup();
    mockedSubscribeAction.mockResolvedValue({
      success: true,
      data: { messageKey: "Newsletter.success_new" },
    });

    render(<NewsletterForm {...mockProps} />, { messages: mockMessages });

    const emailInput = screen.getByPlaceholderText(mockProps.placeholderText);
    const submitButton = screen.getByRole("button", {
      name: mockProps.ctaText,
    });

    await user.type(emailInput, "nuevo.usuario@example.com");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockedSubscribeAction).toHaveBeenCalledTimes(1);
      const formData = mockedSubscribeAction.mock.calls[0][1];
      expect(formData.get("email")).toBe("nuevo.usuario@example.com");
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(t.success_new);
      expect(emailInput).toHaveValue(""); // El formulario debe resetearse
    });
  });

  it("debe mostrar un toast de error si la Server Action devuelve un error", async () => {
    const user = userEvent.setup();
    mockedSubscribeAction.mockResolvedValue({
      success: false,
      error: "Newsletter.error_server",
    });

    render(<NewsletterForm {...mockProps} />, { messages: mockMessages });

    const emailInput = screen.getByPlaceholderText(mockProps.placeholderText);
    const submitButton = screen.getByRole("button", {
      name: mockProps.ctaText,
    });

    await user.type(emailInput, "test.error@example.com");
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(t.error_server);
    });
  });

  it("debe mostrar un toast de éxito diferente para suscripciones duplicadas", async () => {
    const user = userEvent.setup();
    mockedSubscribeAction.mockResolvedValue({
      success: true,
      data: { messageKey: "Newsletter.success_duplicate" },
    });

    render(<NewsletterForm {...mockProps} />, { messages: mockMessages });

    const emailInput = screen.getByPlaceholderText(mockProps.placeholderText);
    const submitButton = screen.getByRole("button", {
      name: mockProps.ctaText,
    });

    await user.type(emailInput, "existente@example.com");
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(t.success_duplicate);
    });
  });
});
