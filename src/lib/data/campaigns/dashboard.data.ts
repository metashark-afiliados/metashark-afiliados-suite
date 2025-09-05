// src/lib/data/campaigns/dashboard.data.ts
/**
 * @file dashboard.data.ts
 * @description Aparato de datos atómico. Responsable de las operaciones de
 *              lectura para el dashboard. Refactorizado para transformar
 *              correctamente el payload para la cláusula `.in()` de Supabase,
 *              resolviendo el error de tipo TS2322.
 * @author L.I.A Legacy
 * @version 5.0.0
 * @see .docs-espejo/lib/data/campaigns/dashboard.data.ts.md
 */
"use server";
import "server-only";

import { unstable_cache as cache } from "next/cache";

import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import { type Tables } from "@/lib/types/database";
import { type RecentCampaign } from "./types";

type RawRecentCampaignData = Pick<
  Tables<"campaigns">,
  | "id"
  | "name"
  | "updated_at"
  | "created_at"
  | "creation_id"
  | "site_id"
  | "status_id"
> & {
  campaign_statuses: { name: string }[] | null;
};

export const getRecentCampaignsByWorkspaceId = (
  workspaceId: string,
  limit: number
): Promise<RecentCampaign[]> =>
  cache(
    async () => {
      const context = { workspaceId, limit };
      logger.trace(context, "[Cache MISS] Cargando campañas recientes.");
      const supabase = createClient();
      try {
        const { data, error } = await supabase
          .from("campaigns")
          .select(
            `
            id, name, updated_at, created_at, creation_id, site_id, status_id,
            campaign_statuses ( name ),
            sites!inner(workspace_id)
          `
          )
          .eq("sites.workspace_id", workspaceId)
          .order("updated_at", { ascending: false, nullsFirst: false })
          .limit(limit);

        if (error) throw error;

        return (
          (data?.map((c) => {
            const raw = c as unknown as RawRecentCampaignData;
            return {
              ...raw,
              status: raw.campaign_statuses?.[0]?.name || "unknown",
            };
          }) as RecentCampaign[]) || []
        );
      } catch (error) {
        logger.error(
          { err: error as Error, ...context },
          "[DataLayer:Dashboard] Error al obtener campañas recientes."
        );
        return [];
      }
    },
    ["recent-campaigns-by-workspace", workspaceId, limit],
    { tags: ["campaigns", `workspace:${workspaceId}`] }
  )();

export async function getPublishedCampaignsCountByWorkspace(
  workspaceId: string
): Promise<{ count: number }> {
  const context = { workspaceId };
  logger.trace(
    context,
    "[DataLayer:Dashboard] Iniciando conteo de campañas publicadas."
  );
  const supabase = createClient();
  try {
    const { data: siteIds, error: siteError } = await supabase
      .from("sites")
      .select("id")
      .eq("workspace_id", workspaceId);
    if (siteError) throw siteError;
    if (siteIds.length === 0) return { count: 0 };

    const { count, error: countError } = await supabase
      .from("campaigns")
      .select("id", { count: "exact", head: true })
      .in(
        "site_id",
        siteIds.map((s) => s.id)
      )
      .eq("status_id", 2);

    if (countError) throw countError;

    return { count: count || 0 };
  } catch (error) {
    logger.error(
      { err: error as Error, ...context },
      "[DataLayer:Dashboard] Error al contar campañas publicadas."
    );
    return { count: 0 };
  }
}
// src/lib/data/campaigns/dashboard.data.ts
