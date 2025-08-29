/**
 * @file src/lib/data/campaigns/management.data.ts
 * @description Aparato de datos atómico. Responsable de las operaciones de lectura
 *              y escritura para la gestión de campañas. Ha sido refactorizado holísticamente
 *              para manejar correctamente los tipos de retorno de las relaciones de Supabase,
 *              restaurar la función `getRecentCampaignsByWorkspaceId`, y corregir la API de `React.cache`.
 * @author Raz Podestá - MetaShark Tech
 * @version 5.1.0
 * @date 2025-08-29
 */
"use server";
import "server-only";

import { cache } from "react";
import { type SupabaseClient } from "@supabase/supabase-js";

import { logger } from "@/lib/logging";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { type Tables, type TablesInsert } from "@/lib/types/database";

import { type CampaignMetadata, type CampaignSiteInfo } from "./types";

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
    logger.error(`Error al obtener campañas para el sitio ${siteId}:`, error);
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
          `[DataLayer:Campaigns] Error al obtener info de sitio para campaña ${campaignId}:`,
          error
        );
      }
      return null;
    }

    return {
      site_id: data.site_id,
      workspace_id: siteInfo.workspace_id,
    };
  }
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
        `[DataLayer:Campaigns] Error al obtener campañas recientes para workspace ${workspaceId}:`,
        error
      );
      return [];
    }
    return data || [];
  }
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
    logger.error("[DataLayer:Campaigns] Fallo al insertar nuevo registro.", {
      error,
    });
    throw new Error("Fallo en la inserción de la base de datos de campaña.");
  }

  logger.trace(
    "[DataLayer:Campaigns] Nuevo registro de campaña insertado con éxito.",
    { campaignId: newCampaign.id }
  );
  return newCampaign;
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Vista Materializada para `recent_campaigns`**: ((Vigente)) Para un rendimiento de élite a gran escala, se podría crear una vista materializada en la base de datos que pre-calcule las campañas recientes por workspace, y esta función consultaría esa vista.
 *
 * =====================================================================
 */
