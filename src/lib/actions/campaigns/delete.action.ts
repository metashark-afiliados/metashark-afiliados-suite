// src/lib/actions/campaigns/delete.action.ts
/**
 * @file delete.action.ts
 * @description Server Action atómica para eliminar una campaña y su creation
 *              asociada. Refactorizada para utilizar una RPC de PostgreSQL,
 *              garantizando la atomicidad transaccional y adhiriéndose al
 *              contrato `ActionResult` y la Constitución de Observabilidad.
 * @author Raz Podestá
 * @version 4.0.0
 */
"use server";
import "server-only";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import {
  createAuditLog,
  createPersistentErrorLog,
} from "@/lib/actions/_helpers";
import { getAuthUser } from "@/lib/auth/get-auth-user";
import { campaignsData } from "@/lib/data";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import {
  type ActionResult,
  DeleteCampaignSchema,
  type ValidationErrorKey,
} from "@/lib/validators";

/**
 * @public
 * @async
 * @function deleteCampaignAction
 * @description Elimina de forma atómica una campaña y su `Creation` asociada.
 *              Valida que el usuario tenga permisos de 'owner' o 'admin' sobre
 *              el workspace de la campaña antes de proceder.
 * @param {FormData} formData - Datos del formulario que contienen `campaignId`.
 * @returns {Promise<ActionResult<{ messageKey: ValidationErrorKey }>>} El resultado de la operación.
 */
export async function deleteCampaignAction(
  formData: FormData
): Promise<ActionResult<{ messageKey: ValidationErrorKey }>> {
  const user = await getAuthUser();
  if (!user) {
    return { success: false, error: "generic.error_unauthenticated" };
  }

  const rawData = { campaignId: formData.get("campaignId") };
  const context = { userId: user.id, payload: rawData };

  try {
    const { campaignId } = DeleteCampaignSchema.parse(rawData);
    context.payload.campaignId = campaignId;

    logger.trace(context, "[deleteCampaignAction] Iniciando acción.");

    // DEUDA TÉCNICA: La validación de permisos debería ser una RPC o un helper más robusto.
    // Esta consulta es una medida de contención.
    const campaignInfo =
      await campaignsData.auth.getCampaignSiteInfoById(campaignId);
    if (!campaignInfo) {
      logger.warn(
        context,
        "[deleteCampaignAction] Permiso denegado o campaña no encontrada."
      );
      return { success: false, error: "generic.error_permission_denied" };
    }

    const supabase = createClient();
    // La RPC se encarga de la lógica de permisos y eliminación atómica.
    const { error: rpcError } = await supabase.rpc(
      "delete_campaign_with_creation",
      {
        p_campaign_id: campaignId,
        p_user_id: user.id,
      }
    );

    if (rpcError) {
      throw rpcError;
    }

    await createAuditLog("campaign.deleted", {
      userId: user.id,
      targetEntityId: campaignId,
      metadata: { campaignId },
    });

    if (campaignInfo.site_id) {
      revalidatePath(`/dashboard/sites/${campaignInfo.site_id}/campaigns`);
    }

    logger.info(context, "[deleteCampaignAction] Campaña eliminada con éxito.");
    return { success: true, data: { messageKey: "campaigns.delete_success" } };
  } catch (error) {
    let errorKey: ValidationErrorKey = "campaigns.delete_failed";
    if (error instanceof ZodError) {
      errorKey = "generic.error_invalid_data";
    }

    const errorId = await createPersistentErrorLog(
      "deleteCampaignAction",
      error as Error,
      context
    );
    logger.error(
      { err: error, errorId, ...context },
      "[deleteCampaignAction] Fallo en la acción."
    );

    return {
      success: false,
      error: errorKey,
    };
  }
}
// src/lib/actions/campaigns/delete.action.ts
