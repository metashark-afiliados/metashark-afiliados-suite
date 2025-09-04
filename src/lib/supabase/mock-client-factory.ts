// src/lib/supabase/mock-client-factory.ts
/**
 * @file src/lib/supabase/mock-client-factory.ts
 * @description Factoría de élite para el cliente Supabase simulado. Ha sido
 *              sincronizado con la arquitectura "Lean Database", utilizando
 *              `role_id` y `status_id` para una simulación de alta fidelidad.
 * @author L.I.A. Legacy
 * @version 5.0.0
 */
import { faker } from "@faker-js/faker";
import { type User } from "@supabase/supabase-js";
import { vi } from "vitest";

import { WORKSPACE_ROLES } from "@/config/roles.config";
import { logger } from "@/lib/logger";
import { type Tables } from "@/lib/types/database";
import { MOCKED_USER } from "@tests/mocks/data/database-state";
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
  // ... (Lógica interna sin cambios)
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
    "[DEV_MODE] Usando cliente Supabase SIMULADO con persistencia en memoria."
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
          icon: "🚀",
          created_at: new Date().toISOString(),
          updated_at: null,
        } as Tables<"workspaces">);
        db.workspace_members.push({
          id: faker.string.uuid(),
          workspace_id: newId,
          user_id: params.owner_user_id,
          // --- INICIO DE REFACTORIZACIÓN: Alineación con Lean Database ---
          role_id: WORKSPACE_ROLES.OWNER.id,
          // --- FIN DE REFACTORIZACIÓN ---
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
        const newCampaign: Tables<"campaigns"> = {
          ...originalCampaign,
          id: faker.string.uuid(),
          name: params.new_name,
          slug:
            originalCampaign.slug +
            "-copia-" +
            faker.string.alphanumeric(6).toLowerCase(),
          // --- INICIO DE REFACTORIZACIÓN: Alineación con Lean Database ---
          status_id: 1, // 1 = 'draft'
          // --- FIN DE REFACTORIZACIÓN ---
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
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
// src/lib/supabase/mock-client-factory.ts
