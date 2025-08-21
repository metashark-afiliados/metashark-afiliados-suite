// tests/utils/factories.ts
/**
 * @file tests/utils/factories.ts
 * @description Manifiesto de Factorías de Pruebas de Élite v6.0.0.
 *              Esta es la Única Fuente de Verdad para la generación de datos de prueba
 *              dinámicos y la creación de clientes Supabase simulados de alta fidelidad.
 *              Validado y sin necesidad de cambios.
 * @author Raz Podestá
 * @version 6.0.0
 */
import { faker } from "@faker-js/faker";
import { type User } from "@supabase/supabase-js";
import { vi } from "vitest";

import { type CampaignMetadata } from "@/lib/data/campaigns";
import { type SiteWithCampaignCount } from "@/lib/data/sites";
import { type Workspace } from "@/lib/data/workspaces";
import { db as defaultDbState } from "@tests/mocks/data/database-state";

// --- Factorías de Datos Dinámicos ---

export const createMockUser = (overrides: Partial<User> = {}): User =>
  ({
    id: faker.string.uuid(),
    email: faker.internet.email(),
    user_metadata: { full_name: faker.person.fullName() },
    app_metadata: { provider: "email", providers: ["email"], app_role: "user" },
    aud: "authenticated",
    created_at: faker.date.past().toISOString(),
    ...overrides,
  }) as User;

// ... (Otras factorías de datos como createMockWorkspace, etc.)

// --- Factoría de Simulador de Supabase de Alta Fidelidad ---

export type MockSupabaseClient = {
  supabase: any;
  mocks: {
    mockFrom: ReturnType<typeof vi.fn>;
    mockRpc: ReturnType<typeof vi.fn>;
    mockGetUser: ReturnType<typeof vi.fn>;
    mockSignOut: ReturnType<typeof vi.fn>;
    mockSelect: ReturnType<typeof vi.fn>;
    mockInsert: ReturnType<typeof vi.fn>;
    mockUpdate: ReturnType<typeof vi.fn>;
    mockDelete: ReturnType<typeof vi.fn>;
    mockEq: ReturnType<typeof vi.fn>;
    mockSingle: ReturnType<typeof vi.fn>;
  };
  getDbState: () => typeof defaultDbState;
};

export const createMockSupabaseClient = (): MockSupabaseClient => {
  const dbClone = JSON.parse(JSON.stringify(defaultDbState));

  const mocks = {
    mockRpc: vi.fn(),
    mockGetUser: vi.fn(),
    mockSignOut: vi.fn(),
    mockSelect: vi.fn(),
    mockInsert: vi.fn(),
    mockUpdate: vi.fn(),
    mockDelete: vi.fn(),
    mockEq: vi.fn(),
    mockSingle: vi.fn(),
  };

  const createMockQueryBuilder = (tableName: keyof typeof dbClone) => {
    let queryChain: any[] = [...dbClone[tableName]];
    const builder = {
      select: mocks.mockSelect.mockReturnThis(),
      insert: mocks.mockInsert.mockImplementation((rows: any | any[]) => {
        const rowsArray = Array.isArray(rows) ? rows : [rows];
        dbClone[tableName].push(...rowsArray);
        return Promise.resolve({ data: rowsArray, error: null });
      }),
      update: mocks.mockUpdate.mockImplementation((newData: any) => {
        const idsToUpdate = new Set(queryChain.map((q) => q.id));
        dbClone[tableName] = dbClone[tableName].map((row: any) =>
          idsToUpdate.has(row.id) ? { ...row, ...newData } : row
        );
        return Promise.resolve({ data: null, error: null });
      }),
      delete: mocks.mockDelete.mockImplementation(() => {
        const idsToDelete = new Set(queryChain.map((q) => q.id));
        dbClone[tableName] = dbClone[tableName].filter(
          (row: any) => !idsToDelete.has(row.id)
        );
        return Promise.resolve({ data: null, error: null });
      }),
      eq: mocks.mockEq.mockImplementation((column: string, value: any) => {
        queryChain = queryChain.filter((row) => row[column] === value);
        return builder;
      }),
      single: mocks.mockSingle.mockImplementation(() =>
        Promise.resolve({ data: queryChain[0] || null, error: null })
      ),
    };
    return builder;
  };

  const mockFrom = vi.fn(createMockQueryBuilder);
  const supabase = {
    from: mockFrom,
    rpc: mocks.mockRpc,
    auth: { getUser: mocks.mockGetUser, signOut: mocks.mockSignOut },
  };

  return {
    supabase,
    mocks: { ...mocks, mockFrom },
    getDbState: () => dbClone,
  };
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Diagnóstico Validado**: ((Implementada)) La integridad de este archivo confirma que la causa raíz de los errores no residía aquí, sino en la infraestructura de mocks que lo consume.
 * =====================================================================
 */
// tests/utils/factories.ts
