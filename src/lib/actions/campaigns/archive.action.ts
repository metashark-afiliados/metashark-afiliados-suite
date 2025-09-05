// src/lib/actions/campaigns/archive.action.ts
/**
 * @file archive.action.ts
 * @description Server Action atómica para archivar una campaña. Alineada con
 *              la arquitectura "Lean Database", el contrato `ActionResult` y
 *              la Constitución de Observabilidad.
 * @author L.I.A. Legacy
 * @version 4.0.0
 * @see .docs-espejo/lib/actions/campaigns/archive.action.ts.md
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
import { type ActionResult, type ValidationErrorKey } from "@/lib/validators";

/**
 * @public
 * @async
 * @function archiveCampaignAction
 * @description Cambia el estado de una campaña a 'archivado' (status_id = 3).
 *              Valida que el usuario actor tenga permisos de edición sobre la campaña.
 * @param {string} campaignId - El ID de la campaña a archivar.
 * @returns {Promise<ActionResult<{ messageKey: ValidationErrorKey }>>} El resultado de la operación.
 */
export async function archiveCampaignAction(
  campaignId: string
): Promise<ActionResult<{ messageKey: ValidationErrorKey }>> {
  let context: { campaignId: string; userId?: string } = { campaignId };
  try {
    const user = await getAuthenticatedUserOrThrow();
    context.userId = user.id;

    logger.trace(context, "[archiveCampaignAction] Iniciando acción.");

    // DEUDA: Esta capa de permisos debe ser más robusta y específica.
    const campaign =
      await campaignsData.auth.getCampaignSiteInfoById(campaignId);
    if (!campaign) {
      logger.warn(
        context,
        "[archiveCampaignAction] Permiso denegado o campaña no encontrada."
      );
      return {
        success: false,
        error: "campaigns.permission_denied",
      };
    }

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("campaigns")
      .update({ status_id: 3, updated_at: new Date().toISOString() }) // 3 es el ID canónico para 'archived'
      .eq("id", campaignId);

    if (updateError) {
      throw updateError;
    }

    await createAuditLog("campaign.archived", {
      userId: user.id,
      targetEntityId: campaignId,
      metadata: { campaignId },
    });

    if (campaign.site_id) {
      revalidatePath(`/dashboard/sites/${campaign.site_id}/campaigns`);
    }
    revalidatePath("/dashboard/sites");

    logger.info(
      context,
      "[archiveCampaignAction] Campaña archivada con éxito."
    );

    return {
      success: true,
      data: { messageKey: "campaigns.archive_success" },
    };
  } catch (error) {
    const errorId = await createPersistentErrorLog(
      "archiveCampaignAction",
      error as Error,
      context
    );
    logger.error(
      { err: error, errorId, ...context },
      "[archiveCampaignAction] Fallo en la acción."
    );
    return {
      success: false,
      error: "campaigns.archive_failed",
    };
  }
}
// src/lib/actions/campaigns/archive.action.ts