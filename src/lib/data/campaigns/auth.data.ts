// src/lib/data/campaigns/auth.data.ts
/**
 * @file auth.data.ts
 * @description Aparato de datos atómico. Responsable de las operaciones de
 *              lectura de bajo nivel para la autorización y permisos de campañas.
 * @author L.I.A Legacy
 * @version 1.0.0
 */
"use server";
import "server-only";

import { unstable_cache as cache } from "next/cache";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import { type CampaignSiteInfo } from "./types";

/**
 * @public
 * @async
 * @function getCampaignSiteInfoById
 * @description Obtiene el `site_id` y `workspace_id` de una campaña para
 *              verificaciones de permisos.
 * @param {string} campaignId - El ID de la campaña.
 * @returns {Promise<CampaignSiteInfo | null>}
 */
export const getCampaignSiteInfoById = (
  campaignId: string
): Promise<CampaignSiteInfo | null> =>
  cache(
    async () => {
      logger.trace({ campaignId }, `[Cache MISS] Info de sitio para campaña.`);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("campaigns")
        .select(`site_id, sites!inner(workspace_id)`)
        .eq("id", campaignId)
        .single();

      const siteInfo = Array.isArray(data?.sites) ? data.sites[0] : data?.sites;

      if (error || !data || !siteInfo) {
        if (error && error.code !== "PGRST116") {
          logger.error({ err: error, campaignId }, `Error al obtener info.`);
        }
        return null;
      }
      return { site_id: data.site_id, workspace_id: siteInfo.workspace_id };
    },
    ["campaign-site-info", campaignId],
    { tags: ["campaigns", `campaign:${campaignId}`] }
  )();
// src/lib/data/campaigns/auth.data.ts
