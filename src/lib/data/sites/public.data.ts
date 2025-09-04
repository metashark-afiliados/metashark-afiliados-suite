// src/lib/data/sites/public.data.ts
/**
 * @file src/lib/data/sites/public.data.ts
 * @description Aparato de datos atómico. Responsable de las operaciones de
 *              lectura de datos de sitios para contextos públicos. Refactorizado
 *              para implementar correctamente el patrón de `React.cache` y
 *              alinear el logging con la firma canónica.
 * @author L.I.A. Legacy
 * @version 3.0.0
 * @see .docs-espejo/lib/data/sites/public.data.ts.md
 */
"use server";
import "server-only";

import { unstable_cache as cache } from "next/cache";

import { rootDomain } from "@/config/site.config";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import { type Tables } from "@/lib/types/database";

/**
 * @public
 * @async
 * @function getSiteDataByHost
 * @description Obtiene los datos de un sitio basándose en el host de la petición.
 *              Esta función está optimizada con `React.cache` para un rendimiento de élite.
 * @param {string} host - El host de la petición (ej. "mi-sitio.localhost:3000").
 * @returns {Promise<Tables<'sites'> | null>} El objeto del sitio o null.
 */
export async function getSiteDataByHost(
  host: string
): Promise<Tables<"sites"> | null> {
  const sanitizedHost = host.toLowerCase().replace(/^www\./, "");
  const rootDomainWithoutPort = rootDomain.split(":")[0];

  const isSubdomainRequest =
    sanitizedHost.endsWith(`.${rootDomainWithoutPort}`) &&
    sanitizedHost !== rootDomainWithoutPort;

  const finalHost = isSubdomainRequest
    ? sanitizedHost.replace(`.${rootDomainWithoutPort}`, "")
    : sanitizedHost;

  const cacheKey = `site-data-host-${finalHost}`;
  const cacheTags = [`sites:host:${finalHost}`];
  const context = { host, finalHost, isSubdomainRequest };

  return cache(
    async (hostToQuery: string) => {
      logger.trace(context, "[Cache MISS] Buscando sitio por host.");
      const supabase = createClient();
      let query = supabase.from("sites").select("*");

      query = isSubdomainRequest
        ? query.eq("subdomain", hostToQuery)
        : query.eq("custom_domain", hostToQuery);

      const { data, error } = await query.single();

      if (error && error.code !== "PGRST116") {
        logger.error(
          { err: error, ...context },
          "[DataLayer:PublicSites] Error al obtener sitio por host."
        );
        return null;
      }
      return data;
    },
    [cacheKey],
    { revalidate: 3600, tags: cacheTags }
  )(finalHost);
}
// src/lib/data/sites/public.data.ts
