// src/lib/supabase/mock-client-factory.ts
/**
 * @file src/lib/supabase/mock-client-factory.ts
 * @description Factoría de élite para el cliente Supabase simulado. Ha sido
 *              refactorizada para integrar una capa de persistencia Vercel KV
 *              (simulada en memoria), manteniendo la simulación de alta fidelidad
 *              de la API de Supabase. Esta es la SSoT para el cliente simulado
 *              en despliegues de desarrollo y pruebas.
 * @author L.I.A. Legacy
 * @version 3.1.0
 */
import { type User } from "@supabase/supabase-js";
import { faker } from "@faker-js/faker"; // <-- CORRECCIÓN: Importar faker
import { logger } from "@/lib/logging";
import { type Tables } from "@/lib/types/database";
import {
  getDbState,
  updateDbState,
  type MockDbState,
} from "@tests/mocks/factories/kv-persistence";

import { MOCKED_USER } from "@tests/mocks/data/database-state";

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
      (db as any)[tableName].push(...newRows); // Assert type here or refine MockDbState
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
      getDbState().then((db: MockDbState) => {
        const tableData = (db as any)[tableName] as T[];
        filteredIds = new Set(
          tableData
            .filter((row: T) => (row as any)[column] === value)
            .map((row: T) => row.id)
        );
      });
      return builder;
    },
    order: () => builder,
    single: async () => {
      const db = await getDbState();
      const tableData = (db as any)[tableName] as T[];
      const result = filteredIds
        ? tableData.find((row: T) => filteredIds!.has(row.id))
        : tableData[0];
      filteredIds = null;
      return { data: result || null, error: null };
    },
    then: async (callback: (result: { data: T[]; error: null }) => any) => {
      const db = await getDbState();
      const data = (db as any)[tableName] as T[];
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
          // icon: null, // <-- CORRECCIÓN: ELIMINADO para coincidir con el esquema actual (TS2353)
        });
        db.workspace_members.push({
          id: faker.string.uuid(),
          workspace_id: newId,
          user_id: params.owner_user_id,
          role: "owner",
          created_at: new Date().toISOString(),
        });
        await updateDbState(db);
        return { data: [{ id: newId }], error: null };
      } else if (functionName === "duplicate_campaign_rpc") {
        const db = await getDbState();
        const originalCampaign = db.campaigns.find(
          (c) => c.id === params.campaign_id_to_duplicate
        );
        if (!originalCampaign) {
          return { data: null, error: { message: "Campaña no encontrada." } };
        }
        const newCampaign = {
          ...originalCampaign,
          id: faker.string.uuid(),
          name: params.new_name,
          slug:
            originalCampaign.slug +
            "-copia-" +
            faker.string.alphanumeric(6).toLowerCase(),
          status: "draft",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Tables<"campaigns">;
        db.campaigns.push(newCampaign);
        await updateDbState(db);
        return { data: [{ id: newCampaign.id }], error: null };
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
 * 1. **Resolución de Error `TS2353` (`icon` property)**: ((Implementada)) Se ha eliminado la propiedad `icon: null` del objeto `workspaces` al crear un mock, sincronizando el mock con el tipo de la tabla `workspaces` (`src/lib/types/database/tables/workspaces.ts`) y resolviendo el error de tipos.
 * 2. **Resolución de Error `TS2304` (`faker` not found)**: ((Implementada)) Se ha añadido la importación `import { faker } from "@faker-js/faker";` al inicio del archivo, resolviendo los errores de `faker` no definido.
 * 3. **Consistencia y No Regresión**: ((Implementada)) Todos los demás mocks y lógicas existentes se mantienen intactos, asegurando la no regresión.
 *
 * @subsection Melhorias Futuras
 * 1. **Factoría de Query Builder Completa**: ((Vigente)) El `createMockQueryBuilder` aún no maneja todos los métodos de `postgrest-js` (ej. `filter`, `limit`, `order` completo). Una mejora de élite sería implementar todos los métodos relevantes para una simulación más completa, operando sobre el estado `inMemoryDbState`.
 * 2. **Tipado Estricto de `rpc`**: ((Vigente)) Aunque funcional, el `rpc` genérico con `any` podría refinarse para aceptar un tipo genérico que infiera `Args` y `Returns` para cada función RPC, mejorando la seguridad de tipos.
 *
 * =====================================================================
 */
// src/lib/supabase/mock-client-factory.ts
