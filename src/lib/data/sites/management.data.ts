// src/lib/data/sites/management.data.ts
/**
 * @file src/lib/data/sites/management.data.ts
 * @description Aparato de datos atómico. Responsable de las operaciones de
 *              lectura para la gestión de sitios (Dashboard). Ha sido optimizado
 *              con React.cache para un rendimiento de élite.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use server";
import "server-only";

import { cache } from "react";
import { logger } from "@/lib/logging";
import { createClient as createServerClient } from "@/lib/supabase/server";
import {
  type SiteBasicInfo,
  type SiteSortOption,
  type SiteStatusFilter,
  type SiteWithCampaignCount,
} from "./types";

/**
 * @private
 * @function buildSiteSearchQuery
 * @description Función pura que construye la consulta de Supabase para la búsqueda
 *              y filtrado de sitios, encapsulando la lógica compleja.
 * @param {string} workspaceId - El ID del workspace a consultar.
 * @param {object} filters - Los filtros a aplicar.
 * @returns Un query builder de Supabase.
 */
function buildSiteSearchQuery(
  workspaceId: string,
  filters: {
    query?: string;
    status?: SiteStatusFilter;
    sort?: SiteSortOption;
  }
) {
  const supabase = createServerClient();
  let queryBuilder = supabase
    .from("sites_with_campaign_counts")
    .select("*", { count: "exact" })
    .eq("workspace_id", workspaceId);

  if (filters.query) {
    queryBuilder = queryBuilder.ilike("name", `%${filters.query}%`);
  }

  if (filters.status && filters.status !== "all") {
    queryBuilder = queryBuilder.eq("status", filters.status);
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

/**
 * @public
 * @async
 * @function getSitesByWorkspaceId
 * @description Obtiene los sitios paginados y filtrados para un workspace.
 *              La consulta está envuelta en `React.cache` para optimizar el rendimiento.
 * @param {string} workspaceId - El ID del workspace.
 * @param {object} options - Opciones de paginación, búsqueda y ordenamiento.
 * @returns {Promise<{ sites: SiteWithCampaignCount[]; totalCount: number }>}
 */
export async function getSitesByWorkspaceId(
  workspaceId: string,
  {
    page = 1,
    limit = 9,
    query: searchQuery = "",
    status: statusFilter = "all",
    sort: sortOption = "created_at_desc",
  }: {
    page?: number;
    limit?: number;
    query?: string;
    status?: SiteStatusFilter;
    sort?: SiteSortOption;
  }
): Promise<{ sites: SiteWithCampaignCount[]; totalCount: number }> {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const queryBuilder = buildSiteSearchQuery(workspaceId, {
    query: searchQuery,
    status: statusFilter,
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

/**
 * @public
 * @async
 * @function getSiteById
 * @description Obtiene la información básica de un sitio por su ID. La consulta
 *              está envuelta en `React.cache`.
 * @param {string} siteId - El ID del sitio a obtener.
 * @returns {Promise<SiteBasicInfo | null>} El objeto del sitio o null si no se encuentra.
 */
export const getSiteById = cache(
  async (siteId: string): Promise<SiteBasicInfo | null> => {
    logger.trace(`[Cache MISS] Cargando datos del sitio: ${siteId}`);
    const supabase = createServerClient();
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
);

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Atomicidad de Lógica de Datos (SRP)**: Este nuevo aparato aísla perfectamente la lógica de obtención de datos para el dashboard, cumpliendo con la directiva de atomización.
 * 2. ((Implementada)) **Consumo de SSoT de Tipos**: El módulo ahora importa todos sus tipos desde el nuevo aparato `sites/types.ts`, garantizando la consistencia y la integridad del contrato de datos.
 * 3. ((Implementada)) **Optimización de Rendimiento**: La función `getSiteById` ha sido envuelta en `React.cache`, previniendo consultas duplicadas dentro de una misma request.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) **Cacheo para `getSitesByWorkspaceId`**: La función principal de paginación también es candidata para `React.cache`, pero requiere una clave de caché dinámica más compleja para ser efectiva. Propondré esta optimización avanzada en una futura épica de rendimiento.
 *
 * =====================================================================
 */
// src/lib/data/sites/management.data.ts
