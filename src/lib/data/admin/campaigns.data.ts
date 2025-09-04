// src/lib/data/admin/campaigns.data.ts
/**
 * @file campaigns.data.ts
 * @description Aparato de datos atómico. Responsable de las operaciones de
 *              lectura de alto privilegio para la gestión de campañas.
 *              Esta es la SSoT para obtener datos de campañas en el Dev Console.
 * @author L.I.A. Legacy
 * @version 2.0.0
 * @see .docs-espejo/lib/data/admin/campaigns.data.ts.md
 */
"use server";
import "server-only";

import { logger } from "@/lib/logger";
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
    {},
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
      { err: error as Error },
      "[DataLayer:AdminCampaigns] Error crítico al obtener todas las campañas."
    );
    throw new Error("No se pudieron obtener los datos de las campañas.");
  }
}
// src/lib/data/admin/campaigns.data.ts
