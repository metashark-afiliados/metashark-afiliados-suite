// src/lib/supabase/mock-client-factory.ts
/**
 * @file src/lib/supabase/mock-client-factory.ts
 * @description Aparato de lógica atómico que actúa como una factoría para crear
 *              un cliente Supabase simulado de alta fidelidad. El método `insert`
 *              ha sido corregido para replicar la estructura de respuesta real de la API de Supabase.
 * @author Raz Podestá
 * @version 1.1.0
 */
import { type User } from "@supabase/supabase-js";

import { logger } from "@/lib/logging";
import { type Tables } from "@/lib/types/database";
import { db, MOCKED_USER } from "@tests/mocks/data/database-state";

interface MinimalCookieStore {
  has(name: string): boolean;
}

function createMockQueryBuilder<T extends { id: string | number }>(
  tableName: keyof typeof db,
  data: T[]
) {
  let query = [...data];
  const builder = {
    select: () => builder,
    // --- INICIO DE CORRECCIÓN (ALTA FIDELIDAD) ---
    insert: (rows: T | T[]) => {
      const rowsArray = Array.isArray(rows) ? rows : [rows];
      const newRows = rowsArray.map((r) => ({
        ...r,
        id: r.id || `dev-${tableName}-${Date.now()}`,
      }));
      (db as any)[tableName].push(...newRows);
      // Replicar la estructura de respuesta real de Supabase
      return Promise.resolve({ data: newRows, error: null });
    },
    // --- FIN DE CORRECCIÓN ---
    update: (newData: Partial<T>) => {
      (db as any)[tableName] = (db as any)[tableName].map((row: T) =>
        query.some((q) => q.id === row.id) ? { ...row, ...newData } : row
      );
      return Promise.resolve({ data: null, error: null });
    },
    delete: () => {
      (db as any)[tableName] = (db as any)[tableName].filter(
        (row: T) => !query.some((q) => q.id === row.id)
      );
      return Promise.resolve({ data: null, error: null });
    },
    eq: (column: keyof T, value: any) => {
      query = query.filter((row) => row[column] === value);
      return builder;
    },
    order: () => builder,
    single: () => Promise.resolve({ data: query[0] || null, error: null }),
    then: (callback: any) =>
      Promise.resolve({ data: query, error: null }).then(callback),
  };
  return builder;
}

export function createDevMockSupabaseClient(
  cookieStore?: MinimalCookieStore
): any {
  logger.info("[DEV_MODE] Usando cliente Supabase SIMULADO.");

  const hasDevSession = cookieStore?.has("dev_session");
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
    from: (tableName: keyof typeof db) =>
      createMockQueryBuilder(tableName, (db as any)[tableName]),
    rpc: (functionName: string, params: any) => {
      if (functionName === "create_workspace_with_owner") {
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
        return Promise.resolve({ data: [{ id: newId }], error: null });
      }
      return Promise.resolve({
        data: null,
        error: { message: `Mocked RPC ${functionName} not implemented` },
      });
    },
  };
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Alta Fidelidad de Mock**: ((Implementada)) El método `insert` ahora replica con precisión la estructura de respuesta de la API de Supabase, resolviendo la causa raíz del `TypeError` en el middleware.
 * 2. **Soporte para Inserción Simple/Múltiple**: ((Implementada)) El mock de `insert` ahora maneja correctamente tanto la inserción de un solo objeto como de un array de objetos, como lo hace la API real.
 *
 * @subsection Melhorias Futuras
 * 1. **Simulación de Errores de Base de Datos**: ((Vigente)) La factoría podría ser extendida para aceptar un parámetro de configuración que le instruya simular errores de base de datos (ej. violaciones de clave única), permitiendo probar los caminos de error de las Server Actions.
 *
 * =====================================================================
 */
// src/lib/supabase/mock-client-factory.ts