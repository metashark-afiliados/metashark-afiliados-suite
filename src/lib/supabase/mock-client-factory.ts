// src/lib/supabase/mock-client-factory.ts
/**
 * @file src/lib/supabase/mock-client-factory.ts
 * @description Factoría de élite para el cliente Supabase simulado. Ha sido
 *              sincronizado con el contrato de datos de `workspaces` para
 *              incluir la propiedad 'icon', resolviendo el error de tipo TS2345
 *              en la simulación de la RPC.
 * @author L.I.A. Legacy & Raz Podestá
 * @version 4.0.0
 * @date 2025-08-27
 */
import { type User } from "@supabase/supabase-js";
import { faker } from "@faker-js/faker";
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
          icon: "🚀", // <-- SINCRONIZADO
          current_site_count: 0,
          created_at: new Date().toISOString(),
          updated_at: null,
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
 * 1. **Resolución de Error `TS2345` (`icon` property)**: ((Implementada)) Se ha añadido `icon: "🚀"` al objeto de workspace que se inserta en la simulación de la RPC. Esto alinea la lógica de la simulación con el contrato de datos `Tables<"workspaces">` y resuelve el último error de tipo de la Causa Raíz #2.
 *
 * @subsection Melhorias Futuras
 * 1. **Tipado Estricto de RPCs**: ((Vigente)) El mock de `rpc` podría ser refactorizado para usar un `switch` statement y tener tipos más estrictos para los `params` de cada RPC simulada, mejorando la seguridad de tipos interna del mock.
 *
 * =====================================================================
 */
// src/lib/supabase/mock-client-factory.ts
