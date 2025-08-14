// src/lib/supabase/dev-mock-server.ts
/**
 * @file src/lib/supabase/dev-mock-server.ts
 * @description Aparato de utilidad para crear un cliente Supabase simulado para el "Modo Desarrollador".
 *              Este cliente mock permite que la aplicación se ejecute localmente (`pnpm dev`)
 *              sin necesidad de una conexión a una base de datos remota. Proporciona datos
 *              predefinidos y simula operaciones comunes como `select` y `rpc` para habilitar
 *              el desarrollo frontend completo sin dependencias de backend.
 *              ¡NO DEBE USARSE EN PRODUCCIÓN!
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { type User } from "@supabase/supabase-js";

import { logger } from "@/lib/logging";
import { type Database, type Tables } from "@/lib/types/database";

/**
 * @private
 * @constant MOCKED_USER
 * @description Datos de un usuario simulado para el modo desarrollador.
 *              Proporciona una sesión de usuario básica para que el dashboard se cargue.
 */
const MOCKED_USER: User = {
  id: "dev-user-id",
  email: "dev@convertikit.com",
  user_metadata: {
    full_name: "Raz Podestá",
    avatar_url: "https://avatars.githubusercontent.com/u/1024025?v=4",
  },
  app_metadata: {
    provider: "email",
    providers: ["email"],
    app_role: "developer", // Rol elevado para acceso al dev-console
  },
  aud: "authenticated",
  created_at: new Date().toISOString(),
};

/**
 * @private
 * @constant MOCKED_WORKSPACES
 * @description Datos de workspaces simulados. Incluye uno activo y algunas invitaciones.
 */
const MOCKED_WORKSPACES: Tables<"workspaces">[] = [
  {
    id: "dev-workspace-1",
    name: "Development Workspace",
    owner_id: MOCKED_USER.id,
    icon: "🚀",
    current_site_count: 2,
    created_at: new Date().toISOString(),
    updated_at: null,
  },
  {
    id: "dev-workspace-2",
    name: "Another Project",
    owner_id: "another-dev-user-id", // Simula otro propietario
    icon: "💡",
    current_site_count: 0,
    created_at: new Date().toISOString(),
    updated_at: null,
  },
];

/**
 * @private
 * @constant MOCKED_SITES
 * @description Datos de sitios simulados para el workspace de desarrollo.
 */
const MOCKED_SITES: Tables<"sites">[] = [
  {
    id: "dev-site-1",
    workspace_id: MOCKED_WORKSPACES[0].id,
    owner_id: MOCKED_USER.id,
    name: "Dev Landing Page",
    subdomain: "dev-landing",
    custom_domain: null,
    icon: "✨",
    description: "My first development site.",
    status: "draft",
    created_at: new Date().toISOString(),
    updated_at: null,
  },
  {
    id: "dev-site-2",
    workspace_id: MOCKED_WORKSPACES[0].id,
    owner_id: MOCKED_USER.id,
    name: "Test Funnel",
    subdomain: "test-funnel",
    custom_domain: null,
    icon: " funnel",
    description: "A funnel for testing purposes.",
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: null,
  },
];

/**
 * @private
 * @constant MOCKED_CAMPAIGNS
 * @description Datos de campañas simuladas para los sitios de desarrollo.
 */
const MOCKED_CAMPAIGNS: Tables<"campaigns">[] = [
  {
    id: "dev-campaign-1",
    site_id: MOCKED_SITES[0].id,
    created_by: MOCKED_USER.id,
    name: "Landing Page A",
    slug: "landing-page-a",
    status: "draft",
    content: {
      id: "dev-campaign-1",
      name: "Landing Page A",
      theme: { globalFont: "Inter", globalColors: {} },
      blocks: [
        {
          id: "block-1",
          type: "Header1",
          props: { logoText: "DevKit", ctaText: "Sign Up" },
          styles: { backgroundColor: "#333", textColor: "#FFF" },
        },
        {
          id: "block-2",
          type: "Hero1",
          props: {
            title: "Welcome to Dev Mode!",
            subtitle:
              "Build and test your UI without a real database connection.",
          },
          styles: { backgroundColor: "#EEE", textColor: "#333" },
        },
      ],
    },
    affiliate_url: "https://example.com/affiliate-a",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "dev-campaign-2",
    site_id: MOCKED_SITES[0].id,
    created_by: MOCKED_USER.id,
    name: "Product X Launch",
    slug: "product-x-launch",
    status: "published",
    content: {},
    affiliate_url: "https://example.com/affiliate-x",
    created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    updated_at: new Date().toISOString(),
  },
  {
    id: "dev-campaign-3",
    site_id: MOCKED_SITES[1].id, // Campaign for another site
    created_by: MOCKED_USER.id,
    name: "Funnel Step 1",
    slug: "funnel-step-1",
    status: "draft",
    content: {},
    affiliate_url: null,
    created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    updated_at: null,
  },
];

