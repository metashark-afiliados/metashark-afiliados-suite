// src/lib/data/admin/sites.data.ts
/**
 * @file sites.data.ts
 * @description Aparato de datos atómico. Responsable de las operaciones de
 *              lectura de alto privilegio para la gestión de todos los sitios
 *              de la plataforma, para uso exclusivo en el Dev Console.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-29
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
  logger.trace(
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
      `[DataLayer:AdminSites] Error crítico al obtener todos los sitios:`,
      error
    );
    throw new Error("No se pudieron obtener los datos de los sitios.");
  }
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **Búsqueda y Filtrado**: Para una funcionalidad de administración completa, esta función debería ser extendida para aceptar un `query` y otros parámetros de filtro (ej. por `status` o `owner_id`) para permitir la búsqueda en el Dev Console.
 * 2. **Cacheo de Datos**: Para dashboards de administración con mucho tráfico, se podría envolver esta función en `React.cache` con una revalidación basada en etiquetas para optimizar el rendimiento.
 * 3. **Consumo de Vista Materializada**: Asegurar que la vista `sites_with_campaign_counts` esté implementada y sea materializada en la base de datos para garantizar que esta consulta de alto rendimiento no degrade el rendimiento de la base de datos principal.
 * 4. **Tipado de Retorno con Zod**: En lugar de la aserción `as`, crear un `SiteWithCampaignsCountSchema` y usar `.parse()` para garantizar la forma de los datos en tiempo de ejecución.
 * 5. **Ordenamiento Dinámico**: Añadir un parámetro `sort` para permitir ordenar los resultados por diferentes columnas (ej. `name`, `campaign_count`, `created_at`).
 * =====================================================================
 */
// src/lib/data/admin/sites.data.ts
