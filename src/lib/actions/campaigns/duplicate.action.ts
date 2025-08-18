// src/lib/actions/campaigns/duplicate.action.ts
/**
 * @file duplicate.action.ts
 * @description Server Action atómica para duplicar una campaña.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use server";
import "server-only";

import { revalidatePath } from "next/cache";

import { campaignsData } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { type ActionResult } from "@/lib/validators";
import { createAuditLog, createPersistentErrorLog, getAuthenticatedUser } from "../_helpers";

export async function duplicateCampaignAction(
  campaignId: string
): Promise<ActionResult<{ id: string }>> {
  const authResult = await getAuthenticatedUser();
  if ("error" in authResult) return authResult.error;
  const { user } = authResult;

  const original = await campaignsData.editor.getCampaignContentById(
    campaignId,
    user.id
  );
  if (!original) {
    return { success: false, error: "error_permission_denied" };
  }

  const newName = `${original.name} (Copia)`;
  const supabase = createClient();
  const { data: newCampaign, error: rpcError } = await supabase
    .rpc("duplicate_campaign_rpc", {
      campaign_id_to_duplicate: campaignId,
      new_name: newName,
    })
    .select("id")
    .single();

  if (rpcError || !newCampaign) {
    await createPersistentErrorLog(
      "duplicateCampaignAction.rpc",
      rpcError as Error,
      { campaignId }
    );
    return { success: false, error: "error_duplication_failed" };
  }

  await createAuditLog("campaign.duplicated", {
    userId: user.id,
    targetEntityId: newCampaign.id,
    metadata: { originalCampaignId: campaignId, newName },
  });

  revalidatePath(`/dashboard/sites/${original.site_id}/campaigns`);
  return { success: true, data: { id: newCampaign.id } };
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
// src/lib/actions/campaigns/duplicate.action.ts