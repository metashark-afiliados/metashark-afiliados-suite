// tests/mocks/factories/supabase/query-builder.mock.ts
/**
 * @file tests/mocks/factories/supabase/query-builder.mock.ts
 * @description Aparato "obrero" atómico para simular el constructor de consultas de Supabase.
 *              Esta factoría genera un objeto que replica el comportamiento de encadenamiento
 *              de métodos (`select`, `insert`, `eq`, etc.) y opera sobre una copia aislada
 *              del estado de la base de datos de prueba.
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

/**
 * @public
 * @function createMockQueryBuilder
 * @description Crea un simulador de constructor de consultas para una tabla específica.
 * @param tableName El nombre de la tabla sobre la que operar.
 * @param dbClone Una copia del estado de la base de datos para esta instancia de prueba.
 * @param spies Un objeto que contiene los espías de Vitest para rastrear las llamadas.
 * @returns Un objeto que simula el constructor de consultas de Supabase.
 */
export const createMockQueryBuilder = (
  tableName: keyof any,
  dbClone: any,
  spies: SpiedQueryBuilderMocks
) => {
  let queryChain: any[] = [...dbClone[tableName]];
  const builder = {
    select: spies.mockSelect.mockReturnThis(),
    insert: spies.mockInsert.mockImplementation((rows: any | any[]) => {
      const rowsArray = Array.isArray(rows) ? rows : [rows];
      dbClone[tableName].push(...rowsArray);
      return Promise.resolve({ data: rowsArray, error: null });
    }),
    update: spies.mockUpdate.mockImplementation((newData: any) => {
      const idsToUpdate = new Set(queryChain.map((q) => q.id));
      dbClone[tableName] = dbClone[tableName].map((row: any) =>
        idsToUpdate.has(row.id) ? { ...row, ...newData } : row
      );
      return Promise.resolve({ data: null, error: null });
    }),
    delete: spies.mockDelete.mockImplementation(() => {
      const idsToDelete = new Set(queryChain.map((q) => q.id));
      dbClone[tableName] = dbClone[tableName].filter(
        (row: any) => !idsToDelete.has(row.id)
      );
      return Promise.resolve({ data: null, error: null });
    }),
    eq: spies.mockEq.mockImplementation((column: string, value: any) => {
      queryChain = queryChain.filter((row) => row[column] === value);
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
 * 1. **Hiper-Atomicidad**: ((Implementada)) Este aparato aísla la lógica más compleja del mock de Supabase, cumpliendo con el SRP al más alto nivel.
 * =====================================================================
 */
// tests/mocks/factories/supabase/query-builder.mock.ts
