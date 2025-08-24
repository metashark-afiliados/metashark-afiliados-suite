// tests/integration/app/locale-specific/page.test.tsx
/**
 * @file page.test.tsx
 * @description Arnés de pruebas de integración de élite para la Landing Page (`HomePage`).
 *              Validado contra la nueva infraestructura de mocks de next-intl/server.
 * @author L.I.A. Legacy
 * @version 1.0.2
 */
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import toast from "react-hot-toast";

import HomePage from "@/app/[locale]/page";
import { subscribeToNewsletterAction } from "@/lib/actions/newsletter.actions";
import { render, screen, waitFor } from "@tests/utils/render";
import { redirectSpy } from "@tests/mocks/navigation.mock";

vi.mock("@/lib/actions/newsletter.actions", () => ({
  subscribeToNewsletterAction: vi.fn(),
}));
const mockedSubscribeAction = vi.mocked(subscribeToNewsletterAction);

vi.mock("@/lib/logging", () => ({
  logger: {
    trace: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe("Prueba de Integración: Landing Page (HomePage)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debe renderizar todas las secciones principales con su contenido", async () => {
    const PageComponent = await HomePage({ params: { locale: "es-ES" } });
    render(PageComponent);

    expect(
      screen.getByRole("heading", {
        name: /Crea Campañas de Afiliados de Alto Rendimiento con IA/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /Una Suite de Herramientas, Potencial Ilimitado/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Preguntas Frecuentes/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /¿Listo para Disparar tus Conversiones?/i,
      })
    ).toBeInTheDocument();
  });

  it("debe permitir al usuario suscribirse a la newsletter y mostrar un toast de éxito", async () => {
    const user = userEvent.setup();
    mockedSubscribeAction.mockResolvedValue({
      success: true,
      data: { messageKey: "Newsletter.success_new" },
    });

    const PageComponent = await HomePage({ params: { locale: "es-ES" } });
    render(PageComponent);

    const emailInputs = screen.getAllByPlaceholderText(
      /introduce tu email|introduce tu correo/i
    );
    const emailInput = emailInputs[1];
    const submitButton = screen.getAllByRole("button", {
      name: /Suscribirse|Empezar Gratis/i,
    })[1];

    await user.type(emailInput, "test.subscriber@example.com");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockedSubscribeAction).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "¡Gracias por suscribirte! Mantente atento a las novedades."
      );
    });
  });

  it("debe redirigir al dashboard si ya existe una sesión activa", async () => {
    await HomePage({ params: { locale: "es-ES" } });

    await waitFor(() => {
      expect(redirectSpy).toHaveBeenCalledWith("/dashboard");
    });
  });
});
