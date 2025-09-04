// src/lib/actions/campaigns/duplicate.action.ts
/**
 * @file duplicate.action.ts
 * @description Server Action atómica para duplicar una campaña. Utiliza una RPC
 *              para garantizar la atomicidad transaccional y se alinea con la
 *              SSoT de la capa de datos, manejo de errores y observabilidad.
 * @author Raz Podesta - MetaShark Tech
 * @version 4.0.0
 */
"use server";
import "server-only";

import { revalidatePath } from "next/cache";

import {
  createAuditLog,
  createPersistentErrorLog,
} from "@/lib/actions/_helpers";
import { getAuthenticatedUserOrThrow } from "@/lib/actions/_helpers/auth.helper";
import { campaignsData } from "@/lib/data";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import { type ActionResult } from "@/lib/validators";

/**
 * @public
 * @async
 * @function duplicateCampaignAction
 * @description Duplica una campaña existente, incluyendo su `Creation` asociada,
 *              a través de una RPC transaccional.
 * @param {string} campaignId - El ID de la campaña a duplicar.
 * @returns {Promise<ActionResult<{ id: string }>>} El resultado de la operación,
 *          conteniendo el ID de la nueva `Campaign` creada.
 */
export async function duplicateCampaignAction(
  campaignId: string
): Promise<ActionResult<{ id: string }>> {
  const context: { [key: string]: any } = { campaignId };
  try {
    const user = await getAuthenticatedUserOrThrow();
    context.userId = user.id;

    logger.trace(context, "[duplicateCampaignAction] Iniciando acción.");

    const original = await campaignsData.management.getCampaignMetadataById(
      campaignId,
      user.id
    );

    if (!original) {
      return {
        success: false,
        error: "campaigns.permission_denied",
      };
    }

    const newName = `${original.name} (Copia)`;
    const supabase = createClient();
    const { data: newCampaign, error: rpcError } = await supabase
      .rpc("duplicate_campaign_with_creation", {
        p_campaign_id_to_duplicate: campaignId,
        p_new_name: newName,
        p_user_id: user.id,
      })
      .select("id")
      .single();

    if (rpcError || !newCampaign) {
      throw rpcError || new Error("La RPC de duplicación no devolvió un ID.");
    }

    await createAuditLog("campaign.duplicated", {
      userId: user.id,
      targetEntityId: newCampaign.id,
      metadata: { originalCampaignId: campaignId, newName },
    });

    if (original.site_id) {
      revalidatePath(`/dashboard/sites/${original.site_id}/campaigns`);
    }

    logger.info(
      { newCampaignId: newCampaign.id, ...context },
      "[duplicateCampaignAction] Campaña duplicada con éxito vía RPC."
    );

    return { success: true, data: { id: newCampaign.id } };
  } catch (error) {
    const errorId = await createPersistentErrorLog(
      "duplicateCampaignAction",
      error as Error,
      context
    );
    logger.error(
      { err: error, errorId, ...context },
      "[duplicateCampaignAction] Fallo en la acción."
    );
    return {
      success: false,
      error: "campaigns.duplicate_failed",
    };
  }
}
// src/lib/actions/campaigns/duplicate.action.ts
