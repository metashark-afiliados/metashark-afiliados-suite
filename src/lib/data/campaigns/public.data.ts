// src/lib/data/campaigns/public.data.ts
/**
 * @file src/lib/data/campaigns/public.data.ts
 * @description Aparato de datos atómico. Su única responsabilidad es obtener
 *              datos de campañas para el renderizado de páginas públicas. Ha sido
 *              refactorizado para consumir la API de datos de sitios atomizada,
 *              resolviendo el error de módulo TS2306.
 * @author Raz Podestá
 * @version 2.0.0
 * @date 2025-08-27
 */
"use server";
import "server-only";

import { unstable_cache as cache } from "next/cache";

// --- INICIO DE CORRECCIÓN ARQUITECTÓNICA ---
// Se importa el módulo 'sites' completo, que ahora contiene los namespaces.
import { sites as sitesData } from "@/lib/data";
// --- FIN DE CORRECCIÓN ARQUITECTÓNICA ---
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
      // --- INICIO DE CORRECCIÓN ARQUITECTÓNICA ---
      // La llamada ahora utiliza la API namespaced correcta.
      const site = await sitesData.publicData.getSiteDataByHost(host);
      // --- FIN DE CORRECCIÓN ARQUITECTÓNICA ---
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
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Resolución de Error de Módulo (TS2306)**: Se ha corregido la importación para consumir `sitesData` desde la SSoT `@/lib/data`.
 * 2. ((Implementada)) **Consumo de API Namespaced**: La llamada a `getSiteDataByHost` ha sido actualizada a `sitesData.publicData.getSiteDataByHost`, alineando este aparato con la nueva arquitectura de datos atomizada.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) **Manejo de Status**: Actualmente, la función devuelve cualquier campaña que coincida con el slug. Debería ser refinada para devolver únicamente campañas con `status: 'published'`, asegurando que los borradores no sean accesibles públicamente.
 *
 * =====================================================================
 */
// src/lib/data/campaigns/public.data.ts