/**
 * @private
 * @constant MOCKED_PROFILES
 * @description Datos de perfiles simulados, incluyendo el perfil del usuario mock.
 */
const MOCKED_PROFILES: Tables<"profiles">[] = [
  {
    id: MOCKED_USER.id,
    email: MOCKED_USER.email!,
    full_name: MOCKED_USER.user_metadata?.full_name as string,
    avatar_url: MOCKED_USER.user_metadata?.avatar_url as string,
    app_role: MOCKED_USER.app_metadata
      ?.app_role as Database["public"]["Enums"]["app_role"],
    plan_type: "free",
    dashboard_layout: ["sites", "campaigns"],
    created_at: MOCKED_USER.created_at,
    updated_at: null,
  },
  {
    id: "another-user-id",
    email: "another.dev@example.com",
    full_name: "Another Dev",
    avatar_url: null,
    app_role: "user",
    plan_type: "free",
    dashboard_layout: null,
    created_at: new Date().toISOString(),
    updated_at: null,
  },
];

/**
 * @private
 * @constant MOCKED_INVITATIONS
 * @description Datos de invitaciones simuladas.
 */
const MOCKED_INVITATIONS: Tables<"invitations">[] = [
  {
    id: "dev-invite-1",
    workspace_id: MOCKED_WORKSPACES[1].id,
    invited_by: "another-dev-user-id",
    invitee_email: MOCKED_USER.email!,
    role: "member",
    status: "pending",
    created_at: new Date().toISOString(),
    updated_at: null,
  },
];

/**
 * @private
 * @function createMockQueryBuilder
 * @description Crea un mock de un constructor de consultas (ej. `supabase.from('table').select()`).
 *              Implementa un filtrado básico para `eq` y `in`, y devuelve datos simulados.
 * @param {any[]} data - Los datos base para esta "tabla".
 * @returns {any} Un objeto que simula el query builder.
 */
function createMockQueryBuilder(data: any[]): any {
  let filteredData = [...data];
  let currentCount: number | null = null; // To hold the exact count if requested

  const builder = {
    select: (columns: string, options: { count?: "exact" } = {}) => {
      // Simulate column selection if needed, for simplicity, we return full objects
      if (options.count === "exact") {
        currentCount = filteredData.length;
      }
      return builder;
    },
    eq: (column: string, value: any) => {
      filteredData = filteredData.filter((row) => row[column] === value);
      return builder;
    },
    or: (filters: string) => {
      // Basic simulation of OR logic for strings only
      // Example: `name.ilike.%query%,slug.ilike.%query%`
      const conditions = filters.split(",").map((cond) => {
        const [col, op, val] = cond.split(/(\.|%)/).filter(Boolean); // Very basic parse
        return {
          col: col.trim(),
          op: op.trim(),
          val: val ? val.replace(/%/g, "").toLowerCase() : "",
        };
      });

      filteredData = filteredData.filter((row) => {
        return conditions.some((condition) => {
          const rowValue = String(row[condition.col]).toLowerCase();
          return rowValue.includes(condition.val);
        });
      });
      return builder;
    },
    in: (column: string, values: any[]) => {
      filteredData = filteredData.filter((row) => values.includes(row[column]));
      return builder;
    },
    order: (
      column: string,
      options: { ascending?: boolean; nullsFirst?: boolean } = {}
    ) => {
      // Simple string/number sort for demonstration
      filteredData.sort((a, b) => {
        const valA = a[column];
        const valB = b[column];
        if (valA === null && valB === null) return 0;
        if (valA === null) return options.nullsFirst ? -1 : 1;
        if (valB === null) return options.nullsFirst ? 1 : -1;

        if (typeof valA === "string" && typeof valB === "string") {
          return options.ascending
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }
        return options.ascending ? valA - valB : valB - valA;
      });
      return builder;
    },
    limit: (count: number) => {
      filteredData = filteredData.slice(0, count);
      return builder;
    },
    range: (from: number, to: number) => {
      filteredData = filteredData.slice(from, to + 1);
      return builder;
    },
    single: () => {
      // Simula single()
      if (filteredData.length > 1) {
        logger.warn(
          "[DevMock] single() called but multiple rows found. Returning first."
        );
      }
      return Promise.resolve({
        data: filteredData[0] || null,
        error:
          filteredData.length === 0
            ? { code: "PGRST116", message: "Row not found" }
            : null,
      });
    },
    insert: (rows: any[]) => {
      // Simula inserción, añadiendo un ID si no está presente
      const insertedRows = rows.map((row) => ({
        id:
          row.id ||
          (globalThis.crypto?.randomUUID
            ? globalThis.crypto.randomUUID()
            : `mock-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`),
        created_at: new Date().toISOString(),
        ...row,
      }));
      // En un mock real, esto modificaría el `data` original o una copia persistente.
      // Aquí, solo se devuelve para simular el éxito.
      return Promise.resolve({ data: insertedRows, error: null });
    },
    delete: () => {
      // Simula eliminación, no modifica data
      return Promise.resolve({
        data: { id: filteredData[0]?.id || "mock-deleted-id" },
        error: null,
      });
    },
    // Añadir otros métodos necesarios como update, upsert, etc.
    then: (callback: any) =>
      Promise.resolve({
        data: filteredData,
        count: currentCount,
        error: null,
      }).then(callback),
    catch: (callback: any) =>
      Promise.resolve({
        data: filteredData,
        count: currentCount,
        error: null,
      }).catch(callback),
  };
  return builder;
}

