// tests/integration/app/[locale]/login/actions.test.ts
/**
 * @file actions.test.ts
 * @description Arnés de pruebas de integración para las Server Actions de login.
 *              Valida la lógica de negocio, la interacción con Supabase y las
 *              redirecciones para el flujo de inicio de sesión. Ha sido refactorizado
 *              para consumir la Única Fuente de Verdad (SSoT) de las acciones
 *              desde `@/lib/actions/auth.actions`.
 * @author L.I.A. Legacy
 * @version 2.0.0
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { redirect } from "next/navigation";
import { type Provider } from "@supabase/supabase-js";

import {
  signInWithEmailAction,
  signInWithOAuthAction,
} from "@/lib/actions/auth.actions";
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
    signInWithPassword: vi.fn(),
    signInWithOAuth: vi.fn(),
  },
};

describe("Server Actions de Integración: Flujo de Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // @ts-ignore - Se utiliza un mock parcial para simplicidad de la prueba.
    mockedCreateClient.mockReturnValue(mockSupabase);
  });

  describe("signInWithEmailAction", () => {
    it("debe llamar a signInWithPassword y redirigir en caso de éxito", async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({ error: null });

      const formData = new FormData();
      formData.append("email", "test@example.com");
      formData.append("password", "password123");

      await signInWithEmailAction(null, formData);

      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
      // La acción ahora redirige directamente.
      expect(mockedRedirect).toHaveBeenCalledWith("/dashboard");
    });

    it("debe devolver un error si las credenciales son inválidas", async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        error: new Error("Invalid login credentials"),
      });

      const formData = new FormData();
      formData.append("email", "wrong@example.com");
      formData.append("password", "wrong");

      const result = await signInWithEmailAction(null, formData);

      expect(result).toEqual({
        success: false,
        error: "LoginPage.error_invalid_credentials",
      });
      expect(mockedRedirect).not.toHaveBeenCalled();
    });
  });

  describe("signInWithOAuthAction", () => {
    it("debe llamar a signInWithOAuth y redirigir a la URL del proveedor", async () => {
      const providerUrl = "https://provider.com/oauth/authorize";
      mockSupabase.auth.signInWithOAuth.mockResolvedValue({
        data: { url: providerUrl },
        error: null,
      });

      const formData = new FormData();
      formData.append("provider", "google");

      await signInWithOAuthAction(formData);

      expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: "google",
        options: {
          redirectTo: `http://localhost:3000/api/auth/callback`,
        },
      });
      expect(mockedRedirect).toHaveBeenCalledWith(providerUrl);
    });

    it("debe redirigir a la página de login con un error si OAuth falla", async () => {
      mockSupabase.auth.signInWithOAuth.mockResolvedValue({
        data: { url: null },
        error: new Error("OAuth provider error"),
      });

      const formData = new FormData();
      formData.append("provider", "google");

      await signInWithOAuthAction(formData);

      const expectedUrl =
        "http://localhost:3000/login?error=true&message=LoginPage.error_oauth_failed";
      expect(mockedRedirect).toHaveBeenCalledWith(expectedUrl);
    });
  });
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización Arquitectónica**: ((Implementada)) Corregida la importación para apuntar a la SSoT de acciones en `@/lib/actions/auth.actions`, resolviendo el error `TS2307`.
 * 2. **Alineación de Nomenclatura**: ((Implementada)) Actualizadas las llamadas a las funciones renombradas (`signInWithEmailAction`, `signInWithOAuthAction`).
 *
 * @subsection Melhorias Futuras
 * 1. **Factoría de `FormData`**: ((Vigente)) Crear una función helper `createLoginForm(data)` para generar el objeto `FormData`, reduciendo la duplicación de código en las pruebas.
 * 2. **Pruebas Parametrizadas**: ((Vigente)) Utilizar `it.each` de Vitest para probar múltiples proveedores de OAuth con una única estructura de prueba.
 *
 * =====================================================================
 */
// tests/integration/app/[locale]/login/actions.test.ts
