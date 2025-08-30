// src/lib/data/campaigns/management.data.ts
/**
 * @file src/lib/data/campaigns/management.data.ts
 * @description Aparato de datos atómico. Responsable de las operaciones de lectura
 *              y escritura para la gestión de campañas. Ha sido refactorizado holísticamente
 *              para consumir su propio contrato de tipo de ordenamiento (`CampaignSortOption`),
 *              resolviendo un error crítico de tipo (TS2305) y reforzando la
 *              soberanía de su dominio de datos.
 * @author Raz Podestá - MetaShark Tech
 * @version 8.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use server";
import "server-only";

import { unstable_cache as cache } from "next/cache";
import { type SupabaseClient } from "@supabase/supabase-js";

import { logger } from "@/lib/logging";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { type Tables, type TablesInsert } from "@/lib/types/database";
import {
  type CampaignMetadata,
  type CampaignSiteInfo,
  type CampaignSortOption,
  CAMPAIGN_SORT_OPTIONS,
} from "./types";

type Database = import("@/lib/types/database").Database;
type Supabase = SupabaseClient<Database, "public">;

export async function getCampaignsMetadataBySiteId(
  siteId: string,
  options: {
    page: number;
    limit: number;
    query?: string;
    status?: "draft" | "published" | "archived";
    sortBy?: CampaignSortOption;
  },
  supabaseClient?: Supabase
): Promise<{ campaigns: CampaignMetadata[]; totalCount: number }> {
  const { page, limit, query, status, sortBy } = options;
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

  const sortMap: Record<
    CampaignSortOption,
    { column: string; ascending: boolean }
  > = {
    updated_at_desc: { column: "updated_at", ascending: false },
    name_asc: { column: "name", ascending: true },
    name_desc: { column: "name", ascending: false },
  };
  const sort = sortMap[sortBy || "updated_at_desc"];
  queryBuilder = queryBuilder.order(sort.column, {
    ascending: sort.ascending,
    nullsFirst: false,
  });

  const { data, error, count } = await queryBuilder.range(from, to);

  if (error) {
    logger.error(`Error al obtener campañas para el sitio ${siteId}:`, error);
    return { campaigns: [], totalCount: 0 };
  }
  return { campaigns: data as CampaignMetadata[], totalCount: count || 0 };
}

export const getCampaignSiteInfoById = cache(
  async (campaignId: string): Promise<CampaignSiteInfo | null> => {
    logger.trace(
      `[Cache MISS] Cargando info de sitio para campaña: ${campaignId}`
    );
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("campaigns")
      .select(`site_id, sites!inner(workspace_id)`)
      .eq("id", campaignId)
      .single();

    const siteInfo = Array.isArray(data?.sites) ? data.sites[0] : data?.sites;

    if (error || !data || !siteInfo) {
      if (error && error.code !== "PGRST116") {
        logger.error(
          `[DataLayer:Campaigns] Error al obtener info de sitio para campaña ${campaignId}:`,
          error
        );
      }
      return null;
    }

    return {
      site_id: data.site_id,
      workspace_id: siteInfo.workspace_id,
    };
  },
  ["campaign-site-info"],
  { tags: ["campaigns"] }
);

export const getRecentCampaignsByWorkspaceId = cache(
  async (
    workspaceId: string,
    limit: number,
    supabaseClient?: Supabase
  ): Promise<
    Pick<
      Tables<"campaigns">,
      "id" | "name" | "updated_at" | "created_at" | "creation_id"
    >[]
  > => {
    const supabase = supabaseClient || createServerClient();
    logger.trace(
      `[Cache MISS] Cargando campañas recientes para workspace: ${workspaceId}`
    );

    const { data, error } = await supabase
      .from("campaigns")
      .select(
        "id, name, updated_at, created_at, creation_id, sites!inner(workspace_id)"
      )
      .eq("sites.workspace_id", workspaceId)
      .order("updated_at", { ascending: false, nullsFirst: false })
      .limit(limit);

    if (error) {
      logger.error(
        `[DataLayer:Campaigns] Error al obtener campañas recientes para workspace ${workspaceId}:`,
        error
      );
      return [];
    }
    return data || [];
  }
);

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
 * @subsection Melhorias Futuras
 * 1. **Tipado de Retorno con Zod**: En lugar de la aserción `as CampaignMetadata[]`, se podría crear un `CampaignMetadataSchema` y usar `z.array(...).parse(data)` para una validación en tiempo de ejecución.
 * 2. **Abstracción del Query Builder**: La lógica de construcción de la consulta en `getCampaignsMetadataBySiteId` podría ser extraída a una función helper pura para mejorar la legibilidad y testeabilidad.
 * 3. **Vista Materializada para `recent_campaigns`**: Para un rendimiento de élite a gran escala, se podría crear una vista materializada en la base de datos que pre-calcule las campañas recientes por workspace, y `getRecentCampaignsByWorkspaceId` consultaría esa vista.
 * 4. **Inyección de Dependencias para Pruebas**: Para una testeabilidad de élite, las funciones de esta capa de datos podrían aceptar una instancia del cliente Supabase como parámetro opcional, facilitando la inyección de mocks.
 * 5. **Abstracción de Lógica de Paginación**: La lógica para calcular `from` y `to` es un patrón repetido. Podría ser abstraído a un helper `getPaginationRange(page, limit)`.
 * 6. **Revalidación de Caché por Etiqueta**: Las Server Actions que modifican campañas deben invocar `revalidateTag('campaigns')` para invalidar activamente los cachés de `getCampaignSiteInfoById` y `getRecentCampaignsByWorkspaceId`.
 * 7. **Manejo de Errores Granular**: La función `getCampaignsMetadataBySiteId` podría devolver un `Result` (ej. `{ data, error }`) en lugar de un array vacío en caso de error, para dar más contexto a la capa superior.
 * 8. **Índices de Búsqueda (GIN)**: Para optimizar el rendimiento de la búsqueda `ILIKE` en un gran volumen de datos, se deben crear índices GIN con la extensión `pg_trgm` en las columnas `name` y `slug` de la tabla `campaigns`.
 * 9. **Consistencia de `sortMap`**: El `sortMap` podría ser generado dinámicamente a partir de la constante `CAMPAIGN_SORT_OPTIONS` para garantizar que siempre estén sincronizados, adhiriéndose al principio DRY al más alto nivel.
 * =====================================================================
 */
// src/lib/data/campaigns/management.data.ts