/**
 * @public
 * @function createDevMockSupabaseClient
 * @description Crea y exporta una instancia del cliente Supabase mock para el modo de desarrollo.
 *              Esta función simula las interacciones de `supabase-js` con datos locales.
 * @returns {any} Una instancia simulada del cliente Supabase.
 */
export function createDevMockSupabaseClient(): any {
  logger.info(
    "[DEV_MODE] Usando cliente Supabase SIMULADO. No hay conexión real a la DB."
  );

  const mockDb = {
    profiles: [...MOCKED_PROFILES],
    workspaces: [...MOCKED_WORKSPACES],
    sites: [...MOCKED_SITES],
    campaigns: [...MOCKED_CAMPAIGNS],
    invitations: [...MOCKED_INVITATIONS],
    visitor_logs: [], // Los logs de visita pueden ser vacíos o mínimos en dev
    // Añadir otras tablas necesarias
  };

  return {
    auth: {
      getSession: () =>
        Promise.resolve({ data: { session: { user: MOCKED_USER } } }),
      getUser: () => Promise.resolve({ data: { user: MOCKED_USER } }),
      signOut: () => {
        logger.info("[DevMock:Auth] Simulación de signOut.");
        return Promise.resolve({ error: null });
      },
      // Implementar otros métodos de auth.admin si son necesarios en dev
      admin: {
        getUserById: (userId: string) => {
          const userProfile = mockDb.profiles.find((p) => p.id === userId);
          if (userProfile) {
            return Promise.resolve({
              data: { user: MOCKED_USER },
              error: null,
            });
          }
          return Promise.resolve({
            data: { user: null },
            error: new Error("User not found"),
          });
        },
        generateLink: ({ email, type }: { email: string; type: string }) => {
          logger.info(
            `[DevMock:Auth.Admin] Simulación de generateLink para ${email} (${type}).`
          );
          return Promise.resolve({
            data: { properties: { action_link: "http://mock.reset.link" } },
            error: null,
          });
        },
      },
    },
    from: (tableName: keyof Database["public"]["Tables"]) => {
      const tableData = mockDb[tableName];
      if (!tableData) {
        logger.warn(`[DevMock:From] Acceso a tabla no mockeada: ${tableName}`);
        return createMockQueryBuilder([]); // Return empty builder for unknown tables
      }
      return createMockQueryBuilder(tableData);
    },
    rpc: (functionName: keyof Database["public"]["Functions"], args: any) => {
      logger.info(
        `[DevMock:RPC] Llamada RPC simulada: ${String(functionName)} con args:`,
        args
      );
      // Implementa lógica para RPCs específicas si son usadas en dev mode
      if (functionName === "create_workspace_with_owner") {
        const newWorkspace = {
          id: globalThis.crypto?.randomUUID
            ? globalThis.crypto.randomUUID()
            : `mock-ws-${Date.now()}`,
          name: args.new_workspace_name,
          owner_id: args.owner_user_id,
          icon: args.new_workspace_icon,
          current_site_count: 0,
          created_at: new Date().toISOString(),
          updated_at: null,
        };
        mockDb.workspaces.push(newWorkspace); // Add to local mock state
        mockDb.profiles.push({
          // Basic profile for the new owner if not exists
          id: args.owner_user_id,
          email: `owner-${args.owner_user_id}@mock.com`,
          full_name: args.new_workspace_name + " Owner",
          app_role: "owner",
          created_at: new Date().toISOString(),
          dashboard_layout: null,
          avatar_url: null,
          plan_type: "free",
          updated_at: null,
        });
        return Promise.resolve({ data: [newWorkspace], error: null });
      }
      if (functionName === "accept_workspace_invitation") {
        const invitationId = args.invitation_id;
        const acceptingUserId = args.accepting_user_id;
        const invitation = mockDb.invitations.find(
          (inv) =>
            inv.id === invitationId && inv.invitee_email === MOCKED_USER.email
        );
        if (invitation) {
          invitation.status = "accepted"; // Update mock state
          const workspace = mockDb.workspaces.find(
            (ws) => ws.id === invitation.workspace_id
          );
          if (
            workspace &&
            !mockDb.workspaces.some(
              (wm) =>
                wm.workspace_id === workspace.id &&
                wm.user_id === acceptingUserId
            )
          ) {
            // Add member to mock workspace members (assuming it's mocked)
            // This mock doesn't have workspace_members table directly. Needs to be considered if used.
            logger.info(
              `[DevMock:RPC] Simulating adding user ${acceptingUserId} to workspace ${workspace.name}`
            );
          }
          return Promise.resolve({
            data: { success: true, message: "Invitation accepted!" },
            error: null,
          });
        }
        return Promise.resolve({
          data: null,
          error: { message: "Invitation not found or not for this user" },
        });
      }
      if (functionName === "get_system_diagnostics") {
        return Promise.resolve({
          data: {
            schema_columns: [],
            rls_policies: [],
            routines: [],
            triggers: [],
          },
          error: null,
        });
      }
      if (functionName === "duplicate_campaign_rpc") {
        const originalCampaign = mockDb.campaigns.find(
          (c) => c.id === args.campaign_id_to_duplicate
        );
        if (originalCampaign) {
          const newCampaign = {
            ...originalCampaign,
            id: globalThis.crypto?.randomUUID
              ? globalThis.crypto.randomUUID()
              : `mock-camp-${Date.now()}`,
            name: `${originalCampaign.name} (Copy)`,
          };
          mockDb.campaigns.push(newCampaign); // Add to local mock state
          return Promise.resolve({ data: [newCampaign], error: null });
        }
        return Promise.resolve({
          data: null,
          error: { message: "Campaign not found" },
        });
      }

      return Promise.resolve({
        data: null,
        error: { message: "Mocked RPC not implemented" },
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
 * 1. **Cliente Mock Funcional**: ((Implementada)) Se ha creado una factoría de cliente Supabase simulada que imita los métodos clave (`from`, `auth`, `rpc`) y devuelve datos estáticos o pre-generados. Esto permite que la aplicación se renderice y navegue en desarrollo sin una conexión real a la DB.
 * 2. **Datos de Desarrollo Robustos**: ((Implementada)) Los datos simulados incluyen un usuario con rol `developer`, workspaces, sitios y campañas, lo que permite probar la mayoría de los flujos de UI.
 * 3. **Simulación de Query Builder**: ((Implementada)) La función `createMockQueryBuilder` simula el encadenamiento de métodos como `select`, `eq`, `order`, `range`, `single`, `insert`, lo cual es crucial para la mayoría de las llamadas a la base de datos.
 * 4. **Observabilidad en Desarrollo**: ((Implementada)) Se han añadido logs informativos que indican cuándo se está utilizando el cliente mock y cuándo se invocan métodos simulados.
 *
 * @subsection Melhorias Futuras
 * 1. **Persistencia Local (LocalStorage/IndexedDB)**: ((Vigente)) Para una experiencia de desarrollo más avanzada, el estado de `mockDb` podría persistirse en `localStorage` o `IndexedDB` para que los cambios hechos en el navegador (ej. creación de sitios) persistan entre recargas, simulando una DB local.
 * 2. **Generación de Datos Dinámicos con Faker**: ((Vigente)) Expandir el uso de `faker.js` dentro de `createMockQueryBuilder` para generar datos más variados y grandes, especialmente para las operaciones de `select` y `range`, simulando paginación y filtrado.
 * 3. **Coincidencia Avanzada de Queries**: ((Vigente)) Mejorar `createMockQueryBuilder` para manejar filtros más complejos (ej. `gt`, `lt`, `ilike` más robusto) y relaciones (`.select('*, related_table(*)')`) de manera más precisa.
 *
 * =====================================================================
 */
