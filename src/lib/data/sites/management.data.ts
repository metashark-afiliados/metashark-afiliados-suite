// src/lib/data/sites/management.data.ts
/**
 * @file src/lib/data/sites/management.data.ts
 * @description Aparato de datos atómico. Responsable de las operaciones de
 *              lectura para la gestión de sitios (Dashboard). Ha sido optimizado
 *              con `unstable_cache` y enriquecido con una función de conteo.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-09-01
 */
"use server";
import "server-only";

import { unstable_cache as cache } from "next/cache";

import { logger } from "@/lib/logger";
import { createClient as createServerClient } from "@/lib/supabase/server";
import {
  type SiteBasicInfo,
  type SiteSortOption,
  type SiteStatusFilter,
  type SiteWithCampaignCount,
} from "./types";

function buildSiteSearchQuery(
  workspaceId: string,
  filters: { query?: string; status?: SiteStatusFilter; sort?: SiteSortOption }
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
    // La consulta debe usar el ID numérico del estado
    const statusMap = { draft: 1, published: 2, archived: 3 };
    const statusId = statusMap[filters.status as keyof typeof statusMap];
    if (statusId) {
      queryBuilder = queryBuilder.eq("status_id", statusId);
    }
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
  queryBuilder = queryBuilder.order(sort.column, { ascending: sort.ascending });
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

export const getSiteById = cache(
  async (siteId: string): Promise<SiteBasicInfo | null> => {
    logger.trace(`[Cache MISS] Cargando datos del sitio: ${siteId}`);
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("sites")
      .select("id, subdomain, workspace_id, name")
      .eq("id", siteId)
      .single();
    if (error && error.code !== "PGRST116") {
      logger.error(
        `[DataLayer:Sites] Error al obtener el sitio ${siteId}:`,
        error
      );
    }
    return data;
  },
  ["getSiteById"],
  { revalidate: 3600, tags: ["sites"] }
);

export async function getActiveSitesCount(
  workspaceId: string
): Promise<{ count: number }> {
  const supabase = createServerClient();
  const { count, error } = await supabase
    .from("sites")
    .select("id", { count: "exact", head: true })
    .eq("workspace_id", workspaceId)
    .neq("status_id", 3); // 3 es el ID para 'archived' en `site_statuses`

  if (error) {
    logger.error(
      { error },
      `[DataLayer:Sites] Error al contar sitios activos para workspace ${workspaceId}.`
    );
    return { count: 0 };
  }
  return { count: count || 0 };
}
// src/lib/data/sites/management.data.ts
