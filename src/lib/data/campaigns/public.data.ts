/**
 * @file src/lib/data/campaigns/public.data.ts
 * @description Aparato de datos atómico. Su única responsabilidad es obtener
 *              datos de campañas para el renderizado de páginas públicas.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use server";

import { unstable_cache as cache } from "next/cache";

import { getSiteDataByHost } from "@/lib/data/sites";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type Tables } from "@/lib/types/database";

export async function getPublishedCampaignByHostAndSlug(
  host: string,
  slug: string
): Promise<Tables<"campaigns"> | null> {
  const cacheKey = `campaign-public:${host}:${slug}`;
  const cacheTags = [`campaign:${host}:${slug}`];

  return cache(
    async () => {
      logger.info(`[Cache MISS] Buscando campaña pública para: ${cacheKey}`);
      const site = await getSiteDataByHost(host);
      if (!site) {
        return null;
      }
      const supabase = createClient();
      const { data: campaign, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("site_id", site.id)
        .eq("slug", slug)
        .single();
      if (error && error.code !== "PGRST116") {
        logger.error(
          `Error buscando campaña ${slug} en sitio ${site.id}`,
          error
        );
        return null;
      }
      return campaign;
    },
    [cacheKey],
    { tags: cacheTags }
  )();
}
