// src/lib/data/sites/public.data.ts
/**
 * @file src/lib/data/sites/public.data.ts
 * @description Aparato de datos atómico. Responsable de las operaciones de
 *              lectura de datos de sitios para contextos públicos (resolución de hosts).
 *              Ha sido corregido para exportar correctamente su función,
 *              resolviendo un error de módulo no encontrado (`TS2306`).
 * @author Raz Podestá - MetaShark Tech
 * @version 1.1.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use server";
import "server-only";

import { unstable_cache as cache } from "next/cache";

import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type Tables } from "@/lib/types/database";
import { rootDomain } from "@/lib/utils";

/**
 * @public
 * @async
 * @function getSiteDataByHost
 * @description Obtiene los datos de un sitio basándose en el host de la petición.
 *              Distingue entre subdominios del dominio raíz y dominios personalizados.
 *              La consulta está envuelta en `React.cache` para un rendimiento de élite.
 * @param {string} host - El host de la petición (ej. "mi-sitio.localhost:3000" o "cliente.com").
 * @returns {Promise<Tables<'sites'> | null>} El objeto del sitio o null si no se encuentra.
 */
// --- INICIO DE CORRECCIÓN DE MÓDULO (TS2306) ---
// El snapshot original no exportaba esta función. Al añadir 'export',
// convertimos este archivo en un módulo ES6, permitiendo su importación.
export async function getSiteDataByHost(
  host: string
): Promise<Tables<"sites"> | null> {
  // --- FIN DE CORRECCIÓN DE MÓDULO (TS2306) ---
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

  return cache(
    async (hostToSearch: string) => {
      logger.trace(`[Cache MISS] Buscando sitio para el host: ${hostToSearch}`);
      const supabase = createClient();
      let query = supabase.from("sites").select("*");

      query = isSubdomainRequest
        ? query.eq("subdomain", hostToSearch)
        : query.eq("custom_domain", hostToSearch);

      const { data, error } = await query.single();

      if (error && error.code !== "PGRST116") {
        logger.error(
          `[DataLayer:SitesPublic] Error al obtener sitio por host ${hostToSearch}:`,
          error
        );
        return null;
      }
      return data;
    },
    [cacheKey],
    { revalidate: 3600, tags: cacheTags }
  )(finalHost);
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Resolución de Error de Módulo (`TS2306`)**: La adición de la palabra clave `export` convierte el archivo en un módulo ES6, permitiendo que el futuro manifiesto `sites/index.ts` lo importe correctamente.
 * 2. ((Implementada)) **Lógica de Host Robusta**: La lógica para sanitizar y determinar si un host es un subdominio o un dominio personalizado es robusta y cubre los casos de uso necesarios.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) **Soporte para Mapeo de Rutas (`path-mapping`)**: Para una flexibilidad de élite, se podría añadir lógica para soportar mapeo de rutas (ej. `dominio.com/blog` mapeado a un sitio específico), lo cual requeriría una consulta adicional a una posible tabla de mapeos.
 *
 * =====================================================================
 */
// src/lib/data/sites/public.data.ts
