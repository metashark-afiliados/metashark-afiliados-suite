// tests/integration/lib/data/permissions.test.ts
/**
 * @file permissions.test.ts
 * @description Arnés de pruebas de integración para el módulo de permisos.
 *              Valida la lógica de `hasWorkspacePermission` y su implementación
 *              de caché.
 * @author Raz Podestá
 * @version 1.0.0
 */
import {
  createMockSupabaseClient,
  type MockSupabaseClient,
} from "tests/utils/factories";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { hasWorkspacePermission } from "@/lib/data/permissions";
import { createClient } from "@/lib/supabase/server";

// --- Mocks ---
vi.mock("@/lib/supabase/server");
vi.mock("@/lib/logging", () => ({
  logger: {
    trace: vi.fn(),
    error: vi.fn(),
  },
}));

describe("Módulo de Permisos: hasWorkspacePermission", () => {
  let supabaseMocks: MockSupabaseClient["mocks"];

  beforeEach(() => {
    const { supabase, mocks } = createMockSupabaseClient();
    supabaseMocks = mocks;
    vi.mocked(createClient).mockReturnValue(supabase as any);
  });

  it("debe devolver true si el usuario tiene el rol requerido", async () => {
    supabaseMocks.mockSingle.mockResolvedValue({
      data: { role: "admin" },
      error: null,
    });
    const result = await hasWorkspacePermission("user-1", "ws-1", ["admin"]);
    expect(result).toBe(true);
  });

  it("debe devolver false si el usuario no tiene el rol requerido", async () => {
    supabaseMocks.mockSingle.mockResolvedValue({
      data: { role: "member" },
      error: null,
    });
    const result = await hasWorkspacePermission("user-1", "ws-1", ["owner"]);
    expect(result).toBe(false);
  });

  it("debe devolver false si el usuario no es miembro del workspace", async () => {
    supabaseMocks.mockSingle.mockResolvedValue({
      data: null,
      error: { code: "PGRST116", message: "Not Found" }, // Simula "no encontrado"
    });
    const result = await hasWorkspacePermission("user-1", "ws-1", ["member"]);
    expect(result).toBe(false);
  });

  // Nota: La validación del caché de React es compleja en un entorno de prueba
  // unitario/integración puro. La mejor manera de validarlo es a través de logs
  // y pruebas E2E que realicen múltiples acciones que dependan del mismo permiso.
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Arnés de Pruebas de Lógica de Seguridad**: ((Implementada)) Se ha creado una suite para validar la lógica de negocio central del sistema de permisos.
 *
 * @subsection Melhorias Futuras
 * 1. **Validación de Caché**: ((Vigente)) Explorar estrategias para validar el comportamiento del `React.cache` en pruebas, posiblemente mockeando `React.cache` mismo.
 *
 * =====================================================================
 */
// tests/integration/lib/data/permissions.test.ts
