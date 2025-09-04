// src/lib/data/campaigns/dashboard.data.ts
/**
 * @file dashboard.data.ts
 * @description Aparato de datos atómico. Responsable de las operaciones de
 *              lectura para los componentes del dashboard principal.
 * @author L.I.A Legacy
 * @version 1.0.0
 */
"use server";
import "server-only";

import { unstable_cache as cache } from "next/cache";
import { type SupabaseClient } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import { type Database, type Tables } from "@/lib/types/database";

type Supabase = SupabaseClient<Database, "public">;

/**
 * @public
 * @async
 * @function getRecentCampaignsByWorkspaceId
 * @description Obtiene las campañas modificadas más recientemente para un workspace.
 * @param {string} workspaceId - El ID del workspace.
 * @param {number} limit - El número de campañas a obtener.
 * @param {Supabase} [supabaseClient] - Instancia opcional de Supabase.
 * @returns {Promise<Pick<Tables<'campaigns'>, ...>[]>}
 */
export const getRecentCampaignsByWorkspaceId = (
  workspaceId: string,
  limit: number,
  supabaseClient?: Supabase
): Promise<
  Pick<
    Tables<"campaigns">,
    "id" | "name" | "updated_at" | "created_at" | "creation_id"
  >[]
> =>
  cache(
    async () => {
      const supabase = supabaseClient || createClient();
      logger.trace({ workspaceId, limit }, `[Cache MISS] Campañas recientes.`);
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
          { err: error, workspaceId },
          `Error al obtener recientes.`
        );
        return [];
      }
      return data || [];
    },
    ["recent-campaigns-by-workspace", workspaceId, limit],
    { tags: ["campaigns", `workspace:${workspaceId}`] }
  )();

/**
 * @public
 * @async
 * @function getPublishedCampaignsCountByWorkspace
 * @description Obtiene el conteo de campañas publicadas para un workspace.
 * @param {string} workspaceId - El ID del workspace.
 * @returns {Promise<{ count: number }>}
 */
export async function getPublishedCampaignsCountByWorkspace(
  workspaceId: string
): Promise<{ count: number }> {
  const supabase = createClient();
  const { data: siteIds, error: siteError } = await supabase
    .from("sites")
    .select("id")
    .eq("workspace_id", workspaceId);
  if (siteError || !siteIds) {
    logger.error({ err: siteError, workspaceId }, `Error al obtener sitios.`);
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
    .eq("status_id", 2); // 2 = 'published'
  if (error) {
    logger.error({ err: error, workspaceId }, `Error al contar publicadas.`);
    return { count: 0 };
  }
  return { count: count || 0 };
}
// src/lib/data/campaigns/dashboard.data.ts
