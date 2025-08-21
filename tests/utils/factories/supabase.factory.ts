// tests/utils/factories/supabase.factory.ts
/**
 * @file tests/utils/factories/supabase.factory.ts
 * @description Factoría y ensamblador principal para crear un cliente Supabase
 *              simulado de alta fidelidad. Compone los mocks atómicos de
 *              query builder y auth.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { vi } from "vitest";

import * as DUMMY_DATA from "@tests/mocks/data/database-state";
import { createAuthMock, type SpiedAuthMocks } from "./supabase/auth.factory";
import {
  createMockQueryBuilder,
  type SpiedQueryBuilderMocks,
} from "./supabase/query-builder.factory";

export type MockSupabaseClient = {
  supabase: any;
  mocks: SpiedQueryBuilderMocks &
    SpiedAuthMocks & {
      mockFrom: ReturnType<typeof vi.fn>;
      mockRpc: ReturnType<typeof vi.fn>;
    };
  getDbState: () => typeof DUMMY_DATA.db;
};

export const createMockSupabaseClient = (): MockSupabaseClient => {
  const dbClone = JSON.parse(JSON.stringify(DUMMY_DATA.db));

  const spies = {
    mockSelect: vi.fn(),
    mockInsert: vi.fn(),
    mockUpdate: vi.fn(),
    mockDelete: vi.fn(),
    mockEq: vi.fn(),
    mockSingle: vi.fn(),
    mockGetUser: vi.fn(),
    mockSignOut: vi.fn(),
    mockRpc: vi.fn(),
  };

  const mockFrom = vi.fn((tableName: keyof typeof dbClone) =>
    createMockQueryBuilder(tableName, dbClone, spies)
  );

  const supabase = {
    from: mockFrom,
    auth: createAuthMock(spies),
    rpc: spies.mockRpc.mockResolvedValue({ data: {}, error: null }),
  };

  return {
    supabase,
    mocks: { ...spies, mockFrom },
    getDbState: () => dbClone,
  };
};
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Arquitectura de Ensamblaje**: ((Implementada)) Este aparato ahora actúa como un ensamblador puro.
 * =====================================================================
 */
// tests/utils/factories/supabase.factory.ts
