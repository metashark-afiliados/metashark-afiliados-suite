// src/lib/data/campaigns/management.data.ts
/**
 * @file src/lib/data/campaigns/management.data.ts
 * @description Aparato de datos atómico. Responsable de las operaciones de lectura
 *              y escritura para la gestión de campañas. Ha sido refactorizado para
 *              manejar correctamente el tipo de retorno de la relación `sites`,
 *              resolviendo el error de tipo TS2339.
 * @author Raz Podestá
 * @version 3.2.0
 * @date 2025-08-27
 */
"use server";
import "server-only";

import { cache } from "react";
import { type SupabaseClient } from "@supabase/supabase-js";

import { logger } from "@/lib/logging";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { type TablesInsert } from "@/lib/types/database";

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
      .select(`site_id, sites (workspace_id)`)
      .eq("id", campaignId)
      .single();

    // --- INICIO DE CORRECCIÓN DE TIPO (TS2339) ---
    // La relación `sites` devuelve un array. Accedemos al primer elemento.
    const siteInfo = data?.sites?.[0];

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
    // --- FIN DE CORRECCIÓN DE TIPO (TS2339) ---
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
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Resolución de Error de Tipo (`TS2339`)**: Se ha corregido la lógica para acceder a `data.sites[0]` y se ha añadido una verificación de existencia (`!siteInfo`), resolviendo el error de compilación de forma robusta.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) **Tipos Derivados de Consulta**: Para una seguridad de tipos de élite, el tipo de `data` podría ser inferido directamente de la consulta de Supabase, eliminando la necesidad de manejar manualmente la diferencia entre objeto y array.
 *
 * =====================================================================
 */
// src/lib/data/campaigns/management.data.ts
