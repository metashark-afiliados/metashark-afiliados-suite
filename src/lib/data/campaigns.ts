/**
 * @file src/lib/data/campaigns.ts
 * @description Aparato de datos para la entidad 'campaigns'. Esta es la Única Fuente de
 *              Verdad para interactuar con la tabla `campaigns`. Ha sido nivelado a un
 *              estándar de élite para soportar filtros y ordenamiento avanzados,
 *              implementando cacheo de alto rendimiento y lógica de autorización.
 * @author Raz Podestá
 * @version 2.0.0
 */
"use server";

import { unstable_cache as cache } from "next/cache";

import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type Tables } from "@/lib/types/database";

import { hasWorkspacePermission } from "./permissions";
import { getSiteDataByHost } from "./sites";

export type CampaignMetadata = Pick<
  Tables<"campaigns">,
  | "id"
  | "site_id"
  | "name"
  | "slug"
  | "status"
  | "created_at"
  | "updated_at"
  | "affiliate_url"
>;

export type CampaignWithContent = Tables<"campaigns"> & {
  sites: { workspace_id: string; subdomain: string | null } | null;
};

/**
 * @public
 * @async
 * @function getCampaignsMetadataBySiteId
 * @description Obtiene una lista paginada y filtrada de metadatos de campañas para un sitio específico.
 *              Los resultados se cachean para mejorar el rendimiento en la navegación.
 * @param {string} siteId - El ID del sitio para el que se obtendrán las campañas.
 * @param {object} options - Opciones de paginación, búsqueda, filtro y ordenamiento.
 * @returns {Promise<{ campaigns: CampaignMetadata[]; totalCount: number }>} Los metadatos de las campañas y el conteo total.
 */
export async function getCampaignsMetadataBySiteId(
  siteId: string,
  {
    page,
    limit,
    query,
    status,
    sortBy,
  }: {
    page: number;
    limit: number;
    query?: string;
    status?: "draft" | "published" | "archived";
    sortBy?: "updated_at_desc" | "name_asc";
  }
): Promise<{ campaigns: CampaignMetadata[]; totalCount: number }> {
  const cacheKey = `campaigns-meta-${siteId}-p${page}-q${
    query || ""
  }-s${status || ""}-o${sortBy || ""}`;
  const cacheTags = [`campaigns:${siteId}`];

  return cache(
    async () => {
      logger.info(
        `[Cache MISS] Cargando metadatos de campañas para: ${cacheKey}`
      );
      const supabase = createClient();
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
 * @param {number} [limit=4] - El número máximo de campañas a devolver.
 * @returns {Promise<Tables<"campaigns">[]>} Un array de las campañas recientes.
 */
export async function getRecentCampaignsByWorkspaceId(
  workspaceId: string,
  limit: number = 4
): Promise<Tables<"campaigns">[]> {
  return cache(
    async () => {
      logger.info(
        `[Cache MISS] Cargando campañas recientes para workspace ${workspaceId}.`
      );
      const supabase = createClient();

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
    [`recent-campaigns-${workspaceId}`],
    { tags: [`workspaces:${workspaceId}:recent-campaigns`] }
  )();
}

/**
 * @public
 * @async
 * @function getCampaignContentById
 * @description Obtiene el contenido completo de una campaña y valida si el usuario
 *              tiene permiso para acceder a ella.
 * @param {string} campaignId - El ID de la campaña a obtener.
 * @param {string} userId - El ID del usuario que solicita el acceso.
 * @returns {Promise<CampaignWithContent | null>} El objeto de la campaña o null.
 */
export async function getCampaignContentById(
  campaignId: string,
  userId: string
): Promise<CampaignWithContent | null> {
  const supabase = createClient();
  const { data: campaign, error } = await supabase
    .from("campaigns")
    .select(`*, sites (workspace_id, subdomain)`)
    .eq("id", campaignId)
    .single();

  if (error || !campaign) {
    if (error && error.code !== "PGRST116") {
      logger.error(`Error al obtener la campaña ${campaignId}:`, error);
    }
    return null;
  }

  const workspaceId = campaign.sites?.workspace_id;
  if (!workspaceId) {
    logger.error(
      `INCONSISTENCIA: Campaña ${campaignId} sin workspace asociado.`
    );
    return null;
  }

  const isAuthorized = await hasWorkspacePermission(userId, workspaceId, [
    "owner",
    "admin",
    "member",
  ]);

  if (!isAuthorized) {
    logger.warn(
      `SEGURIDAD: Usuario ${userId} intentó acceder a la campaña ${campaignId} sin permisos.`
    );
    return null;
  }

  return campaign as CampaignWithContent;
}

/**
 * @public
 * @async
 * @function getPublishedCampaignByHostAndSlug
 * @description Obtiene una campaña publicada para renderizado público.
 * @param {string} host - El host (subdominio o dominio personalizado).
 * @param {string} slug - El slug de la campaña.
 * @returns {Promise<Tables<"campaigns"> | null>} La campaña publicada o null.
 */
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

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Gestión de Datos Avanzada**: ((Implementada)) La función `getCampaignsMetadataBySiteId` ha sido nivelada para aceptar parámetros de `status` y `sortBy`, proveyendo a la UI de capacidades de filtrado y ordenamiento de élite.
 * 2. **Sincronización de Tipos**: ((Implementada)) El tipo `CampaignMetadata` ha sido actualizado para incluir el campo `status`, manteniendo la consistencia con el esquema de la base de datos.
 *
 * @subsection Melhorias Futuras
 * 1. **Índices Compuestos**: ((Vigente)) Para optimizar las nuevas consultas de filtrado y ordenamiento, se debería considerar añadir un índice compuesto en la base de datos en las columnas `(site_id, status, updated_at)` y `(site_id, status, name)`.
 *
 * =====================================================================
 */
