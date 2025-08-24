// src/lib/data/campaigns/management.data.ts
/**
 * @file src/lib/data/campaigns/management.data.ts
 * @description Aparato de datos atómico. Responsable de las operaciones de lectura
 *              y escritura para la gestión de campañas. Nivelado para incluir una
 *              función de inserción atómica.
 * @author Raz Podestá
 * @version 3.0.0
 */
"use server";

import { unstable_cache as cache } from "next/cache";
import { type SupabaseClient } from "@supabase/supabase-js";

import { logger } from "@/lib/logging";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { type TablesInsert } from "@/lib/types/database";

import { type CampaignMetadata } from "./types";

type Database = import("@/lib/types/database").Database;
type Supabase = SupabaseClient<Database, "public">;

/**
 * @public
 * @async
 * @function getCampaignsMetadataBySiteId
 * @description Obtiene los metadatos paginados y filtrados de las campañas de un sitio.
 * @param {string} siteId - El ID del sitio.
 * @param {object} options - Opciones de paginación y filtro.
 * @param {Supabase} [supabaseClient] - Instancia opcional del cliente Supabase para DI.
 * @returns {Promise<{ campaigns: CampaignMetadata[]; totalCount: number }>}
 */
export async function getCampaignsMetadataBySiteId(
  siteId: string,
  options: {
    page: number;
    limit: number;
    query?: string;
    status?: "draft" | "published" | "archived";
    sortBy?: "updated_at_desc" | "name_asc";
  },
  supabaseClient?: Supabase
): Promise<{ campaigns: CampaignMetadata[]; totalCount: number }> {
  const { page, limit, query, status, sortBy } = options;
  const cacheKey = `campaigns-meta-${siteId}-p${page}-q${
    query || ""
  }-s${status || ""}-o${sortBy || ""}`;
  const cacheTags = [`campaigns:${siteId}`];

  return cache(
    async () => {
      logger.info(
        `[Cache MISS] Cargando metadatos de campañas para: ${cacheKey}`
      );
      const supabase = supabaseClient || createServerClient();
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      let queryBuilder = supabase
        .from("campaigns")
        .select(
          "id, site_id, name, slug, status, created_at, updated_at, affiliate_url",
          { count: "exact" }
        )
        .eq("site_id", siteId);

      if (query) {
        queryBuilder = queryBuilder.or(
          `name.ilike.%${query}%,slug.ilike.%${query}%`
        );
      }
      if (status) {
        queryBuilder = queryBuilder.eq("status", status);
      }

      const sortMap = {
        updated_at_desc: { column: "updated_at", ascending: false },
        name_asc: { column: "name", ascending: true },
      };
      const sort = sortMap[sortBy || "updated_at_desc"];
      queryBuilder = queryBuilder.order(sort.column, {
        ascending: sort.ascending,
        nullsFirst: false,
      });

      const { data, error, count } = await queryBuilder.range(from, to);

      if (error) {
        logger.error(
          `Error al obtener campañas para el sitio ${siteId}:`,
          error
        );
        return { campaigns: [], totalCount: 0 };
      }
      return { campaigns: data as CampaignMetadata[], totalCount: count || 0 };
    },
    [cacheKey],
    { tags: cacheTags }
  )();
}

/**
 * @public
 * @async
 * @function getRecentCampaignsByWorkspaceId
 * @description Obtiene las campañas modificadas más recientemente dentro de un workspace.
 * @param {string} workspaceId - El ID del workspace.
 * @param {number} [limit=4] - El número de campañas a obtener.
 * @param {Supabase} [supabaseClient] - Instancia opcional del cliente Supabase para DI.
 * @returns {Promise<import("@/lib/types/database").Tables<"campaigns">[]>}
 */
export async function getRecentCampaignsByWorkspaceId(
  workspaceId: string,
  limit: number = 4,
  supabaseClient?: Supabase
): Promise<import("@/lib/types/database").Tables<"campaigns">[]> {
  const cacheKey = `recent-campaigns-${workspaceId}`;
  const cacheTags = [`workspaces:${workspaceId}:recent-campaigns`];

  return cache(
    async () => {
      logger.info(
        `[Cache MISS] Cargando campañas recientes para workspace ${workspaceId}.`
      );
      const supabase = supabaseClient || createServerClient();
      const { data: sites, error: sitesError } = await supabase
        .from("sites")
        .select("id")
        .eq("workspace_id", workspaceId);

      if (sitesError || !sites || sites.length === 0) {
        if (sitesError)
          logger.error(
            `Error al obtener sitios para el workspace ${workspaceId}:`,
            sitesError
          );
        return [];
      }
      const siteIds = sites.map((s) => s.id);

      const { data: campaigns, error: campaignsError } = await supabase
        .from("campaigns")
        .select("*")
        .in("site_id", siteIds)
        .order("updated_at", { ascending: false, nullsFirst: false })
        .limit(limit);

      if (campaignsError) {
        logger.error(
          `Error al obtener campañas recientes para el workspace ${workspaceId}:`,
          campaignsError
        );
        return [];
      }
      return campaigns || [];
    },
    [cacheKey],
    { tags: cacheTags }
  )();
}

/**
 * @public
 * @async
 * @function insertCampaignRecord
 * @description Inserta un nuevo registro de campaña en la base de datos.
 * @param {TablesInsert<"campaigns">} campaignPayload - El objeto de datos a insertar.
 * @param {Supabase} [supabaseClient] - Instancia opcional del cliente Supabase para DI.
 * @returns {Promise<{ id: string }>} El ID de la campaña recién creada.
 * @throws {Error} Si la inserción en la base de datos falla.
 */
export async function insertCampaignRecord(
  campaignPayload: TablesInsert<"campaigns">,
  supabaseClient?: Supabase
): Promise<{ id: string }> {
  const supabase = supabaseClient || createServerClient();
  const { data: newCampaign, error } = await supabase
    .from("campaigns")
    .insert(campaignPayload)
    .select("id")
    .single();

  if (error || !newCampaign) {
    logger.error("[DataLayer:Campaigns] Fallo al insertar nuevo registro.", {
      error,
    });
    throw new Error("Fallo en la inserción de la base de datos de campaña.");
  }

  logger.trace(
    "[DataLayer:Campaigns] Nuevo registro de campaña insertado con éxito.",
    { campaignId: newCampaign.id }
  );
  return newCampaign;
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad de Acceso a Datos (SRP)**: ((Implementada)) Se ha añadido la función `insertCampaignRecord`, que encapsula la operación de escritura en la base de datos. Esto desacopla la Server Action de la implementación específica de Supabase, mejorando la mantenibilidad.
 * 2. **Inyección de Dependencias**: ((Vigente)) Todas las funciones aceptan un `supabaseClient` opcional, lo que las hace testeables y reutilizables.
 * 3. **Documentación TSDoc de Élite**: ((Implementada)) Se ha añadido documentación verbosa a la nueva función.
 *
 * @subsection Melhorias Futuras
 * 1. **Transacciones RPC**: ((Vigente)) Para operaciones más complejas que impliquen múltiples escrituras (ej. crear campaña y actualizar contador de sitios), se deberían usar funciones RPC de PostgreSQL para garantizar la atomicidad transaccional a nivel de base de datos.
 *
 * =====================================================================
 */
// src/lib/data/campaigns/management.data.ts
