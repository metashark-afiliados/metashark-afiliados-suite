/**
 * @file src/lib/data/campaigns/management.data.ts
 * @description Aparato de datos atómico. Su única responsabilidad es obtener
 *              datos de campañas para los paneles de gestión del usuario.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use server";

import { unstable_cache as cache } from "next/cache";

import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type Tables } from "@/lib/types/database";

import { type CampaignMetadata } from "./types";

export async function getCampaignsMetadataBySiteId(
  siteId: string,
  {
    page,
    limit,
    query,
    status,
    sortBy,
  }: {
    page: number;
    limit: number;
    query?: string;
    status?: "draft" | "published" | "archived";
    sortBy?: "updated_at_desc" | "name_asc";
  }
): Promise<{ campaigns: CampaignMetadata[]; totalCount: number }> {
  const cacheKey = `campaigns-meta-${siteId}-p${page}-q${
    query || ""
  }-s${status || ""}-o${sortBy || ""}`;
  const cacheTags = [`campaigns:${siteId}`];

  return cache(
    async () => {
      logger.info(
        `[Cache MISS] Cargando metadatos de campañas para: ${cacheKey}`
      );
      const supabase = createClient();
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
  limit: number = 4
): Promise<Tables<"campaigns">[]> {
  return cache(
    async () => {
      logger.info(
        `[Cache MISS] Cargando campañas recientes para workspace ${workspaceId}.`
      );
      const supabase = createClient();
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
    [`recent-campaigns-${workspaceId}`],
    { tags: [`workspaces:${workspaceId}:recent-campaigns`] }
  )();
}
