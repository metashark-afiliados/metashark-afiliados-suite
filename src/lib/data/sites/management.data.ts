// src/lib/data/sites/management.data.ts
/**
 * @file src/lib/data/sites/management.data.ts
 * @description Aparato de datos atómico. Responsable de las operaciones de
 *              lectura para la gestión de sitios (Dashboard). Refactorizado
 *              para alinear el logging a la firma canónica y corregir el
 *              patrón de cacheo dinámico.
 * @author RaZ Podestá - MetaShark Tech
 * @version 5.0.0
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

  try {
    const { data, error, count } = await queryBuilder.range(from, to);
    if (error) {
      throw error;
    }
    return {
      sites: (data as SiteWithCampaignCount[]) || [],
      totalCount: count || 0,
    };
  } catch (error) {
    logger.error(
      { err: error, workspaceId },
      `[DataLayer:Sites] Error al obtener sitios para workspace.`
    );
    throw new Error("No se pudieron obtener los sitios del workspace.");
  }
}

export async function getSiteById(
  siteId: string
): Promise<SiteBasicInfo | null> {
  const keyParts = ["getSiteById", siteId];
  const tags = ["sites", `site:${siteId}`];

  return cache(
    async () => {
      logger.trace({ siteId }, "[Cache MISS] Cargando datos del sitio.");
      const supabase = createServerClient();
      try {
        const { data, error } = await supabase
          .from("sites")
          .select("id, subdomain, workspace_id, name")
          .eq("id", siteId)
          .single();

        if (error && error.code !== "PGRST116") {
          throw error;
        }
        return data;
      } catch (error) {
        logger.error(
          { err: error, siteId },
          `[DataLayer:Sites] Error al obtener el sitio.`
        );
        return null;
      }
    },
    keyParts,
    { revalidate: 3600, tags }
  )();
}

export async function getActiveSitesCount(
  workspaceId: string
): Promise<{ count: number }> {
  try {
    const supabase = createServerClient();
    const { count, error } = await supabase
      .from("sites")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspaceId)
      .neq("status_id", 3);

    if (error) {
      throw error;
    }
    return { count: count || 0 };
  } catch (error) {
    logger.error(
      { err: error, workspaceId },
      `[DataLayer:Sites] Error al contar sitios activos.`
    );
    return { count: 0 };
  }
}
// src/lib/data/sites/management.data.ts
