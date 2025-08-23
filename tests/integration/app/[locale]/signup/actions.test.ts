// tests/integration/app/[locale]/signup/actions.test.ts
/**
 * @file actions.test.ts
 * @description Arnés de pruebas de integración para la Server Action de signup.
 *              Valida la lógica de negocio, la interacción con Supabase y las
 *              redirecciones para el flujo de registro. Ha sido refactorizado
 *              para consumir la SSoT de acciones desde `@/lib/actions/auth.actions`.
 * @author L.I.A. Legacy
 * @version 2.0.0
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { redirect } from "next/navigation";

import { signUpAction } from "@/lib/actions/auth.actions";
import { createClient } from "@/lib/supabase/server";

// --- Mocks de Infraestructura ---
vi.mock("@/lib/supabase/server");
vi.mock("next/navigation");
vi.mock("next/headers", () => ({
  headers: () => ({
    get: (name: string) => {
      if (name === "origin") return "http://localhost:3000";
      return null;
    },
  }),
}));

const mockedRedirect = vi.mocked(redirect);
const mockedCreateClient = vi.mocked(createClient);

const mockSupabase = {
  auth: {
    signUp: vi.fn(),
  },
};

describe("Server Action de Integración: Flujo de Signup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // @ts-ignore - Se utiliza un mock parcial para simplicidad de la prueba.
    mockedCreateClient.mockReturnValue(mockSupabase);
  });

  const createValidFormData = (): FormData => {
    const formData = new FormData();
    formData.append("email", "test@example.com");
    formData.append("password", "ValidPassword123!");
    formData.append("confirmPassword", "ValidPassword123!");
    formData.append("termsAccepted", "true");
    formData.append("newsletterSubscribed", "false");
    return formData;
  };

  it("debe llamar a supabase.auth.signUp y redirigir en un registro exitoso", async () => {
    mockSupabase.auth.signUp.mockResolvedValue({ error: null });
    const formData = createValidFormData();

    // La acción ahora no devuelve nada en caso de éxito, solo redirige.
    await signUpAction(null, formData);

    expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "ValidPassword123!",
      options: {
        emailRedirectTo: "http://localhost:3000/api/auth/callback",
      },
    });
    expect(mockedRedirect).toHaveBeenCalledWith(
      "/auth-notice?message=check-email-for-confirmation"
    );
  });

  it("debe devolver un error si Supabase falla", async () => {
    mockSupabase.auth.signUp.mockResolvedValue({
      error: new Error("Supabase internal error"),
    });
    const formData = createValidFormData();

    const result = await signUpAction(null, formData);

    expect(result).toEqual({
      success: false,
      error: "ValidationErrors.error_signup_failed",
    });
    expect(mockedRedirect).not.toHaveBeenCalled();
  });

  it("debe devolver un error si el usuario ya existe", async () => {
    mockSupabase.auth.signUp.mockResolvedValue({
      error: { message: "User already registered" } as any,
    });
    const formData = createValidFormData();

    const result = await signUpAction(null, formData);

    expect(result).toEqual({
      success: false,
      error: "ValidationErrors.error_user_already_exists",
    });
    expect(mockedRedirect).not.toHaveBeenCalled();
  });
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización Arquitectónica**: ((Implementada)) Corregida la importación para apuntar a la SSoT de acciones en `@/lib/actions/auth.actions`, resolviendo el error `TS2307`.
 * 2. **Alineación de Lógica**: ((Implementada)) El arnés ahora valida correctamente los `ActionResult` devueltos por la `signUpAction` refactorizada, incluyendo las claves de i18n para los errores.
 *
 * @subsection Melhorias Futuras
 * 1. **Factoría de `FormData`**: ((Vigente)) La función `createValidFormData` puede ser movida a un archivo de utilidades de prueba compartido para ser reutilizada por otros arneses.
 * 2. **Pruebas de Validación Zod**: ((Vigente)) Añadir casos de prueba que envíen `FormData` inválido para verificar que la validación de Zod dentro de la acción funciona correctamente y devuelve los mensajes de error esperados.
 *
 * =====================================================================
 */
// tests/integration/app/[locale]/signup/actions.test.ts
