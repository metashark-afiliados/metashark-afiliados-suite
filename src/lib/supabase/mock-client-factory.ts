// src/lib/supabase/mock-client-factory.ts
/**
 * @file src/lib/supabase/mock-client-factory.ts
 * @description Factoría de élite para el cliente Supabase simulado. Ha sido
 *              refactorizada para integrar una capa de persistencia Vercel KV,
 *              manteniendo la simulación de alta fidelidad de la API de Supabase.
 *              Esta es la SSoT para el cliente simulado en despliegues de desarrollo.
 * @author L.I.A. Legacy
 * @version 2.1.0
 */
import { type User } from "@supabase/supabase-js";
import { logger } from "@/lib/logging";
import { type Tables } from "@/lib/types/database";
import {
  db as INITIAL_DB_STATE,
  MOCKED_USER,
} from "@tests/mocks/data/database-state";
import {
  getDbState,
  updateDbState,
  type MockDbState,
} from "@tests/mocks/factories/kv-persistence";

interface MinimalCookieStore {
  has(name: string): boolean;
}

function createMockQueryBuilder<T extends { id: string | number }>(
  tableName: keyof MockDbState
) {
  // Estado para el encadenamiento de filtros. Se mantiene en memoria por llamada.
  let filteredIds: Set<string | number> | null = null;

  const builder = {
    select: () => builder,
    insert: async (rows: T | T[]) => {
      const db = await getDbState();
      const rowsArray = Array.isArray(rows) ? rows : [rows];
      const newRows = rowsArray.map((r) => ({
        ...r,
        id: r.id || `dev-${String(tableName)}-${Date.now()}`,
      }));
      (db as any)[tableName].push(...newRows);
      await updateDbState(db);
      return { data: newRows, error: null };
    },
    update: async (newData: Partial<T>) => {
      const db = await getDbState();
      (db as any)[tableName] = (db as any)[tableName].map((row: T) =>
        filteredIds?.has(row.id) ? { ...row, ...newData } : row
      );
      await updateDbState(db);
      filteredIds = null;
      return { data: null, error: null };
    },
    delete: async () => {
      const db = await getDbState();
      if (filteredIds) {
        (db as any)[tableName] = (db as any)[tableName].filter(
          (row: any) => !filteredIds!.has(row.id)
        );
      }
      await updateDbState(db);
      filteredIds = null;
      return { data: null, error: null };
    },
    eq: (column: keyof T, value: any) => {
      // Prepara el filtro para la siguiente operación en la cadena.
      // No necesita ser async, ya que solo define el filtro.
      getDbState().then((db) => {
        const tableData = (db as any)[tableName];
        filteredIds = new Set(
          tableData
            .filter((row: any) => row[column] === value)
            .map((row: any) => row.id)
        );
      });
      return builder;
    },
    order: () => builder,
    single: async () => {
      const db = await getDbState();
      const tableData = (db as any)[tableName];
      const result = filteredIds
        ? tableData.find((row: any) => filteredIds!.has(row.id))
        : tableData[0];
      filteredIds = null;
      return { data: result || null, error: null };
    },
    then: async (callback: (result: { data: T[]; error: null }) => any) => {
      const db = await getDbState();
      const data = (db as any)[tableName];
      return Promise.resolve({ data, error: null }).then(callback);
    },
  };
  return builder;
}

export function createDevMockSupabaseClient(
  cookieStore?: MinimalCookieStore
): any {
  logger.info(
    "[DEV_MODE] Usando cliente Supabase SIMULADO con persistencia Vercel KV."
  );

  const hasDevSession = cookieStore?.has("dev_session") ?? true;
  const currentUser = hasDevSession ? MOCKED_USER : null;
  const currentSession = hasDevSession ? { user: MOCKED_USER } : null;

  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: currentSession } }),
      getUser: () => Promise.resolve({ data: { user: currentUser } }),
      signOut: () => Promise.resolve({ error: null }),
      exchangeCodeForSession: (code: string) => {
        if (code === "dev-mock-code") {
          return Promise.resolve({
            data: { session: currentSession },
            error: null,
          });
        }
        return Promise.resolve({
          data: { session: null },
          error: { message: "Invalid mock code" },
        });
      },
      admin: {
        getUserById: () =>
          Promise.resolve({ data: { user: MOCKED_USER }, error: null }),
        generateLink: () =>
          Promise.resolve({
            data: { properties: { action_link: "http://mock.reset.link" } },
            error: null,
          }),
      },
    },
    from: (tableName: keyof MockDbState) => createMockQueryBuilder(tableName),
    rpc: async (functionName: string, params: any) => {
      if (functionName === "create_workspace_with_owner") {
        const db = await getDbState();
        const newId = `dev-ws-${Date.now()}`;
        db.workspaces.push({
          id: newId,
          name: params.new_workspace_name,
          owner_id: params.owner_user_id,
          current_site_count: 0,
          created_at: new Date().toISOString(),
          updated_at: null,
        });
        db.workspace_members.push({
          id: `dev-wsm-${Date.now()}`,
          workspace_id: newId,
          user_id: params.owner_user_id,
          role: "owner",
          created_at: new Date().toISOString(),
        });
        await updateDbState(db);
        return { data: [{ id: newId }], error: null };
      }
      return {
        data: null,
        error: { message: `Mocked RPC ${functionName} not implemented` },
      };
    },
  };
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Integración de Persistencia KV**: ((Implementada)) La factoría ahora interactúa con la capa de persistencia de Vercel KV, permitiendo un modo de desarrollo persistente en Vercel sin una base de datos real.
 * 2. **Alta Fidelidad de API**: ((Implementada)) Se ha mantenido la lógica de la versión base para simular con precisión la estructura de respuesta de `insert` y la lógica de sesión `dev-mock-code`.
 *
 * @subsection Melhorias Futuras
 * 1. **Simulación de Filtros Avanzada**: ((Vigente)) La implementación de `eq` es funcional pero podría ser más robusta para manejar múltiples llamadas `eq` encadenadas antes de una operación de `update` o `delete`.
 *
 * =====================================================================
 */
