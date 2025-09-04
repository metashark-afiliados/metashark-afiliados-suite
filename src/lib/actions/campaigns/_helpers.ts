// src/lib/actions/campaigns/_helpers.ts
/**
 * @file src/lib/actions/campaigns/_helpers.ts
 * @description Aparatos helper atómicos para las Server Actions de campañas.
 *              Alineado con la SSoT de autenticación soberana.
 * @author Raz Podesta - MetaShark Tech
 * @version 4.0.0
 * Florianópolis/SC, Brazil
 */
"use server";
import "server-only";

import { revalidatePath } from "next/cache";
import { type User } from "@supabase/supabase-js";

import { createAuditLog } from "@/lib/actions/_helpers";
import { getAuthenticatedUser } from "@/lib/actions/_helpers/auth.helper";
import { requireSitePermission } from "@/lib/auth/user-permissions";
import { type ActionResult, type ValidationErrorKey } from "@/lib/validators";

export async function validateCampaignCreationPermissions(
  siteId?: string
): Promise<ActionResult<{ user: User }>> {
  const authResult = await getAuthenticatedUser();
  if (!authResult.success) {
    return authResult;
  }
  const { user } = authResult.data;

  if (siteId) {
    const permissionCheck = await requireSitePermission(siteId, [
      "owner",
      "admin",
      "member",
    ]);
    if (!permissionCheck.success) {
      return {
        success: false,
        error: "sites.create_permission_denied" as ValidationErrorKey,
        data: null,
      };
    }
  }
  return { success: true, data: { user } };
}

export async function handlePostCreationEffects({
  newCampaignId,
  userId,
  payload,
}: {
  newCampaignId: string;
  userId: string;
  payload: { name: string; siteId?: string; campaignType: string };
}) {
  await createAuditLog("campaign.created_from_template", {
    userId: userId,
    targetEntityId: newCampaignId,
    metadata: {
      name: payload.name,
      siteId: payload.siteId || "unassigned",
      campaignType: payload.campaignType,
    },
  });

  if (payload.siteId) {
    revalidatePath(`/dashboard/sites/${payload.siteId}/campaigns`);
  }
  revalidatePath("/dashboard", "layout");
}
// src/lib/actions/campaigns/_helpers.ts
