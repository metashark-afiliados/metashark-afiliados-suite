// src/lib/actions/campaigns/delete.action.ts
/**
 * @file delete.action.ts
 * @description Server Action atómica para eliminar una campaña.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use server";
import "server-only";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import { campaignsData } from "@/lib/data";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type ActionResult, DeleteCampaignSchema } from "@/lib/validators";
import { createAuditLog, getAuthenticatedUser } from "../_helpers";

export async function deleteCampaignAction(
  formData: FormData
): Promise<ActionResult<{ messageKey: string }>> {
  const authResult = await getAuthenticatedUser();
  if ("error" in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const { campaignId } = DeleteCampaignSchema.parse({
      campaignId: formData.get("campaignId"),
    });

    const campaign = await campaignsData.editor.getCampaignContentById(
      campaignId,
      user.id
    );
    if (!campaign) {
      return { success: false, error: "error_permission_denied" };
    }

    const supabase = createClient();
    const { error: deleteError } = await supabase
      .from("campaigns")
      .delete()
      .eq("id", campaignId);

    if (deleteError) {
      return { success: false, error: "error_deletion_failed" };
    }

    await createAuditLog("campaign.deleted", {
      userId: user.id,
      targetEntityId: campaign.id,
      metadata: { name: campaign.name, siteId: campaign.site_id },
    });

    revalidatePath(`/dashboard/sites/${campaign.site_id}/campaigns`);
    return { success: true, data: { messageKey: "delete_success_toast" } };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: "error_invalid_id" };
    }
    logger.error("Error inesperado en deleteCampaignAction:", error);
    return { success: false, error: "error_unexpected" };
  }
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad de Acción (SRP)**: ((Implementada)) Este aparato tiene ahora una única responsabilidad.
 *
 * =====================================================================
 */
// src/lib/actions/campaigns/delete.action.ts