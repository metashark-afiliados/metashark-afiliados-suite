// src/lib/data/sites.ts
/**
 * @file src/lib/data/sites.ts
 * @description Aparato de datos para la entidad 'sites'. Ha sido refactorizado
 *              a un estándar de élite para soportar filtrado por estado y
 *              múltiples opciones de ordenamiento, y su lógica de consulta ha
 *              sido atomizada para máxima cohesión y reutilización.
 * @author L.I.A. Legacy & Raz Podestá
 * @version 2.0.0
 */
"use server";

import { unstable_cache as cache } from "next/cache";
import { type SupabaseClient } from "@supabase/supabase-js";

import { logger } from "@/lib/logging";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { type Enums, type Tables } from "@/lib/types/database";
import { rootDomain } from "@/lib/utils";

export type ViewMode = "grid" | "list";
export type SiteStatusFilter = Enums["site_status"] | "all";
export type SiteSortOption = "created_at_desc" | "name_asc" | "name_desc";

export type SiteWithCampaignCount = Tables<"sites"> & {
  campaign_count: number;
};

export type SiteBasicInfo = Pick<
  Tables<"sites">,
  "id" | "subdomain" | "workspace_id" | "name"
>;

type Database = import("@/lib/types/database").Database;
type Supabase = SupabaseClient<Database, "public">;

/**
 * @private
 * @function buildSiteSearchQuery
 * @description Aparato de lógica pura que construye la consulta de Supabase para
 *              buscar sitios, aplicando dinámicamente filtros y ordenamiento.
 * @param {string} workspaceId - El ID del workspace a consultar.
 * @param {object} filters - Opciones de filtrado y ordenamiento.
 * @returns {import('@supabase/postgrest-js').PostgrestFilterBuilder} El constructor de consulta.
 */
function buildSiteSearchQuery(
  workspaceId: string,
  filters: {
    query?: string;
    status?: SiteStatusFilter;
    sort?: SiteSortOption;
  }
) {
  const supabase = createServerClient();
  let queryBuilder = supabase
    .from("sites_with_campaign_counts")
    .select("*", { count: "exact" })
    .eq("workspace_id", workspaceId);

  if (filters.query) {
    queryBuilder = queryBuilder.ilike("name", `%${filters.query}%`);
  }

  if (filters.status && filters.status !== "all") {
    queryBuilder = queryBuilder.eq("status", filters.status);
  }

  const sortMap: Record<
    SiteSortOption,
    { column: string; ascending: boolean }
  > = {
    created_at_desc: { column: "created_at", ascending: false },
    name_asc: { column: "name", ascending: true },
    name_desc: { column: "name", ascending: false },
  };
  const sort = sortMap[filters.sort || "created_at_desc"];
  queryBuilder = queryBuilder.order(sort.column, {
    ascending: sort.ascending,
  });

  return queryBuilder;
}

export async function getSitesByWorkspaceId(
  workspaceId: string,
  {
    page = 1,
    limit = 9,
    query: searchQuery = "",
    status: statusFilter = "all",
    sort: sortOption = "created_at_desc",
  }: {
    page?: number;
    limit?: number;
    query?: string;
    status?: SiteStatusFilter;
    sort?: SiteSortOption;
  }
): Promise<{ sites: SiteWithCampaignCount[]; totalCount: number }> {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const queryBuilder = buildSiteSearchQuery(workspaceId, {
    query: searchQuery,
    status: statusFilter,
    sort: sortOption,
  });

  const { data, error, count } = await queryBuilder.range(from, to);

  if (error) {
    logger.error(
      `[DataLayer:Sites] Error al obtener sitios para workspace ${workspaceId}:`,
      error
    );
    throw new Error("No se pudieron obtener los sitios del workspace.");
  }

  return {
    sites: (data as SiteWithCampaignCount[]) || [],
    totalCount: count || 0,
  };
}

export async function getSiteById(
  siteId: string
): Promise<SiteBasicInfo | null> {
  // ... (sin cambios en esta función)
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("sites")
    .select("id, subdomain, workspace_id, name")
    .eq("id", siteId)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      logger.error(
        `[DataLayer:Sites] Error al obtener el sitio ${siteId}:`,
        error
      );
    }
    return null;
  }
  return data;
}

export async function getSiteDataByHost(
  host: string
): Promise<Tables<"sites"> | null> {
  // ... (sin cambios en esta función)
  const sanitizedHost = host.toLowerCase().replace(/^www\./, "");
  const rootDomainWithoutPort = rootDomain.split(":")[0];

  const isSubdomainOfRoot =
    sanitizedHost.endsWith(`.${rootDomainWithoutPort}`) &&
    sanitizedHost !== rootDomainWithoutPort;
  const isLikelySlug = !sanitizedHost.includes(".");
  const isSubdomain = isSubdomainOfRoot || isLikelySlug;

  const finalHost = isSubdomainOfRoot
    ? sanitizedHost.replace(`.${rootDomainWithoutPort}`, "")
    : sanitizedHost;

  return cache(
    async (hostToSearch: string) => {
      logger.trace(`[Cache MISS] Buscando sitio para el host: ${hostToSearch}`);
      const supabase = createServerClient();
      let query = supabase.from("sites").select("*");
      query = isSubdomain
        ? query.eq("subdomain", hostToSearch)
        : query.eq("custom_domain", hostToSearch);

      const { data, error } = await query.single();

      if (error && error.code !== "PGRST116") {
        logger.error(
          `[DataLayer:Sites] Error al obtener sitio por host ${hostToSearch}:`,
          error
        );
        return null;
      }
      return data;
    },
    [`site-data-host-${finalHost}`],
    { revalidate: 3600, tags: [`sites:host:${finalHost}`] }
  )(finalHost);
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Funcionalidad de Filtros Completa**: ((Implementada)) La función `getSitesByWorkspaceId` ahora acepta y aplica los parámetros `status` y `sort`, conectando la nueva UI de filtros con la capa de datos.
 * 2. **Atomicidad de Lógica de Consulta (SRP)**: ((Implementada)) La lógica compleja de construcción de la consulta de Supabase ha sido extraída a la función pura y atómica `buildSiteSearchQuery`. Esto mejora drásticamente la legibilidad, mantenibilidad y testeabilidad del módulo.
 * 3. **Optimización de Búsqueda**: ((Implementada)) La búsqueda por `query` ahora se realiza sobre el campo `name` en lugar de `subdomain`, lo que proporciona una experiencia de búsqueda más intuitiva para el usuario.
 *
 * @subsection Melhorias Futuras
 * 1. **Índices de Base de Datos**: ((Vigente)) Para optimizar el rendimiento de las consultas a gran escala, se deben añadir índices de base de datos en las columnas `workspace_id`, `name`, y `status` de la tabla `sites`. Propondré esta mejora de infraestructura en una futura épica de performance.
 * 2. **Búsqueda de Texto Completo (Full-Text Search)**: ((Pendiente)) Para una búsqueda aún más potente, se podría implementar un índice `tsvector` en PostgreSQL sobre los campos `name` y `description`, y utilizar la función `to_tsquery` en la consulta.
 *
 * =====================================================================
 */
// src/lib/data/sites.ts
