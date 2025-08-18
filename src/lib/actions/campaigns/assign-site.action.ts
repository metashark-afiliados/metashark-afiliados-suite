// src/lib/actions/campaigns/assign-site.action.ts
"use server";
import "server-only";

import { revalidatePath } from "next/cache";

import { requireSitePermission } from "@/lib/auth/user-permissions";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type ActionResult } from "@/lib/validators";
import {
  createAuditLog,
  createPersistentErrorLog,
  getAuthenticatedUser,
} from "../_helpers";

/**
 * @public
 * @async
 * @function assignSiteToCampaignAction
 * @description [Arquitectura v12.0] Asigna una campaña "huérfana" a un sitio,
 *              validando que el usuario tenga permisos sobre el sitio de destino y
 *              sea el creador de la campaña.
 * @param {string} campaignId - El ID de la campaña a asignar.
 * @param {string} siteId - El ID del sitio de destino.
 * @returns {Promise<ActionResult<void>>} El resultado de la operación.
 */
export async function assignSiteToCampaignAction(
  campaignId: string,
  siteId: string
): Promise<ActionResult<void>> {
  const authResult = await getAuthenticatedUser();
  if ("error" in authResult) return authResult.error;
  const { user } = authResult;

  try {
    // 1. Validar permiso sobre el sitio de destino
    const sitePermissionCheck = await requireSitePermission(siteId, [
      "owner",
      "admin",
      "member",
    ]);
    if (!sitePermissionCheck.success) {
      return {
        success: false,
        error: "CampaignsPage.errors.permission_denied_site",
      };
    }
    const { site } = sitePermissionCheck.data;

    // 2. Obtener campaña y validar reglas de negocio
    const supabase = createClient();
    const { data: campaign, error: campaignError } = await supabase
      .from("campaigns")
      .select("id, name, site_id, created_by")
      .eq("id", campaignId)
      .single();

    if (campaignError || !campaign) {
      return {
        success: false,
        error: "CampaignsPage.errors.campaign_not_found",
      };
    }

    if (campaign.created_by !== user.id || campaign.site_id !== null) {
      logger.warn(
        `[SEGURIDAD] VIOLACIÓN DE ASIGNACIÓN: Usuario ${user.id} intentó asignar la campaña ${campaignId} sin ser el propietario o la campaña ya está asignada.`
      );
      return {
        success: false,
        error: "CampaignsPage.errors.assignment_not_allowed",
      };
    }

    // 3. Ejecutar la mutación
    const { error: updateError } = await supabase
      .from("campaigns")
      .update({ site_id: siteId })
      .eq("id", campaignId);

    if (updateError) {
      throw updateError;
    }

    // 4. Auditoría y Revalidación
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

    revalidatePath(`/builder/${campaignId}`);
    revalidatePath(`/dashboard/sites/${siteId}/campaigns`);

    return { success: true, data: undefined };
  } catch (error) {
    const errorId = await createPersistentErrorLog(
      "assignSiteToCampaignAction",
      error as Error,
      { userId: user.id, siteId, campaignId }
    );
    logger.error(
      `Error inesperado en assignSiteToCampaignAction. Log ID: ${errorId}`
    );
    return { success: false, error: "CampaignsPage.errors.unexpected" };
  }
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Lógica de Asignación Segura**: ((Implementada)) La acción implementa una doble verificación de permisos: el usuario debe ser el creador de la campaña "huérfana" Y tener permisos sobre el sitio de destino.
 * 2. **Atomicidad (SRP)**: ((Implementada)) Este aparato encapsula una única y crítica operación de negocio.
 * 3. **Full Observabilidad y Resiliencia**: ((Implementada)) El flujo completo está envuelto en `try/catch` con registro de errores persistente, y cada punto de decisión lógico es registrado.
 *
 * @subsection Melhorias Futuras
 * 1. **Contrato de Error I18n**: ((Implementada)) Los mensajes de error son claves que deben ser añadidas al schema de i18n para su correcta traducción en la UI.
 * 2. **Transacciones RPC**: ((Vigente)) Si en el futuro esta acción necesitara realizar más de una operación de escritura, debería ser migrada a una función RPC de PostgreSQL para garantizar la atomicidad transaccional.
 *
 * =====================================================================
 */
// src/lib/actions/campaigns/assign-site.action.ts
