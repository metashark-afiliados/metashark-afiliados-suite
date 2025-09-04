// src/lib/data/campaigns/public.data.ts
/**
 * @file src/lib/data/campaigns/public.data.ts
 * @description Aparato de datos atómico. Su única responsabilidad es obtener
 *              datos de campañas para el renderizado de páginas públicas. Ha sido
 *              refactorizado para alinearse con la firma de logging canónica.
 * @author L.I.A. Legacy
 * @version 3.0.0
 * @see .docs-espejo/lib/data/campaigns/public.data.ts.md
 */
"use server";
import "server-only";

import { unstable_cache as cache } from "next/cache";

import { sites as sitesData } from "@/lib/data";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import { type Tables } from "@/lib/types/database";

/**
 * @public
 * @async
 * @function getPublishedCampaignByHostAndSlug
 * @description Obtiene los datos de una campaña publicada, identificada por el
 *              host de la petición y su slug. Esta función está optimizada para
 *              el rendimiento mediante el uso de `React.cache`.
 * @param {string} host - El host de la petición (ej. "mi-sitio.convertikit.dev").
 * @param {string} slug - El slug de la campaña.
 * @returns {Promise<Tables<'campaigns'> | null>} El objeto de la campaña si se
 *          encuentra y está publicada, de lo contrario `null`.
 */
export async function getPublishedCampaignByHostAndSlug(
  host: string,
  slug: string
): Promise<Tables<"campaigns"> | null> {
  const cacheKey = `campaign-public:${host}:${slug}`;
  const cacheTags = [`campaign:${host}:${slug}`];
  const context = { host, slug };

  return cache(
    async () => {
      logger.info(
        context,
        `[Cache MISS] Buscando campaña pública para: ${cacheKey}`
      );

      const site = await sitesData.publicData.getSiteDataByHost(host);
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
          { err: error, ...context, siteId: site.id },
          `[DataLayer:PublicCampaigns] Error buscando campaña.`
        );
        return null;
      }
      return campaign;
    },
    [cacheKey],
    { tags: cacheTags }
  )();
}

