// src/lib/actions/campaigns/create-from-template.action.ts
/**
 * @file create-from-template.action.ts
 * @description Orquestador de Server Action para crear una campaña.
 *              Sincronizado para consumir el helper de payload desde su
 *              nuevo módulo atómico.
 * @author Raz Podestá
 * @version 5.0.0
 */
"use server";
import "server-only";

import { campaignsData } from "@/lib/data";
import { logger } from "@/lib/logging";
import { type ActionResult } from "@/lib/validators";
import { BOILERPLATE_CAMPAIGN_ID } from "@/lib/builder/boilerplate";
import { generateCampaignPayload } from "@/lib/builder/campaign-payload.helper"; // <-- RUTA CORREGIDA

import { createPersistentErrorLog } from "../_helpers";
import {
  handlePostCreationEffects,
  validateCampaignCreationPermissions,
} from "./_helpers";

/**
 * @public
 * @async
 * @function createCampaignFromTemplateAction
 * @description Orquesta el flujo de creación de una nueva campaña.
 * @param {string} campaignType - El tipo de campaña a crear.
 * @param {string} [siteId] - El ID opcional del sitio al que se asignará.
 * @returns {Promise<ActionResult<{ id: string }, { errorId: string }>>}
 */
export async function createCampaignFromTemplateAction(
  campaignType: string,
  siteId?: string
): Promise<ActionResult<{ id: string }, { errorId: string }>> {
  if (process.env.DEV_MODE_BOILERPLATE_CAMPAIGN === "true") {
    logger.warn(
      "[ActionOrchestrator] MODO BOILERPLATE ACTIVO. Omitiendo DB y devolviendo ID estático."
    );
    return { success: true, data: { id: BOILERPLATE_CAMPAIGN_ID } };
  }

  logger.trace("[ActionOrchestrator] Iniciando creación de campaña.", {
    siteId: siteId || "unassigned",
    campaignType,
  });

  const permissionResult = await validateCampaignCreationPermissions(siteId);
  if (!permissionResult.success) {
    return { success: false, error: permissionResult.error };
  }
  const { user } = permissionResult.data;

  try {
    const campaignPayload = generateCampaignPayload({
      userId: user.id,
      campaignType,
      siteId,
    });

    const newCampaign =
      await campaignsData.management.insertCampaignRecord(campaignPayload);

    await handlePostCreationEffects({
      newCampaignId: newCampaign.id,
      userId: user.id,
      payload: {
        name: campaignPayload.name,
        siteId,
        campaignType,
      },
    });

    return { success: true, data: { id: newCampaign.id } };
  } catch (error) {
    const errorId = await createPersistentErrorLog(
      "createCampaignFromTemplateAction",
      error as Error,
      { userId: user.id, siteId, campaignType }
    );

    return {
      success: false,
      error: "CampaignsPage.errors.unexpected",
      data: { errorId },
    };
  }
}
// src/lib/actions/campaigns/create-from-template.action.ts
