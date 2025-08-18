// tests/unit/lib/actions/onboarding.actions.test.ts
/**
 * @file tests/unit/lib/actions/onboarding.actions.test.ts
 * @description Arnés de pruebas unitarias de élite para el aparato `onboarding.actions.ts`.
 *              Ha sido corregido para alinear la simulación (mock) con el
 *              comportamiento de encadenamiento de métodos de la API de Supabase,
 *              resolviendo una regresión crítica en la infraestructura de pruebas.
 * @author L.I.A. Legacy
 * @version 2.1.0
 */
import { revalidatePath } from "next/cache";
import {
  createMockSupabaseClient,
  createMockUser,
  type MockSupabaseClient,
} from "tests/utils/factories";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createAuditLog } from "@/lib/actions/_helpers";
import { completeOnboardingAction } from "@/lib/actions/onboarding.actions";
import { createClient } from "@/lib/supabase/server";
import { type User } from "@supabase/supabase-js";

// --- Mocks de Dependencias de Alto Nivel ---
vi.mock("@/lib/supabase/server");
vi.mock("@/lib/actions/_helpers");
vi.mock("next/cache");
vi.mock("@/lib/logging");

describe("Arnés de Pruebas de Élite: onboarding.actions.ts", () => {
  let supabaseMocks: MockSupabaseClient["mocks"];
  const MOCK_USER: User = createMockUser();

  beforeEach(() => {
    const { supabase, mocks } = createMockSupabaseClient();
    supabaseMocks = mocks;
    vi.mocked(createClient).mockReturnValue(supabase as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // --- Grupo 1: Seguridad y Autorización ---
  describe("Grupo 1: Seguridad y Autorización", () => {
    it("1.1: Dado un usuario sin sesión, Cuando se invoca la acción, Entonces debe devolver un error de no autenticado y no realizar acciones secundarias", async () => {
      // Arrange
      supabaseMocks.mockGetUser.mockResolvedValue({ data: { user: null } });

      // Act
      const result = await completeOnboardingAction();

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("error_unauthenticated");
      }
      expect(supabaseMocks.mockFrom).not.toHaveBeenCalled();
      expect(createAuditLog).not.toHaveBeenCalled();
      expect(revalidatePath).not.toHaveBeenCalled();
    });
  });

  // --- Grupo 2: Camino Feliz (Operación Exitosa) ---
  describe("Grupo 2: Camino Feliz (Operación Exitosa)", () => {
    beforeEach(() => {
      supabaseMocks.mockGetUser.mockResolvedValue({
        data: { user: MOCK_USER },
      });
      // --- INICIO DE CORRECCIÓN CRÍTICA ---
      // Se mockea el método final de la cadena (.eq) para que devuelva la promesa
      // resuelta, en lugar de mockear .update y romper la cadena.
      supabaseMocks.mockEq.mockResolvedValue({ error: null });
      // --- FIN DE CORRECCIÓN CRÍTICA ---
    });

    it("2.1: Dado un usuario autenticado y una DB exitosa, Entonces debe devolver { success: true }", async () => {
      const result = await completeOnboardingAction();
      expect(result.success).toBe(true);
    });

    it("2.2: Debe invocar la actualización en la tabla 'profiles' con el payload y filtro correctos", async () => {
      await completeOnboardingAction();
      expect(supabaseMocks.mockFrom).toHaveBeenCalledWith("profiles");
      expect(supabaseMocks.mockUpdate).toHaveBeenCalledWith({
        has_completed_onboarding: true,
      });
      expect(supabaseMocks.mockEq).toHaveBeenCalledWith("id", MOCK_USER.id);
    });

    it("2.3: Debe registrar un log de auditoría con la acción 'onboarding.completed'", async () => {
      await completeOnboardingAction();
      expect(createAuditLog).toHaveBeenCalledTimes(1);
      expect(createAuditLog).toHaveBeenCalledWith("onboarding.completed", {
        userId: MOCK_USER.id,
      });
    });

    it("2.4: Debe revalidar la caché del layout del dashboard", async () => {
      await completeOnboardingAction();
      expect(revalidatePath).toHaveBeenCalledTimes(1);
      expect(revalidatePath).toHaveBeenCalledWith("/dashboard", "layout");
    });
  });

  // --- Grupo 3: Manejo de Errores de Base de Datos ---
  describe("Grupo 3: Manejo de Errores de Base de Datos", () => {
    const dbError = { message: "Error de conexión a la base de datos" };

    beforeEach(() => {
      supabaseMocks.mockGetUser.mockResolvedValue({
        data: { user: MOCK_USER },
      });
      // --- INICIO DE CORRECCIÓN CRÍTICA ---
      supabaseMocks.mockEq.mockResolvedValue({ error: dbError });
      // --- FIN DE CORRECCIÓN CRÍTICA ---
    });

    it("3.1: Dado un fallo en la DB, Entonces debe devolver un error de 'update_failed'", async () => {
      const result = await completeOnboardingAction();
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("error_update_failed");
      }
    });

    it("3.2: Dado un fallo en la DB, Entonces NO debe invocar createAuditLog ni revalidatePath", async () => {
      await completeOnboardingAction();
      expect(createAuditLog).not.toHaveBeenCalled();
      expect(revalidatePath).not.toHaveBeenCalled();
    });
  });
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Regresión Crítica**: ((Implementada)) Se ha corregido la lógica de simulación para respetar la interfaz fluida del cliente Supabase, mockeando el método final de la cadena (`.eq()`) en lugar de uno intermedio. Esto resuelve la cascada de `TypeError` y restaura la integridad del arnés de pruebas.
 * 2. **Legibilidad Mejorada (BDD)**: ((Implementada)) Se ha mantenido y mejorado el formato "Dado-Cuando-Entonces" en los títulos de las pruebas para una máxima claridad.
 *
 * @subsection Melhorias Futuras
 * 1. **Pruebas de Mutación**: ((Vigente)) Utilizar una herramienta como Stryker para introducir mutaciones en el código fuente de la acción y verificar que las pruebas fallen, asegurando la robustez de las aserciones.
 *
 * =====================================================================
 */
// tests/unit/lib/actions/onboarding.actions.test.ts
