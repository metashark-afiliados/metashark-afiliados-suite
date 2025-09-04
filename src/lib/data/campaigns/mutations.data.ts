// src/lib/data/campaigns/mutations.data.ts
/**
 * @file mutations.data.ts
 * @description Aparato de datos atómico. SSoT para las operaciones de
 *              escritura (INSERT, UPDATE, DELETE, RPC) para campañas. Garantiza
 *              la integridad de los datos a través de operaciones transaccionales.
 * @author L.I.A Legacy
 * @version 2.0.0
 * @see .docs-espejo/lib/data/campaigns/mutations.data.ts.md
 */
"use server";
import "server-only";

import { type SupabaseClient } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import { type Database, type TablesInsert } from "@/lib/types/database";

type Supabase = SupabaseClient<Database, "public">;

/**
 * @public
 * @async
 * @function createCampaignWithCreation
 * @description Invoca la RPC transaccional para crear una Creation y su Campaign asociada.
 *              Esta es la SSoT para la creación de nuevas campañas.
 * @param {object} payload - Los datos para la nueva campaña y creación.
 * @param {string} payload.name - Nombre de la campaña.
 * @param {string} payload.slug - Slug de la campaña.
 * @param {string} payload.siteId - ID del sitio al que pertenece.
 * @param {string} payload.userId - ID del usuario creador.
 * @param {string} payload.workspaceId - ID del workspace al que pertenece.
 * @returns {Promise<string>} El ID de la nueva Creation.
 * @throws {Error} Si la RPC falla.
 */
export async function createCampaignWithCreation(payload: {
  name: string;
  slug: string;
  siteId: string;
  userId: string;
  workspaceId: string;
}): Promise<string> {
  logger.trace(
    { payload },
    "[DataLayer:Campaigns] Invocando RPC para creación transaccional."
  );
  const supabase = createClient();
  const { data, error } = await supabase
    .rpc("create_campaign_with_creation", {
      p_name: payload.name,
      p_slug: payload.slug,
      p_site_id: payload.siteId,
      p_user_id: payload.userId,
      p_workspace_id: payload.workspaceId,
      p_initial_content: { theme: "light", blocks: [] },
    })
    .select("id")
    .single();

  if (error) {
    logger.error(
      { err: error, payload },
      "[DataLayer:Campaigns] La RPC 'create_campaign_with_creation' falló."
    );
    throw error;
  }

  if (!data) {
    throw new Error("La RPC no devolvió el ID de la nueva creación.");
  }

  return data.id;
}

/**
 * @public
 * @async
 * @function insertCampaignRecord
 * @description Inserta un registro simple en la tabla de campañas.
 * @deprecated Esta función no garantiza la atomicidad y será eliminada en futuras versiones.
 *             Utilice `createCampaignWithCreation` en su lugar.
 * @param {TablesInsert<"campaigns">} campaignPayload - El payload a insertar.
 * @param {Supabase} [supabaseClient] - Instancia opcional de Supabase.
 * @returns {Promise<{ id: string }>}
 */
export async function insertCampaignRecord(
  campaignPayload: TablesInsert<"campaigns">,
  supabaseClient?: Supabase
): Promise<{ id: string }> {
  const supabase = supabaseClient || createClient();
  const { data: newCampaign, error } = await supabase
    .from("campaigns")
    .insert(campaignPayload)
    .select("id")
    .single();
  if (error || !newCampaign) {
    logger.error(
      { err: error },
      "[DataLayer:Campaigns] Fallo al insertar registro de campaña."
    );
    throw new Error("Fallo en la inserción de la base de datos de campaña.");
  }
  logger.trace(
    { campaignId: newCampaign.id },
    "[DataLayer:Campaigns] Registro de campaña insertado."
  );
  return newCampaign;
}
// src/lib/data/campaigns/mutations.data.ts
