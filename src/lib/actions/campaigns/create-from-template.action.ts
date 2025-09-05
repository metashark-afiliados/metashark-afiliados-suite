// src/lib/actions/campaigns/create-from-template.action.ts
/**
 * @file create-from-template.action.ts
 * @description Orquestador de Server Action para crear una `Creation`.
 *              Refactorizado para alinear su firma de retorno con el contrato
 *              `ActionResult` completo, incluyendo `TErrorData`.
 * @author L.I.A Legacy
 * @version 8.0.0
 * @see .docs-espejo/lib/actions/campaigns/create-from-template.action.ts.md
 */
"use server";
import "server-only";

import { createPersistentErrorLog } from "@/lib/actions/_helpers";
import { BOILERPLATE_CREATION_ID } from "@/lib/builder/boilerplate";
import { generateCreationPayload } from "@/lib/builder/creation-payload.helper";
import { campaignsData } from "@/lib/data";
import { logger } from "@/lib/logger";
import { type ActionResult, type ValidationErrorKey } from "@/lib/validators";

import {
  handlePostCreationEffects,
  validateCampaignCreationPermissions,
} from "./_helpers";

/**
 * @public
 * @async
 * @function createCreationAction
 * @description Orquesta el flujo de creación de una nueva `Creation`.
 * @param {string} creationType - El tipo de creación a generar (ej. "landing-page").
 * @param {string} [siteId] - El ID opcional del sitio al que se asignará (lógica futura).
 * @returns {Promise<ActionResult<{ id: string }, { errorId: string }>>}
 */
export async function createCreationAction(
  creationType: string,
  siteId?: string
): Promise<ActionResult<{ id: string }, { errorId: string }>> {
  if (process.env.DEV_MODE_BOILERPLATE_CREATION === "true") {
    logger.warn(
      {},
      "[ActionOrchestrator] MODO BOILERPLATE ACTIVO. Omitiendo DB y devolviendo ID estático."
    );
    return { success: true, data: { id: BOILERPLATE_CREATION_ID } };
  }

  logger.trace(
    { siteId: siteId || "unassigned", creationType },
    "[ActionOrchestrator] Iniciando creación de 'Creation'."
  );

  const permissionResult = await validateCampaignCreationPermissions(siteId);
  if (!permissionResult.success) {
    return {
      success: false,
      error: permissionResult.error as ValidationErrorKey,
    };
  }
  const { user } = permissionResult.data;

  try {
    const creationPayload = generateCreationPayload({
      userId: user.id,
      workspaceId: "TBD-NEEDS-CONTEXT", // DEUDA: Obtener workspaceId del contexto
      name: `Nueva Creación (${creationType})`,
      type: creationType,
    });

    const newCampaign = await campaignsData.mutations.insertCampaignRecord(
      creationPayload as any
    );

    await handlePostCreationEffects({
      newCampaignId: newCampaign.id,
      userId: user.id,
      payload: {
        name: creationPayload.name,
        siteId,
        campaignType: creationType,
      },
    });

    return { success: true, data: { id: newCampaign.id } };
  } catch (error) {
    const errorId = await createPersistentErrorLog(
      "createCreationAction",
      error as Error,
      { userId: user.id, siteId, creationType }
    );

    logger.error(
      { err: error, errorId },
      `[ActionOrchestrator] Fallo crítico al crear 'Creation'.`
    );

    return {
      success: false,
      error: "generic.error_creation_failed" as ValidationErrorKey,
      data: { errorId },
    };
  }
}
// src/lib/actions/campaigns/create-from-template.action.ts
