// tests/mocks/vi/supabase/auth.mock.ts
/**
 * @file tests/mocks/vi/supabase/auth.mock.ts
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
// tests/mocks/vi/supabase/auth.mock.ts
