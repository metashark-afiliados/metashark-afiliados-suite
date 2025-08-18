// src/lib/actions/campaigns/create.action.ts
/**
 * @file create.action.ts
 * @description Server Action atómica para crear una nueva campaña.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use server";
import "server-only";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import { sites as sitesData } from "@/lib/data";
import { hasWorkspacePermission } from "@/lib/data/permissions";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type ActionResult, CreateCampaignSchema } from "@/lib/validators";
import { createAuditLog, getAuthenticatedUser } from "../_helpers";

export async function createCampaignAction(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const authResult = await getAuthenticatedUser();
  if ("error" in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const rawData = Object.fromEntries(formData);
    const { name, slug, site_id } = CreateCampaignSchema.parse(rawData);

    const site = await sitesData.getSiteById(site_id);
    if (!site) {
      return { success: false, error: "error_site_not_found" };
    }

    const isAuthorized = await hasWorkspacePermission(
      user.id,
      site.workspace_id,
      ["owner", "admin", "member"]
    );

    if (!isAuthorized) {
      return { success: false, error: "error_permission_denied" };
    }

    const supabase = createClient();
    const { data: newCampaign, error } = await supabase
      .from("campaigns")
      .insert({ name, slug, site_id, content: {}, created_by: user.id })
      .select("id")
      .single();

    if (error) {
      logger.error("Error al crear la campaña en DB:", error);
      return { success: false, error: "error_creation_failed" };
    }

    await createAuditLog("campaign.created", {
      userId: user.id,
      targetEntityId: newCampaign.id,
      metadata: { name, siteId: site_id },
    });

    revalidatePath(`/dashboard/sites/${site_id}/campaigns`);
    return { success: true, data: { id: newCampaign.id } };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: "error_invalid_data" };
    }
    logger.error("Error inesperado en createCampaignAction:", error);
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
// src/lib/actions/campaigns/create.action.ts