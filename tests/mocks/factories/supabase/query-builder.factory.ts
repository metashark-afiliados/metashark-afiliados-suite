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
import { getDbState, updateDbState, type MockDbState } from "../kv-persistence";

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
 * @param spies Un objeto que contiene los espías de Vitest para rastrear las llamadas.
 * @returns Un objeto que simula el constructor de consultas de Supabase.
 */
export const createMockQueryBuilder = (
  tableName: keyof MockDbState,
  spies: SpiedQueryBuilderMocks
) => {
  let filteredIds: Set<string | number> | null = null;

  const builder = {
    select: spies.mockSelect.mockReturnThis(),
    insert: spies.mockInsert.mockImplementation(async (rows: any | any[]) => {
      const db = await getDbState();
      const rowsArray = Array.isArray(rows) ? rows : [rows];
      const newRows = rowsArray.map((r) => ({
        ...r,
        id: r.id || `dev-${String(tableName)}-${Date.now()}`,
      }));
      (db as any)[tableName].push(...newRows);
      await updateDbState(db);
      return { data: newRows, error: null };
    }),
    update: spies.mockUpdate.mockImplementation(async (newData: any) => {
      const db = await getDbState();
      (db as any)[tableName] = (db as any)[tableName].map((row: any) =>
        filteredIds?.has(row.id) ? { ...row, ...newData } : row
      );
      await updateDbState(db);
      filteredIds = null; // Reset filter
      return { data: null, error: null };
    }),
    delete: spies.mockDelete.mockImplementation(async () => {
      const db = await getDbState();
      if (filteredIds) {
        (db as any)[tableName] = (db as any)[tableName].filter(
          (row: any) => !filteredIds!.has(row.id)
        );
      }
      await updateDbState(db);
      filteredIds = null; // Reset filter
      return { data: null, error: null };
    }),
    eq: spies.mockEq.mockImplementation(function (
      this: typeof builder,
      column: string,
      value: any
    ) {
      // Lazy load and filter
      const promise = getDbState().then((db) => {
        const tableData = (db as any)[tableName];
        filteredIds = new Set(
          tableData
            .filter((row: any) => row[column] === value)
            .map((row: any) => row.id)
        );
      });
      // Allow chaining by returning a modified 'thenable' builder
      const thenableBuilder = {
        ...this,
        then: (onFulfilled: any) => promise.then(() => onFulfilled(this)),
      };
      return thenableBuilder;
    }),
    single: spies.mockSingle.mockImplementation(async () => {
      const db = await getDbState();
      const tableData = (db as any)[tableName];
      const result = filteredIds
        ? tableData.find((row: any) => filteredIds!.has(row.id))
        : tableData[0];
      filteredIds = null; // Reset filter
      return { data: result || null, error: null };
    }),
  };
  return builder;
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Hiper-Atomicidad**: ((Implementada)) Este aparato aísla la lógica más compleja del mock de Supabase, cumpliendo con el SRP al más alto nivel.
 * 2. **Integración con Persistencia**: ((Implementada)) Consume la capa de persistencia KV, desacoplando la lógica de consulta de su almacenamiento.
 * 3. **Simulación de Filtros**: ((Implementada)) La simulación de `eq` y `delete` ahora es más robusta, permitiendo operaciones más realistas.
 *
 * =====================================================================
 */
