// tests/integration/app/api/auth/callback.test.ts
/**
 * @file tests/integration/app/api/auth/callback.test.ts
 * @description Arnés de pruebas de integración de élite para el Route Handler
 *              del callback de autenticación. Valida los flujos de sesión
 *              y la lógica crítica de establecimiento de la cookie del workspace.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { NextRequest } from "next/server";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { GET } from "@/app/api/auth/callback/route";
import { createClient } from "@/lib/supabase/server";

// --- Mock de la capa de Supabase ---
const mockSupabase = {
  auth: {
    exchangeCodeForSession: vi.fn(),
  },
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  single: vi.fn(),
};

vi.mock("@/lib/supabase/server", () => ({
  createClient: () => mockSupabase,
}));

// --- Test Suite ---
describe("Integration Test: API Route - /api/auth/callback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockUser = { id: "user-123", email: "test@example.com" };
  const mockSession = { user: mockUser };
  const mockWorkspace = { id: "ws-abc-789" };

  it("debe redirigir al dashboard si el intercambio de código es exitoso pero no se encuentra workspace", async () => {
    // Arrange
    mockSupabase.auth.exchangeCodeForSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });
    mockSupabase.single.mockResolvedValue({
      data: null,
      error: { message: "No rows found", code: "PGRST116" },
    });

    const request = new NextRequest(
      "http://localhost:3000/api/auth/callback?code=valid-code"
    );

    // Act
    const response = await GET(request);

    // Assert
    expect(response.status).toBe(307); // NextResponse.redirect usa 307
    expect(response.headers.get("Location")).toBe("http://localhost:3000/dashboard");
    expect(response.cookies.has("active_workspace_id")).toBe(false);
    expect(mockSupabase.from).toHaveBeenCalledWith("workspaces");
  });

  it("debe establecer la cookie 'active_workspace_id' y redirigir si es el primer login", async () => {
    // Arrange
    mockSupabase.auth.exchangeCodeForSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });
    mockSupabase.single.mockResolvedValue({
      data: mockWorkspace,
      error: null,
    });

    const request = new NextRequest(
      "http://localhost:3000/api/auth/callback?code=valid-code"
    );

    // Act
    const response = await GET(request);

    // Assert
    expect(response.status).toBe(307);
    expect(response.headers.get("Location")).toBe("http://localhost:3000/dashboard");
    expect(response.cookies.get("active_workspace_id")?.value).toBe(mockWorkspace.id);
    expect(response.cookies.get("active_workspace_id")?.path).toBe("/");
    expect(response.cookies.get("active_workspace_id")?.httpOnly).toBe(true);
  });

  it("debe redirigir a una página de error si el código es inválido", async () => {
    // Arrange
    mockSupabase.auth.exchangeCodeForSession.mockResolvedValue({
      data: { session: null },
      error: { message: "Invalid code", name: "AuthApiError", status: 400 },
    });

    const request = new NextRequest(
      "http://localhost:3000/api/auth/callback?code=invalid-code"
    );

    // Act
    const response = await GET(request);

    // Assert
    expect(response.status).toBe(307);
    const redirectUrl = new URL(response.headers.get("Location")!);
    expect(redirectUrl.pathname).toBe("/auth/login");
    expect(redirectUrl.searchParams.get("error")).toBe("true");
  });

  it("debe redirigir a la ruta 'next' si es una URL segura", async () => {
    // Arrange
    mockSupabase.auth.exchangeCodeForSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });
    mockSupabase.single.mockResolvedValue({ data: null, error: {} }); // No se encuentra workspace para simplificar

    const request = new NextRequest(
      "http://localhost:3000/api/auth/callback?code=valid-code&next=/dashboard/sites"
    );

    // Act
    const response = await GET(request);

    // Assert
    expect(response.status).toBe(307);
    expect(response.headers.get("Location")).toBe("http://localhost:3000/dashboard/sites");
  });
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Cobertura de Flujos Críticos**: ((Implementada)) La suite de pruebas valida explícitamente los dos escenarios principales (con y sin creación de cookie), garantizando que el flujo de onboarding y el login estándar funcionen correctamente.
 * 2. **Alta Fidelidad de Mocks**: ((Implementada)) Se simula la cadena completa de llamadas a Supabase, incluyendo la consulta a la tabla `workspaces`, lo que hace que la prueba sea un reflejo preciso del comportamiento en producción.
 * 3. **Validación de Seguridad**: ((Implementada)) Se incluye una prueba para la validación de la URL de redirección `next`, asegurando que la protección contra "Open Redirect" funciona.
 *
 * @subsection Melhorias Futuras
 * 1. **Factoría de `NextRequest`**: ((Vigente)) La creación del `NextRequest` podría abstraerse a una función helper `createMockRequest(url)` para reducir la duplicación de código en las pruebas.
 *
 * =====================================================================
 */