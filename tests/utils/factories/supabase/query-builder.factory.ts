// tests/utils/factories/supabase/query-builder.factory.ts
/**
 * @file tests/utils/factories/supabase/query-builder.factory.ts
 * @description Aparato "obrero" atómico para simular el constructor de consultas de Supabase.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { vi } from "vitest";

export type SpiedQueryBuilderMocks = {
  mockSelect: ReturnType<typeof vi.fn>;
  mockInsert: ReturnType<typeof vi.fn>;
  mockUpdate: ReturnType<typeof vi.fn>;
  mockDelete: ReturnType<typeof vi.fn>;
  mockEq: ReturnType<typeof vi.fn>;
  mockSingle: ReturnType<typeof vi.fn>;
};

export const createMockQueryBuilder = (
  tableName: keyof any,
  dbClone: any,
  spies: SpiedQueryBuilderMocks
) => {
  let queryChain: any[] = [...dbClone[tableName]];
  const builder = {
    select: spies.mockSelect.mockReturnThis(),
    insert: spies.mockInsert.mockImplementation((rows: any) => {
      dbClone[tableName].push(...(Array.isArray(rows) ? rows : [rows]));
      return Promise.resolve({
        data: Array.isArray(rows) ? rows : [rows],
        error: null,
      });
    }),
    update: spies.mockUpdate.mockImplementation((newData: any) => {
      const ids = new Set(queryChain.map((q) => q.id));
      dbClone[tableName] = dbClone[tableName].map((r: any) =>
        ids.has(r.id) ? { ...r, ...newData } : r
      );
      return Promise.resolve({ data: null, error: null });
    }),
    delete: spies.mockDelete.mockImplementation(() => {
      const ids = new Set(queryChain.map((q) => q.id));
      dbClone[tableName] = dbClone[tableName].filter(
        (r: any) => !ids.has(r.id)
      );
      return Promise.resolve({ data: null, error: null });
    }),
    eq: spies.mockEq.mockImplementation((col: string, val: any) => {
      queryChain = queryChain.filter((r) => r[col] === val);
      return builder;
    }),
    single: spies.mockSingle.mockImplementation(() =>
      Promise.resolve({ data: queryChain[0] || null, error: null })
    ),
  };
  return builder;
};
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Hiper-Atomicidad**: ((Implementada)) Aísla la lógica más compleja del mock.
 * =====================================================================
 */
// tests/utils/factories/supabase/query-builder.factory.ts
