// tests/mocks/vi/supabase.mock.ts
/**
 * @file tests/mocks/vi/supabase.mock.ts
 * @description SSoT y ensamblador principal para `vi.mock` de los clientes Supabase.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { type User } from "@supabase/supabase-js";
import { vi } from "vitest";

import * as DUMMY_DATA from "@tests/mocks/data/database-state";

export const setupSupabaseMock = (overrides: { user?: User | null } = {}) => {
  const user =
    overrides.user === undefined ? DUMMY_DATA.MOCKED_USER : overrides.user;
  const session = user ? { user } : null;
  const supabaseMock = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockResolvedValue({ data: [], error: null }),
    update: vi.fn().mockResolvedValue({ data: [], error: null }),
    delete: vi.fn().mockResolvedValue({ data: [], error: null }),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: {}, error: null }),
    rpc: vi.fn().mockResolvedValue({ data: {}, error: null }),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user } }),
      getSession: vi.fn().mockResolvedValue({ data: { session }, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
  };
  vi.mock("@/lib/supabase/server", () => ({
    createClient: () => supabaseMock,
    createAdminClient: () => supabaseMock,
  }));
  vi.mock("@/lib/supabase/client", () => ({
    createClient: () => supabaseMock,
  }));
};
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Simulación Unificada**: ((Implementada)) Proporciona un mock consistente para los clientes de servidor y cliente.
 *
 * =====================================================================
 */
// tests/mocks/vi/supabase.mock.ts
