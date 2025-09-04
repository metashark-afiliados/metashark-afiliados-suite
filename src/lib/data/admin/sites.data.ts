// src/lib/data/admin/sites.data.ts
/**
 * @file sites.data.ts
 * @description Aparato de datos atómico. Responsable de las operaciones de
 *              lectura de alto privilegio para la gestión de todos los sitios
 *              de la plataforma, para uso exclusivo en el Dev Console.
 * @author L.I.A. Legacy
 * @version 2.0.0
 * @see .docs-espejo/lib/data/admin/sites.data.ts.md
 */
"use server";
import "server-only";

import { logger } from "@/lib/logger";
import { createAdminClient } from "@/lib/supabase/server";
import { type SiteWithCampaignsCount } from "./types";

/**
 * @public
 * @async
 * @function getAllSites
 * @description Obtiene una lista paginada de todos los sitios en la plataforma,
 *              consultando la vista materializada `sites_with_campaign_counts`
 *              para un rendimiento óptimo. Utiliza el cliente de administrador.
 * @param {object} options - Opciones de paginación.
 * @param {number} [options.page=1] - El número de página a obtener.
 * @param {number} [options.limit=12] - El número de sitios por página.
 * @returns {Promise<{ sites: SiteWithCampaignsCount[]; totalCount: number }>} Los sitios y el conteo total.
 * @throws {Error} Si la consulta a la base de datos falla, se registra el error
 *                 y se relanza la excepción para ser manejada por la capa superior.
 */
export async function getAllSites({
  page = 1,
  limit = 12,
}: {
  page?: number;
  limit?: number;
}): Promise<{ sites: SiteWithCampaignsCount[]; totalCount: number }> {
  const context = { page, limit };
  logger.trace(
    context,
    "[DataLayer:AdminSites] Iniciando obtención de todos los sitios."
  );
  try {
    const supabase = createAdminClient();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("sites_with_campaign_counts")
      .select(`*`, { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      throw error;
    }

    // El casteo es seguro aquí debido a la SSoT de la vista en la DB.
    return {
      sites: (data as SiteWithCampaignsCount[]) || [],
      totalCount: count || 0,
    };
  } catch (error) {
    logger.error(
      { err: error as Error, context },
      "[DataLayer:AdminSites] Error crítico al obtener todos los sitios."
    );
    throw new Error("No se pudieron obtener los datos de los sitios.");
  }
}
// src/lib/data/admin/sites.data.ts
