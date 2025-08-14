/**
 * @file src/lib/data/sites.ts
 * @description Aparato de datos para la entidad 'sites'. Esta es la Única Fuente de
 *              Verdad para interactuar con las tablas `sites` y la vista
 *              `sites_with_campaign_counts`. El contrato `SiteBasicInfo` ha sido
 *              enriquecido para incluir la propiedad `name`, resolviendo una
 *              desincronización de tipos crítica.
 * @author L.I.A. Legacy
 * @version 1.1.0
 */
"use server";

import { unstable_cache as cache } from "next/cache";

import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type Tables } from "@/lib/types/database";
import { rootDomain } from "@/lib/utils";

export type SiteWithCampaignCount = Tables<"sites"> & {
  campaign_count: number;
};

export type SiteBasicInfo = Pick<
  Tables<"sites">,
  "id" | "subdomain" | "workspace_id" | "name"
>;

export type SiteSortOption = "created_at_desc" | "name_asc" | "name_desc";

function buildSiteSearchQuery(
  workspaceId: string,
  filters: { query?: string; sort?: SiteSortOption }
) {
  const supabase = createClient();
  let queryBuilder = supabase
    .from("sites_with_campaign_counts")
    .select("*", { count: "exact" })
    .eq("workspace_id", workspaceId);

  if (filters.query) {
    queryBuilder = queryBuilder.ilike("subdomain", `%${filters.query}%`);
  }

  const sortMap: Record<
    SiteSortOption,
    { column: string; ascending: boolean }
  > = {
    created_at_desc: { column: "created_at", ascending: false },
    name_asc: { column: "name", ascending: true },
    name_desc: { column: "name", ascending: false },
  };
  const sort = sortMap[filters.sort || "created_at_desc"];
  queryBuilder = queryBuilder.order(sort.column, {
    ascending: sort.ascending,
  });

  return queryBuilder;
}

export async function getSitesByWorkspaceId(
  workspaceId: string,
  {
    page = 1,
    limit = 9,
    query: searchQuery = "",
    sort: sortOption = "created_at_desc",
  }: {
    page?: number;
    limit?: number;
    query?: string;
    sort?: SiteSortOption;
  }
): Promise<{ sites: SiteWithCampaignCount[]; totalCount: number }> {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const queryBuilder = buildSiteSearchQuery(workspaceId, {
    query: searchQuery,
    sort: sortOption,
  });

  const { data, error, count } = await queryBuilder.range(from, to);

  if (error) {
    logger.error(
      `[DataLayer:Sites] Error al obtener sitios para workspace ${workspaceId}:`,
      error
    );
    throw new Error("No se pudieron obtener los sitios del workspace.");
  }

  return {
    sites: (data as SiteWithCampaignCount[]) || [],
    totalCount: count || 0,
  };
}

export async function getSiteById(
  siteId: string
): Promise<SiteBasicInfo | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("sites")
    .select("id, subdomain, workspace_id, name")
    .eq("id", siteId)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      logger.error(
        `[DataLayer:Sites] Error al obtener el sitio ${siteId}:`,
        error
      );
    }
    return null;
  }
  return data;
}

export async function getSiteDataByHost(
  host: string
): Promise<Tables<"sites"> | null> {
  const sanitizedHost = host.toLowerCase().replace(/^www\./, "");
  const rootDomainWithoutPort = rootDomain.split(":")[0];

  const isSubdomainOfRoot =
    sanitizedHost.endsWith(`.${rootDomainWithoutPort}`) &&
    sanitizedHost !== rootDomainWithoutPort;
  const isLikelySlug = !sanitizedHost.includes(".");
  const isSubdomain = isSubdomainOfRoot || isLikelySlug;

  const finalHost = isSubdomainOfRoot
    ? sanitizedHost.replace(`.${rootDomainWithoutPort}`, "")
    : sanitizedHost;

  return cache(
    async (hostToSearch: string) => {
      logger.trace(`[Cache MISS] Buscando sitio para el host: ${hostToSearch}`);
      const supabase = createClient();
      let query = supabase.from("sites").select("*");
      query = isSubdomain
        ? query.eq("subdomain", hostToSearch)
        : query.eq("custom_domain", hostToSearch);

      const { data, error } = await query.single();

      if (error && error.code !== "PGRST116") {
        logger.error(
          `[DataLayer:Sites] Error al obtener sitio por host ${hostToSearch}:`,
          error
        );
        return null;
      }
      return data;
    },
    [`site-data-host-${finalHost}`],
    { revalidate: 3600, tags: [`sites:host:${finalHost}`] }
  )(finalHost);
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Contrato**: ((Implementada)) El tipo `SiteBasicInfo` y la consulta `getSiteById` han sido enriquecidos para incluir el campo `name`, resolviendo el error `TS2339` en `campaigns-page-loader`.
 *
 * @subsection Melhorias Futuras
 * 1. **Cacheo con `React.cache`**: ((Vigente)) Las funciones de lectura en este archivo son candidatas ideales para ser envueltas en `React.cache`.
 *
 * =====================================================================
 */
// src/lib/data/sites.ts
