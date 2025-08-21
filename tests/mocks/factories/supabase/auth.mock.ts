// tests/mocks/factories/supabase/auth.mock.ts
/**
 * @file tests/mocks/factories/supabase/auth.mock.ts
 * @description Factoría atómica para simular el cliente `auth` de Supabase.
 *              Esta es la SSoT para el estado de autenticación en el entorno simulado.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { vi } from "vitest";

import { MOCKED_USER } from "@tests/mocks/data/database-state";

export type SpiedAuthMocks = {
  mockGetUser: ReturnType<typeof vi.fn>;
  mockSignOut: ReturnType<typeof vi.fn>;
};

/**
 * @public
 * @function createAuthMock
 * @description Crea un objeto que simula `supabase.auth`.
 * @param spies Los espías de Vitest para rastrear llamadas.
 * @returns Un objeto simulado de `supabase.auth`.
 */
export const createAuthMock = (spies: SpiedAuthMocks) => ({
  getUser: spies.mockGetUser.mockResolvedValue({
    data: { user: MOCKED_USER },
    error: null,
  }),
  signOut: spies.mockSignOut.mockResolvedValue({ error: null }),
  getSession: vi.fn().mockResolvedValue({
    data: { session: { user: MOCKED_USER } },
    error: null,
  }),
  // ...otros mocks de auth si son necesarios
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad (SRP)**: ((Implementada)) Aísla la simulación de la API de autenticación. La lógica es simple, predecible y fácil de mantener.
 *
 * @subsection Melhorias Futuras
 * 1. **Estado de Sesión Dinámico**: ((Vigente)) El mock podría ser mejorado para leer una cookie o un estado de KV para simular dinámicamente un usuario autenticado o no autenticado, en lugar de siempre devolver `MOCKED_USER`.
 *
 * =====================================================================
 */
