// src/lib/actions/campaigns/archive.action.ts
/**
 * @file archive.action.ts
 * @description Server Action atómica para archivar una campaña.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use server";
import "server-only";

import { revalidatePath } from "next/cache";

import { campaignsData } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { type ActionResult } from "@/lib/validators";
import { createAuditLog, getAuthenticatedUser } from "../_helpers";

export async function archiveCampaignAction(
  campaignId: string
): Promise<ActionResult<void>> {
  const authResult = await getAuthenticatedUser();
  if ("error" in authResult) return authResult.error;
  const { user } = authResult;

  const campaign = await campaignsData.editor.getCampaignContentById(
    campaignId,
    user.id
  );
  if (!campaign) {
    return { success: false, error: "error_permission_denied" };
  }

  const supabase = createClient();
  const { error: updateError } = await supabase
    .from("campaigns")
    .update({ status: "archived" })
    .eq("id", campaignId);

  if (updateError) {
    return { success: false, error: "error_archive_failed" };
  }

  await createAuditLog("campaign.archived", {
    userId: user.id,
    targetEntityId: campaignId,
    metadata: { name: campaign.name },
  });

  revalidatePath(`/dashboard/sites/${campaign.site_id}/campaigns`);
  return { success: true, data: undefined };
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
// src/lib/actions/campaigns/archive.action.ts