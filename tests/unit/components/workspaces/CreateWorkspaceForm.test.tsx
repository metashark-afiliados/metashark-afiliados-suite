// tests/unit/components/workspaces/CreateWorkspaceForm.test.tsx
/**
 * @file tests/unit/components/workspaces/CreateWorkspaceForm.test.tsx
 * @description Suite de pruebas de élite v11.0. Sincronizada con la utilidad
 *              de renderizado de alta fidelidad, cargando explícitamente los
 *              namespaces de i18n requeridos para una validación robusta.
 * @author Raz Podestá
 * @version 11.0.0
 */
import { screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import toast from "react-hot-toast";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CreateWorkspaceForm } from "@/components/workspaces/CreateWorkspaceForm";
import { workspaces as workspaceActions } from "@/lib/actions";
import { render } from "@tests/utils/render";

vi.mock("@/lib/actions");
vi.mock("react-hot-toast");

const mockOnSuccess = vi.fn();

describe("Arnés de Pruebas de Élite: CreateWorkspaceForm", () => {
  beforeEach(() => {
    vi.mocked(workspaceActions.createWorkspaceAction).mockResolvedValue({
      success: true,
      data: { id: "ws-12345" },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    mockOnSuccess.mockClear();
  });

  // --- INICIO DE CORRECCIÓN CRÍTICA ---
  // Se crea una función helper que invoca a `render` con los namespaces
  // requeridos por el componente y sus dependencias.
  const renderComponent = () =>
    render(<CreateWorkspaceForm onSuccess={mockOnSuccess} />, {
      namespaces: [
        "WorkspaceSwitcher", // Usado por CreateWorkspaceForm
        "ValidationErrors", // Usado por los schemas de Zod
      ],
      locale: "es-ES", // Especificar locale para consistencia
    });
  // --- FIN DE CORRECCIÓN CRÍTICA ---

  describe("Grupo 1: Renderizado y Contrato Inicial", () => {
    it("1.1: Debe renderizar los campos, labels y botones correctamente con texto real", async () => {
      await renderComponent();
      expect(screen.getByLabelText("Nombre del Workspace")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Ej: Mi Nuevo Proyecto")
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Crear Workspace" })
      ).toBeInTheDocument();
    });
  });

  describe("Grupo 2: Validación de Contrato (Zod + i18n de alta fidelidad)", () => {
    it("2.1: Debe mostrar el mensaje de error real si el nombre está vacío", async () => {
      await renderComponent();
      await userEvent.click(
        screen.getByRole("button", { name: "Crear Workspace" })
      );
      expect(await screen.findByText("El nombre es requerido.")).toBeVisible();
    });

    it("2.2: Debe mostrar el mensaje de error real si el nombre es demasiado corto", async () => {
      await renderComponent();
      await userEvent.type(screen.getByLabelText("Nombre del Workspace"), "ab");
      await userEvent.click(
        screen.getByRole("button", { name: "Crear Workspace" })
      );
      expect(
        await screen.findByText("El nombre debe tener al menos 3 caracteres.")
      ).toBeVisible();
    });
  });

  describe("Grupo 3: Flujo de Envío y API", () => {
    it("3.1: Debe llamar a onSuccess y mostrar el toast de éxito con texto real", async () => {
      await renderComponent();
      await userEvent.type(
        screen.getByLabelText("Nombre del Workspace"),
        "Proyecto de Éxito"
      );
      await userEvent.click(
        screen.getByRole("button", { name: "Crear Workspace" })
      );
      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalledTimes(1);
        expect(toast.success).toHaveBeenCalledWith(
          "¡Workspace creado con éxito!"
        );
      });
    });

    it("3.2: Debe mostrar el estado de carga en el botón durante el envío", async () => {
      await renderComponent();
      await userEvent.type(
        screen.getByLabelText("Nombre del Workspace"),
        "Proyecto Lento"
      );
      await userEvent.click(
        screen.getByRole("button", { name: "Crear Workspace" })
      );
      expect(
        await screen.findByRole("button", { name: /Creando.../i })
      ).toBeDisabled();
    });
  });
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Contrato de Pruebas**: ((Implementada)) Se ha creado el helper `renderComponent` que pasa explícitamente los `namespaces` requeridos a la utilidad `render`. Esto resuelve la cascada de fallos y alinea el arnés con la infraestructura de pruebas de alta fidelidad.
 *
 * @subsection Melhorias Futuras
 * 1. **Pruebas de Regresión Visual**: ((Vigente)) Integrar Storybook o Ladle con un addon de snapshot visual para capturar y comparar imágenes del componente en todos sus estados y variaciones de texto.
 *
 * =====================================================================
 */
// tests/unit/components/workspaces/CreateWorkspaceForm.test.tsx
