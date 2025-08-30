// src/lib/data/admin/campaigns.data.ts
/**
 * @file campaigns.data.ts
 * @description Aparato de datos atómico. Responsable de las operaciones de
 *              lectura de alto privilegio para la gestión de campañas.
 *              Esta es la SSoT para obtener datos de campañas en el Dev Console.
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
import { type CampaignWithSiteInfo } from "./types";

/**
 * @public
 * @async
 * @function getAllCampaignsWithSiteInfo
 * @description Obtiene todas las campañas de la plataforma, uniendo la información del
 *              subdominio del sitio al que pertenecen. Utiliza el cliente de
 *              administrador para eludir las políticas de RLS, para uso exclusivo
 *              en el Dev Console.
 * @returns {Promise<CampaignWithSiteInfo[]>} Un array de todas las campañas.
 * @throws {Error} Si la consulta a la base de datos falla, se registra el error
 *                 y se relanza la excepción para ser manejada por la capa superior.
 */
export async function getAllCampaignsWithSiteInfo(): Promise<
  CampaignWithSiteInfo[]
> {
  logger.trace(
    "[DataLayer:AdminCampaigns] Iniciando obtención de todas las campañas."
  );
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("campaigns")
      .select(`*, sites (subdomain)`)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    // El casteo es seguro aquí porque la consulta `select` garantiza la forma.
    return (data as CampaignWithSiteInfo[]) || [];
  } catch (error) {
    logger.error(
      `[DataLayer:AdminCampaigns] Error crítico al obtener todas las campañas:`,
      error
    );
    throw new Error("No se pudieron obtener los datos de las campañas.");
  }
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **Paginación y Búsqueda**: Para escalar a miles de campañas, esta función debe ser refactorizada a `getPaginatedCampaigns` y aceptar opciones de paginación (`page`, `limit`) y búsqueda (`query`), similar a `getPaginatedUsersWithRoles`.
 * 2. **Cacheo de Datos**: Para dashboards de administración con mucho tráfico, se podría envolver esta función en `React.cache` con una revalidación basada en etiquetas (`revalidateTag`) para optimizar el rendimiento.
 * 3. **Tipado de Retorno Estricto**: En lugar de un casteo `as`, se podría construir un schema de Zod para el tipo de retorno y usar `.parse()` para garantizar la forma de los datos en tiempo de ejecución.
 * 4. **Filtros Avanzados**: Extender la función para aceptar parámetros de filtro por `status` de campaña o por `site_id` para una gestión más granular en el Dev Console.
 * 5. **Ordenamiento Dinámico**: Añadir un parámetro `sort` para permitir ordenar los resultados por diferentes columnas (ej. `name`, `created_at`, `sites.subdomain`).
 * =====================================================================
 */
// src/lib/data/admin/campaigns.data.ts
