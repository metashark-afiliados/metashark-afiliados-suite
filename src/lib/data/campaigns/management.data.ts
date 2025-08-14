// src/lib/data/campaigns/management.data.ts
/**
 * @file src/lib/data/campaigns/management.data.ts
 * @description Aparato de datos atómico. Ha sido nivelado para soportar
 *              Inyección de Dependencias.
 * @author Raz Podestá
 * @version 2.0.0
 */
"use server";

import { unstable_cache as cache } from "next/cache";
import { type SupabaseClient } from "@supabase/supabase-js";

import { logger } from "@/lib/logging";
import { createClient as createServerClient } from "@/lib/supabase/server";

import { type CampaignMetadata } from "./types";

type Database = import("@/lib/types/database").Database;
type Supabase = SupabaseClient<Database, "public">;

export async function getCampaignsMetadataBySiteId(
  siteId: string,
  options: {
    page: number;
    limit: number;
    query?: string;
    status?: "draft" | "published" | "archived";
    sortBy?: "updated_at_desc" | "name_asc";
  },
  supabaseClient?: Supabase
): Promise<{ campaigns: CampaignMetadata[]; totalCount: number }> {
  const { page, limit, query, status, sortBy } = options;
  const cacheKey = `campaigns-meta-${siteId}-p${page}-q${
    query || ""
  }-s${status || ""}-o${sortBy || ""}`;
  const cacheTags = [`campaigns:${siteId}`];

  return cache(
    async () => {
      logger.info(
        `[Cache MISS] Cargando metadatos de campañas para: ${cacheKey}`
      );
      const supabase = supabaseClient || createServerClient();
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      let queryBuilder = supabase
        .from("campaigns")
        .select(
          "id, site_id, name, slug, status, created_at, updated_at, affiliate_url",
          { count: "exact" }
        )
        .eq("site_id", siteId);

      if (query) {
        queryBuilder = queryBuilder.or(
          `name.ilike.%${query}%,slug.ilike.%${query}%`
        );
      }
      if (status) {
        queryBuilder = queryBuilder.eq("status", status);
      }

      const sortMap = {
        updated_at_desc: { column: "updated_at", ascending: false },
        name_asc: { column: "name", ascending: true },
      };
      const sort = sortMap[sortBy || "updated_at_desc"];
      queryBuilder = queryBuilder.order(sort.column, {
        ascending: sort.ascending,
        nullsFirst: false,
      });

      const { data, error, count } = await queryBuilder.range(from, to);

      if (error) {
        logger.error(
          `Error al obtener campañas para el sitio ${siteId}:`,
          error
        );
        return { campaigns: [], totalCount: 0 };
      }
      return { campaigns: data as CampaignMetadata[], totalCount: count || 0 };
    },
    [cacheKey],
    { tags: cacheTags }
  )();
}

export async function getRecentCampaignsByWorkspaceId(
  workspaceId: string,
  limit: number = 4,
  supabaseClient?: Supabase
): Promise<import("@/lib/types/database").Tables<"campaigns">[]> {
  const cacheKey = `recent-campaigns-${workspaceId}`;
  const cacheTags = [`workspaces:${workspaceId}:recent-campaigns`];

  return cache(
    async () => {
      logger.info(
        `[Cache MISS] Cargando campañas recientes para workspace ${workspaceId}.`
      );
      const supabase = supabaseClient || createServerClient();
      const { data: sites, error: sitesError } = await supabase
        .from("sites")
        .select("id")
        .eq("workspace_id", workspaceId);

      if (sitesError || !sites || sites.length === 0) {
        if (sitesError)
          logger.error(
            `Error al obtener sitios para el workspace ${workspaceId}:`,
            sitesError
          );
        return [];
      }
      const siteIds = sites.map((s) => s.id);

      const { data: campaigns, error: campaignsError } = await supabase
        .from("campaigns")
        .select("*")
        .in("site_id", siteIds)
        .order("updated_at", { ascending: false, nullsFirst: false })
        .limit(limit);

      if (campaignsError) {
        logger.error(
          `Error al obtener campañas recientes para el workspace ${workspaceId}:`,
          campaignsError
        );
        return [];
      }
      return campaigns || [];
    },
    [cacheKey],
    { tags: cacheTags }
  )();
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Inyección de Dependencias**: ((Implementada)) Las funciones ahora aceptan `supabaseClient`, permitiendo su uso seguro en contextos cacheados.
 *
 * =====================================================================
 */
// src/lib/data/campaigns/management.data.ts
