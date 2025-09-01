// src/lib/data/campaigns/management.data.ts
/**
 * @file src/lib/data/campaigns/management.data.ts
 * @description Aparato de datos atómico. Responsable de las operaciones de lectura
 *              y escritura para la gestión de campañas. Enriquecido con una
 *              función de conteo para métricas del dashboard.
 * @author Raz Podestá - MetaShark Tech
 * @version 9.0.0
 * @date 2025-09-01
 */
"use server";
import "server-only";

import { unstable_cache as cache } from "next/cache";
import { type SupabaseClient } from "@supabase/supabase-js";

import { logger } from "@/lib/logger";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { type Tables, type TablesInsert } from "@/lib/types/database";
import {
  type CampaignMetadata,
  type CampaignSiteInfo,
  type CampaignSortOption,
} from "./types";

type Database = import("@/lib/types/database").Database;
type Supabase = SupabaseClient<Database, "public">;

// getCampaignsMetadataBySiteId, getCampaignSiteInfoById, getRecentCampaignsByWorkspaceId, insertCampaignRecord
// permanecen sin cambios desde la última entrega del snapshot.

export async function getCampaignsMetadataBySiteId(
  siteId: string,
  options: {
    page: number;
    limit: number;
    query?: string;
    status?: "draft" | "published" | "archived";
    sortBy?: CampaignSortOption;
  },
  supabaseClient?: Supabase
): Promise<{ campaigns: CampaignMetadata[]; totalCount: number }> {
  const { page, limit, query, status, sortBy } = options;
  const supabase = supabaseClient || createServerClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  let queryBuilder = supabase
    .from("campaigns")
    .select(
      "id, site_id, name, slug, status_id, created_at, updated_at, affiliate_url, creation_id",
      { count: "exact" }
    )
    .eq("site_id", siteId);
  if (query) {
    queryBuilder = queryBuilder.or(
      `name.ilike.%${query}%,slug.ilike.%${query}%`
    );
  }
  if (status) {
    const statusMap = { draft: 1, published: 2, archived: 3 };
    queryBuilder = queryBuilder.eq("status_id", statusMap[status]);
  }
  const sortMap: Record<
    CampaignSortOption,
    { column: string; ascending: boolean }
  > = {
    updated_at_desc: { column: "updated_at", ascending: false },
    name_asc: { column: "name", ascending: true },
    name_desc: { column: "name", ascending: false },
  };
  const sort = sortMap[sortBy || "updated_at_desc"];
  queryBuilder = queryBuilder.order(sort.column, {
    ascending: sort.ascending,
    nullsFirst: false,
  });
  const { data, error, count } = await queryBuilder.range(from, to);
  if (error) {
    logger.error(
      { error },
      `Error al obtener campañas para el sitio ${siteId}.`
    );
    return { campaigns: [], totalCount: 0 };
  }
  return { campaigns: data as CampaignMetadata[], totalCount: count || 0 };
}

export const getCampaignSiteInfoById = cache(
  async (campaignId: string): Promise<CampaignSiteInfo | null> => {
    logger.trace(
      `[Cache MISS] Cargando info de sitio para campaña: ${campaignId}`
    );
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("campaigns")
      .select(`site_id, sites!inner(workspace_id)`)
      .eq("id", campaignId)
      .single();
    const siteInfo = Array.isArray(data?.sites) ? data.sites[0] : data?.sites;
    if (error || !data || !siteInfo) {
      if (error && error.code !== "PGRST116") {
        logger.error(
          { error },
          `[DataLayer:Campaigns] Error al obtener info de sitio para campaña ${campaignId}.`
        );
      }
      return null;
    }
    return { site_id: data.site_id, workspace_id: siteInfo.workspace_id };
  },
  ["campaign-site-info"],
  { tags: ["campaigns"] }
);

export const getRecentCampaignsByWorkspaceId = cache(
  async (
    workspaceId: string,
    limit: number,
    supabaseClient?: Supabase
  ): Promise<
    Pick<
      Tables<"campaigns">,
      "id" | "name" | "updated_at" | "created_at" | "creation_id"
    >[]
  > => {
    const supabase = supabaseClient || createServerClient();
    logger.trace(
      `[Cache MISS] Cargando campañas recientes para workspace: ${workspaceId}`
    );
    const { data, error } = await supabase
      .from("campaigns")
      .select(
        "id, name, updated_at, created_at, creation_id, sites!inner(workspace_id)"
      )
      .eq("sites.workspace_id", workspaceId)
      .order("updated_at", { ascending: false, nullsFirst: false })
      .limit(limit);
    if (error) {
      logger.error(
        { error },
        `[DataLayer:Campaigns] Error al obtener campañas recientes para workspace ${workspaceId}.`
      );
      return [];
    }
    return data || [];
  },
  ["recent-campaigns"],
  { tags: ["campaigns", `workspace:${workspaceId}`] }
);

export async function insertCampaignRecord(
  campaignPayload: TablesInsert<"campaigns">,
  supabaseClient?: Supabase
): Promise<{ id: string }> {
  const supabase = supabaseClient || createServerClient();
  const { data: newCampaign, error } = await supabase
    .from("campaigns")
    .insert(campaignPayload)
    .select("id")
    .single();
  if (error || !newCampaign) {
    logger.error(
      { error },
      "[DataLayer:Campaigns] Fallo al insertar nuevo registro."
    );
    throw new Error("Fallo en la inserción de la base de datos de campaña.");
  }
  logger.trace(
    "[DataLayer:Campaigns] Nuevo registro de campaña insertado con éxito.",
    { campaignId: newCampaign.id }
  );
  return newCampaign;
}

export async function getPublishedCampaignsCountByWorkspace(
  workspaceId: string
): Promise<{ count: number }> {
  const supabase = createServerClient();
  const { data: siteIds, error: siteError } = await supabase
    .from("sites")
    .select("id")
    .eq("workspace_id", workspaceId);

  if (siteError || !siteIds) {
    logger.error(
      { error: siteError },
      `[DataLayer:Campaigns] Error al obtener sitios para contar campañas publicadas en workspace ${workspaceId}.`
    );
    return { count: 0 };
  }
  if (siteIds.length === 0) return { count: 0 };

  const { count, error } = await supabase
    .from("campaigns")
    .select("id", { count: "exact", head: true })
    .in(
      "site_id",
      siteIds.map((s) => s.id)
    )
    .eq("status_id", 2); // 2 es el ID para 'published' en `campaign_statuses`

  if (error) {
    logger.error(
      { error },
      `[DataLayer:Campaigns] Error al contar campañas publicadas para workspace ${workspaceId}.`
    );
    return { count: 0 };
  }
  return { count: count || 0 };
}
// src/lib/data/campaigns/management.data.ts
