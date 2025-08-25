/**
 * @file create-from-template.action.ts
 * @description Orquestador de Server Action para crear una `Creation`.
 *              Ha sido refactorizado para alinearse con la arquitectura de "Creations",
 *              consumiendo la SSoT de boilerplate canónica y el helper de payload
 *              de creaciones, en lugar del de campañas.
 * @author Raz Podestá - MetaShark Tech
 * @version 6.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use server";
import "server-only";

import { createPersistentErrorLog } from "@/lib/actions/_helpers";
// --- INICIO DE CORRECCIÓN DE NOMENCLATURA Y LÓGICA (TS2724) ---
import { BOILERPLATE_CREATION_ID } from "@/lib/builder/boilerplate";
import { generateCreationPayload } from "@/lib/builder/creation-payload.helper";
import { campaignsData } from "@/lib/data"; // Mantener para la lógica de inserción actual
// --- FIN DE CORRECCIÓN ---
import { logger } from "@/lib/logging";
import { type ActionResult } from "@/lib/validators";

import {
  handlePostCreationEffects,
  validateCampaignCreationPermissions,
} from "./_helpers";

/**
 * @public
 * @async
 * @function createCampaignFromTemplateAction
 * @description Orquesta el flujo de creación de una nueva `Creation`.
 * @param {string} creationType - El tipo de creación a generar (ej. "landing-page").
 * @param {string} [siteId] - El ID opcional del sitio al que se asignará (lógica futura).
 * @returns {Promise<ActionResult<{ id: string }, { errorId: string }>>}
 */
export async function createCampaignFromTemplateAction(
  creationType: string,
  siteId?: string
): Promise<ActionResult<{ id: string }, { errorId: string }>> {
  // --- INICIO DE CORRECCIÓN DE CONSTANTE (TS2724) ---
  if (process.env.DEV_MODE_BOILERPLATE_CREATION === "true") {
    logger.warn(
      "[ActionOrchestrator] MODO BOILERPLATE ACTIVO. Omitiendo DB y devolviendo ID estático."
    );
    return { success: true, data: { id: BOILERPLATE_CREATION_ID } };
  }
  // --- FIN DE CORRECCIÓN DE CONSTANTE (TS2724) ---

  logger.trace("[ActionOrchestrator] Iniciando creación de 'Creation'.", {
    siteId: siteId || "unassigned",
    creationType,
  });

  const permissionResult = await validateCampaignCreationPermissions(siteId);
  if (!permissionResult.success) {
    return { success: false, error: permissionResult.error };
  }
  const { user } = permissionResult.data;

  try {
    // La lógica de creación de payload y la inserción se refactorizarán para usar `creations`
    // en una fase posterior. Por ahora, se mantiene la lógica de `campaigns`
    // para asegurar la no regresión de la funcionalidad existente.
    const campaignPayload = generateCreationPayload({
      // Placeholder para la futura migración
      userId: user.id,
      workspaceId: "TBD", // Necesita obtenerse del contexto
      name: `Nueva Creación (${creationType})`,
      type: creationType,
    });

    // TODO: Reemplazar con campaignsData.creations.insertCreationRecord
    const newCampaign = await campaignsData.management.insertCampaignRecord(
      campaignPayload as any
    );

    await handlePostCreationEffects({
      newCampaignId: newCampaign.id,
      userId: user.id,
      payload: {
        name: campaignPayload.name,
        siteId,
        campaignType: creationType,
      },
    });

    return { success: true, data: { id: newCampaign.id } };
  } catch (error) {
    const errorId = await createPersistentErrorLog(
      "createCampaignFromTemplateAction",
      error as Error,
      { userId: user.id, siteId, creationType }
    );

    return {
      success: false,
      error: "CampaignsPage.errors.unexpected",
      data: { errorId },
    };
  }
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error de Compilación (TS2724)**: ((Implementada)) Se ha corregido la importación y el uso de la constante de boilerplate, resolviendo el error de tipo.
 * 2. **Alineación Semántica Parcial**: ((Implementada)) Los parámetros y la documentación se han actualizado para usar la terminología de "Creation", preparando el terreno para la migración completa de la lógica de negocio.
 *
 * @subsection Melhorias Futuras
 * 1. **Migración Lógica Completa a `Creations`**: ((Vigente)) La acción aún utiliza `insertCampaignRecord`. El siguiente paso de élite es refactorizarla para que interactúe exclusivamente con la entidad `creations`, obteniendo el `workspaceId` activo del contexto del usuario.
 *
 * =====================================================================
 */
