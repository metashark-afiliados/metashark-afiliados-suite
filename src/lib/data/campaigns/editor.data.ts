/**
 * @file src/lib/data/campaigns/editor.data.ts
 * @description Aparato de datos atómico. Su única responsabilidad es obtener
 *              el contenido completo de una campaña para el editor (`/builder`).
 * @author Raz Podestá
 * @version 1.0.0
 */
"use server";

import { hasWorkspacePermission } from "@/lib/data/permissions";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";

import { type CampaignWithContent } from "./types";

export async function getCampaignContentById(
  campaignId: string,
  userId: string
): Promise<CampaignWithContent | null> {
  const supabase = createClient();
  const { data: campaign, error } = await supabase
    .from("campaigns")
    .select(`*, sites (workspace_id, subdomain)`)
    .eq("id", campaignId)
    .single();

  if (error || !campaign) {
    if (error && error.code !== "PGRST116") {
      logger.error(`Error al obtener la campaña ${campaignId}:`, error);
    }
    return null;
  }

  const workspaceId = campaign.sites?.workspace_id;
  if (!workspaceId) {
    logger.error(
      `INCONSISTENCIA: Campaña ${campaignId} sin workspace asociado.`
    );
    return null;
  }

  const isAuthorized = await hasWorkspacePermission(userId, workspaceId, [
    "owner",
    "admin",
    "member",
  ]);

  if (!isAuthorized) {
    logger.warn(
      `SEGURIDAD: Usuario ${userId} intentó acceder a la campaña ${campaignId} sin permisos.`
    );
    return null;
  }

  return campaign as CampaignWithContent;
}
