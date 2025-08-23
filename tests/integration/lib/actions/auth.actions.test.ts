// tests/integration/lib/actions/auth.actions.test.ts
/**
 * @file auth.actions.test.ts
 * @description Arnés de pruebas de integración para `signUpAction`.
 *              Utiliza un mock local para `next/headers` para simular
 *              el request scope de Next.js.
 * @author L.I.A. Legacy
 * @version 3.0.0
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { redirect } from "next/navigation";

import { signUpAction } from "@/lib/actions/auth.actions";

// --- INICIO DE CORRECCIÓN DE INFRAESTRUCTURA: Mock Local ---
vi.mock("next/headers", () => ({
  headers: vi.fn(() => {
    const headersMap = new Map();
    headersMap.set("origin", "http://localhost:3000");
    return headersMap;
  }),
}));
// --- FIN DE CORRECCIÓN DE INFRAESTRUCTURA ---

const mockSupabaseSignUp = vi.fn();
vi.mock("@/lib/supabase/server", () => ({
  createClient: () => ({
    auth: {
      signUp: mockSupabaseSignUp,
    },
  }),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));
const mockedRedirect = vi.mocked(redirect);

vi.mock("@/lib/actions/_helpers/error-log.helper", () => ({
  createPersistentErrorLog: vi.fn(),
}));

describe("Server Action de Integración: signUpAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createValidFormData = (): FormData => {
    const formData = new FormData();
    formData.append("email", "test@example.com");
    formData.append("password", "ValidPassword123!");
    formData.append("confirmPassword", "ValidPassword123!");
    formData.append("termsAccepted", "true");
    return formData;
  };

  it("debe llamar a supabase.auth.signUp y redirigir en un registro exitoso", async () => {
    mockSupabaseSignUp.mockResolvedValue({ error: null });
    const formData = createValidFormData();

    await signUpAction(null, formData);

    expect(mockSupabaseSignUp).toHaveBeenCalledWith({
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

  it("debe retornar un error si el usuario ya existe", async () => {
    mockSupabaseSignUp.mockResolvedValue({
      error: { message: "User already registered" },
    });
    const formData = createValidFormData();

    const result = await signUpAction(null, formData);

    expect(result).toEqual({
      success: false,
      error: "error_user_already_exists",
    });
  });

  it("debe retornar un error de validación si las contraseñas no coinciden", async () => {
    const formData = createValidFormData();
    formData.set("confirmPassword", "PasswordsDoNotMatch");

    const result = await signUpAction(null, formData);

    expect(result).toEqual({
      success: false,
      error: "passwords_do_not_match",
    });
  });
});
