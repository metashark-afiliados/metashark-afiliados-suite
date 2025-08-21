// tests/utils/factories/supabase/auth.factory.ts
/**
 * @file tests/utils/factories/supabase/auth.factory.ts
 * @description Factoría atómica para simular el cliente `auth` de Supabase.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { vi } from "vitest";
import * as DUMMY_DATA from "@tests/mocks/data/database-state";

export type SpiedAuthMocks = {
  mockGetUser: ReturnType<typeof vi.fn>;
  mockSignOut: ReturnType<typeof vi.fn>;
};

export const createAuthMock = (spies: SpiedAuthMocks) => ({
  getUser: spies.mockGetUser.mockResolvedValue({
    data: { user: DUMMY_DATA.MOCKED_USER },
  }),
  signOut: spies.mockSignOut.mockResolvedValue({ error: null }),
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad**: ((Implementada)) Aísla la simulación de la API de autenticación.
 * =====================================================================
 */
// tests/utils/factories/supabase/auth.factory.ts
