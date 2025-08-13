/**
 * @file src/lib/actions/campaigns.actions.ts
 * @description Acciones de servidor de élite. Ha sido nivelado para consumir
 *              correctamente la nueva capa de datos atómica y para restaurar
 *              el contrato de tipos canónico, resolviendo todas las regresiones
 *              y errores de compilación.
 * @author Raz Podestá
 * @version 3.4.0
 */
"use server";
import "server-only";

import { revalidatePath } from "next/cache";
import { type User } from "@supabase/supabase-js";
import { ZodError } from "zod";

import { campaignsData, sites as sitesData } from "@/lib/data";
import { hasWorkspacePermission } from "@/lib/data/permissions";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import {
  type ActionResult,
  CreateCampaignSchema,
  DeleteCampaignSchema,
} from "@/lib/validators";

import { createAuditLog } from "./_helpers";

/**
 * @private
 * @async
 * @function getAuthenticatedUser
 * @description Helper interno para obtener el usuario autenticado.
 * @returns {Promise<{ user: User } | { error: ActionResult<never> }>}
 */
async function getAuthenticatedUser(): Promise<
  { user: User } | { error: ActionResult<never> }
> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    // --- CORRECCIÓN DE TIPO (TS2322) ---
    return { error: { success: false, error: "error_unauthenticated" } };
  }
  return { user };
}

/**
 * @public
 * @async
 * @function createCampaignAction
 * @description Crea una nueva campaña.
 * @param {FormData} formData
 * @returns {Promise<ActionResult<{ id: string }>>}
 */
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
      .insert({ name, slug, site_id, content: {} })
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
 * @public
 * @async
 * @function deleteCampaignAction
 * @description Elimina una campaña.
 * @param {FormData} formData
 * @returns {Promise<ActionResult<{ messageKey: string }>>}
 */
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
 * @public
 * @async
 * @function duplicateCampaignAction
 * @description Duplica una campaña.
 * @param {string} campaignId
 * @returns {Promise<ActionResult<{ id: string }>>}
 */
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

  const supabase = createClient();
  const { data: newCampaign, error: rpcError } = await supabase
    .rpc("duplicate_campaign_rpc", { campaign_id_to_duplicate: campaignId })
    .select("id")
    .single();

  if (rpcError || !newCampaign) {
    return { success: false, error: "error_duplication_failed" };
  }

  await createAuditLog("campaign.duplicated", {
    userId: user.id,
    targetEntityId: newCampaign.id,
    metadata: { originalCampaignId: campaignId },
  });

  revalidatePath(`/dashboard/sites/${original.site_id}/campaigns`);
  return { success: true, data: { id: newCampaign.id } };
}

/**
 * @public
 * @async
 * @function archiveCampaignAction
 * @description Archiva una campaña.
 * @param {string} campaignId
 * @returns {Promise<ActionResult<void>>}
 */
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
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización Arquitectónica**: ((Implementada)) Se ha corregido la importación y el consumo de la capa de datos para usar `campaignsData.editor.getCampaignContentById`, resolviendo definitivamente el error `TS2339`.
 * 2. **Corrección de Contrato de Tipos**: ((Implementada)) Se ha restaurado la firma de retorno canónica de `getAuthenticatedUser`, resolviendo el error `TS2322`.
 * @subsection Melhorias Futuras
 * 1. **RPC para Archiv/Eliminar**: ((Vigente)) Encapsular las acciones `archive` y `delete` en RPCs.
 * =====================================================================
 */
