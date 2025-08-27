// src/lib/data/admin/campaigns.data.ts
/**
 * @file campaigns.data.ts
 * @description Aparato de datos atómico. Responsable de las operaciones de
 *              lectura de alto privilegio para la gestión de campañas.
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
import { type CampaignWithSiteInfo } from "./types";

/**
 * @public
 * @async
 * @function getAllCampaignsWithSiteInfo
 * @description Obtiene todas las campañas de la plataforma, uniendo la información del
 *              subdominio del sitio al que pertenecen.
 * @returns {Promise<CampaignWithSiteInfo[]>} Un array de todas las campañas.
 * @throws {Error} Si la consulta a la base de datos falla.
 */
export async function getAllCampaignsWithSiteInfo(): Promise<
  CampaignWithSiteInfo[]
> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("campaigns")
    .select(`*, sites (subdomain)`)
    .order("created_at", { ascending: false });

  if (error) {
    logger.error(
      `[DataLayer:AdminCampaigns] Error al obtener todas las campañas:`,
      error
    );
    throw new Error("No se pudieron obtener los datos de las campañas.");
  }

  return (data as CampaignWithSiteInfo[]) || [];
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical (SRP)**: ((Implementada)) Este nuevo aparato tiene la única y clara responsabilidad de gestionar el acceso a los datos de las campañas, mejorando la cohesión. Su lógica ha sido migrada directamente desde el monolito `admin.ts`.
 *
 * @subsection Melhorias Futuras
 * 1. **Paginación y Búsqueda**: ((Vigente)) Para escalar a miles de campañas, esta función debe ser refactorizada a `getPaginatedCampaigns` y aceptar opciones de paginación (`page`, `limit`) y búsqueda (`query`), similar a `getPaginatedUsersWithRoles`. Propondré esta mejora una vez completada la atomización.
 *
 * =====================================================================
 */
// src/lib/data/admin/campaigns.data.ts
