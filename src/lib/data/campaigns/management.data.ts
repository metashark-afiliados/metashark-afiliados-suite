// src/lib/data/campaigns/management.data.ts
/**
 * @file management.data.ts
 * @description Aparato de datos atómico. Responsable de las operaciones de
 *              lectura para la gestión de campañas. Refactorizado para utilizar
 *              un tipado intermedio robusto, eliminando castings inseguros y
 *              resolviendo el error TS2352 al manejar correctamente la respuesta
 *              de JOIN de Supabase como un array.
 * @author L.I.A Legacy
 * @version 2.2.0
 */
"use server";
import "server-only";

import { type SupabaseClient } from "@supabase/supabase-js";
import { requireWorkspacePermission } from "@/lib/auth/user-permissions";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import { type Database, type Tables } from "@/lib/types/database";
import {
  type CampaignMetadata,
  type CampaignSortOption,
  type CampaignStatusFilter,
} from "./types";

type Supabase = SupabaseClient<Database, "public">;

// ANÁLISIS DE CÓDIGO: El tipo intermedio ahora modela correctamente la respuesta de Supabase,
// donde el JOIN a `campaign_statuses` devuelve un ARRAY de objetos.
type RawCampaignData = Tables<"campaigns"> & {
  campaign_statuses: { name: string }[] | null;
  sites?: { workspace_id: string } | null; // Opcional para getCampaignMetadataById
};

/**
 * @private
 * @function buildCampaignsQuery
 * @description Construye la consulta de Supabase para obtener metadatos de campañas con filtros y ordenamiento.
 * @param {string} siteId - El ID del sitio.
 * @param {object} filters - Los filtros a aplicar.
 * @returns Un query builder de Supabase.
 */
function buildCampaignsQuery(
  siteId: string,
  filters: {
    query?: string;
    status?: CampaignStatusFilter;
    sortBy?: CampaignSortOption;
  }
) {
  const supabase = createClient();
  let queryBuilder = supabase
    .from("campaigns")
    .select(
      `
      id, site_id, name, slug, status_id, created_at, updated_at, affiliate_url, creation_id,
      campaign_statuses ( name )
    `,
      { count: "exact" }
    )
    .eq("site_id", siteId);

  if (filters.query) {
    queryBuilder = queryBuilder.or(
      `name.ilike.%${filters.query}%,slug.ilike.%${filters.query}%`
    );
  }

  if (filters.status && filters.status !== "all") {
    const statusMap = { draft: 1, published: 2, archived: 3 };
    queryBuilder = queryBuilder.eq("status_id", statusMap[filters.status]);
  }

  const sortMap: Record<
    CampaignSortOption,
    { column: string; ascending: boolean }
  > = {
    updated_at_desc: { column: "updated_at", ascending: false },
    name_asc: { column: "name", ascending: true },
    name_desc: { column: "name", ascending: false },
  };
  const sort = sortMap[filters.sortBy || "updated_at_desc"];
  queryBuilder = queryBuilder.order(sort.column, {
    ascending: sort.ascending,
    nullsFirst: false,
  });

  return queryBuilder;
}

/**
 * @public
 * @async
 * @function getCampaignsMetadataBySiteId
 * @description Obtiene una lista paginada de metadatos de campañas para un sitio específico.
 * @param {string} siteId - El ID del sitio para el que se obtienen las campañas.
 * @param {object} options - Opciones de paginación, filtrado y ordenamiento.
 * @returns {Promise<{ campaigns: CampaignMetadata[]; totalCount: number }>} Un objeto con las campañas y el conteo total.
 * @throws {Error} Si la consulta a la base de datos falla.
 */
export async function getCampaignsMetadataBySiteId(
  siteId: string,
  options: {
    page: number;
    limit: number;
    query?: string;
    status?: CampaignStatusFilter;
    sortBy?: CampaignSortOption;
  }
): Promise<{ campaigns: CampaignMetadata[]; totalCount: number }> {
  const { page, limit, query, status, sortBy } = options;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const queryBuilder = buildCampaignsQuery(siteId, { query, status, sortBy });
  try {
    const { data, error, count } = await queryBuilder.range(from, to);

    if (error) throw error;

    // ANÁLISIS DE CÓDIGO: La transformación ahora accede de forma segura al primer elemento del array.
    const campaigns: CampaignMetadata[] = (data as RawCampaignData[]).map(
      (c) => ({
        ...c,
        status: c.campaign_statuses?.[0]?.name || "unknown",
      })
    );

    return { campaigns, totalCount: count || 0 };
  } catch (error) {
    logger.error(
      { err: error, siteId },
      "Error al obtener metadatos de campañas por ID de sitio."
    );
    throw new Error("No se pudieron obtener las campañas.");
  }
}

/**
 * @public
 * @async
 * @function getCampaignMetadataById
 * @description Obtiene los metadatos de una campaña específica por su ID, validando permisos.
 * @param {string} campaignId - El ID de la campaña a obtener.
 * @param {string} userId - El ID del usuario que solicita.
 * @returns {Promise<CampaignMetadata | null>} Los metadatos de la campaña o null.
 * @throws {Error} Si la consulta a la base de datos falla.
 */
export async function getCampaignMetadataById(
  campaignId: string,
  userId: string
): Promise<CampaignMetadata | null> {
  const context = { campaignId, userId };
  logger.trace(
    context,
    "[DataLayer:Campaigns] Obteniendo metadatos de campaña por ID."
  );
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("campaigns")
      .select(`*, sites!inner(workspace_id), campaign_statuses ( name )`)
      .eq("id", campaignId)
      .single();

    if (error) {
      if (error.code !== "PGRST116") throw error;
      return null;
    }

    const workspaceId = data.sites?.workspace_id;
    if (!workspaceId) return null;

    const permissionCheck = await requireWorkspacePermission(workspaceId, [
      "owner",
      "admin",
      "member",
    ]);
    if (!permissionCheck.success) return null;

    // ANÁLISIS DE CÓDIGO: Transformación segura de tipos.
    const rawData = data as RawCampaignData;
    const campaign: CampaignMetadata = {
      ...rawData,
      status: rawData.campaign_statuses?.[0]?.name || "unknown",
    };

    return campaign;
  } catch (error) {
    logger.error(
      { err: error, ...context },
      `[DataLayer:Campaigns] Fallo en getCampaignMetadataById.`
    );
    throw new Error("No se pudo obtener la campaña por ID.");
  }
}
// src/lib/data/campaigns/management.data.ts
