// src/lib/actions/campaigns/assign-site.action.ts
/**
 * @file assign-site.action.ts
 * @description Server Action atómica para asignar una campaña a un sitio.
 *              Alineada con la arquitectura de errores soberanos, la
 *              observabilidad canónica y la SSoT de autenticación.
 * @author L.I.A Legacy
 * @version 5.0.0
 * @see .docs-espejo/lib/actions/campaigns/assign-site.action.ts.md
 */
"use server";
import "server-only";

import { revalidatePath } from "next/cache";

import {
  createAuditLog,
  createPersistentErrorLog,
} from "@/lib/actions/_helpers";
import { getAuthenticatedUserOrThrow } from "@/lib/actions/_helpers/auth.helper";
import { requireSitePermission } from "@/lib/auth/user-permissions";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import { type ActionResult } from "@/lib/validators";

/**
 * @public
 * @async
 * @function assignSiteToCampaignAction
 * @description Asigna una campaña (a través de su `id`) a un sitio específico.
 *              Esta acción es crítica para el flujo de publicación. Valida que:
 *              1. El usuario tenga permisos de edición sobre el sitio de destino.
 *              2. La campaña no esté ya asignada a otro sitio.
 *              3. El usuario sea el creador original del diseño (`Creation`).
 * @param {string} campaignId - El ID de la campaña a asignar.
 * @param {string} siteId - El ID del sitio al que se asignará la campaña.
 * @returns {Promise<ActionResult<void>>} El resultado de la operación.
 */
export async function assignSiteToCampaignAction(
  campaignId: string,
  siteId: string
): Promise<ActionResult<void>> {
  let context: { campaignId: string; siteId: string; userId?: string } = {
    campaignId,
    siteId,
  };
  try {
    const user = await getAuthenticatedUserOrThrow();
    context.userId = user.id;

    logger.trace(context, "[assignSiteToCampaignAction] Iniciando acción.");

    const sitePermissionCheck = await requireSitePermission(siteId, [
      "owner",
      "admin",
      "member",
    ]);
    if (!sitePermissionCheck.success) {
      return {
        success: false,
        error: "campaigns.permission_denied_site",
      };
    }
    const { site } = sitePermissionCheck.data;

    const supabase = createClient();
    const { data: campaign, error: campaignError } = await supabase
      .from("campaigns")
      .select("id, name, site_id, creation_id")
      .eq("id", campaignId)
      .single();

    if (campaignError || !campaign) {
      return {
        success: false,
        error: "campaigns.not_found",
      };
    }

    const { data: creation } = await supabase
      .from("creations")
      .select("created_by")
      .eq("id", campaign.creation_id)
      .single();

    if (creation?.created_by !== user.id || campaign.site_id !== null) {
      logger.warn(
        context,
        "[assignSiteToCampaignAction] VIOLACIÓN: Intento de asignación no permitida."
      );
      return {
        success: false,
        error: "campaigns.assignment_not_allowed",
      };
    }

    const { error: updateError } = await supabase
      .from("campaigns")
      .update({ site_id: siteId, updated_at: new Date().toISOString() })
      .eq("id", campaignId);

    if (updateError) {
      throw updateError;
    }

    await createAuditLog("campaign.site_assigned", {
      userId: user.id,
      targetEntityId: campaignId,
      targetEntityType: "campaign",
      metadata: {
        campaignName: campaign.name,
        newSiteId: siteId,
        siteSubdomain: site.subdomain,
      },
    });

    revalidatePath(`/builder/${campaign.creation_id}`); // Revalidar por creation_id
    revalidatePath(`/dashboard/sites/${siteId}/campaigns`);

    logger.info(context, "[assignSiteToCampaignAction] Asignación exitosa.");
    return { success: true, data: undefined };
  } catch (error) {
    const errorId = await createPersistentErrorLog(
      "assignSiteToCampaignAction",
      error as Error,
      context
    );
    logger.error(
      { err: error, errorId, ...context },
      "[assignSiteToCampaignAction] Fallo en la acción."
    );
    return {
      success: false,
      error: "campaigns.update_failed",
    };
  }
}
// src/lib/actions/campaigns/assign-site.action.ts
