// src/lib/data/admin/sites.data.ts
/**
 * @file sites.data.ts
 * @description Aparato de datos atómico. Responsable de las operaciones de
 *              lectura de alto privilegio para la gestión de todos los sitios
 *              de la plataforma.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use server";
import "server-only";

import { logger } from "@/lib/logging";
import { createAdminClient } from "@/lib/supabase/server";
import { type SiteWithCampaignsCount } from "./types";

/**
 * @public
 * @async
 * @function getAllSites
 * @description Obtiene una lista paginada de todos los sitios en la plataforma,
 *              consultando la vista materializada `sites_with_campaign_counts`
 *              para un rendimiento óptimo.
 * @param {object} options - Opciones de paginación.
 * @returns {Promise<{ sites: SiteWithCampaignsCount[]; totalCount: number }>} Los sitios y el conteo total.
 * @throws {Error} Si la consulta a la base de datos falla.
 */
export async function getAllSites({
  page = 1,
  limit = 12,
}: {
  page?: number;
  limit?: number;
}): Promise<{ sites: SiteWithCampaignsCount[]; totalCount: number }> {
  const supabase = createAdminClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from("sites_with_campaign_counts")
    .select(`*`, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    logger.error(
      `[DataLayer:AdminSites] Error al obtener todos los sitios:`,
      error
    );
    throw new Error("No se pudieron obtener los datos de los sitios.");
  }

  return { sites: data || [], totalCount: count || 0 };
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical (SRP)**: ((Implementada)) Este nuevo aparato tiene la única y clara responsabilidad de gestionar el acceso a los datos de todos los sitios, mejorando la cohesión. Su lógica ha sido migrada directamente desde el monolito `admin.ts`.
 *
 * @subsection Melhorias Futuras
 * 1. **Búsqueda y Filtrado**: ((Vigente)) Para una funcionalidad de administración completa, esta función debería ser extendida para aceptar un `query` y otros parámetros de filtro (ej. por `status` o `owner_id`). Propondré esta mejora una vez completada la atomización.
 *
 * =====================================================================
 */
// src/lib/data/admin/sites.data.ts
