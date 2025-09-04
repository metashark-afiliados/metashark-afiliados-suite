// src/lib/actions/campaigns/create.action.ts
/**
 * @file create.action.ts
 * @description Server Action atómica para crear una nueva campaña desde cero.
 *              Refactorizada a un estándar de élite para utilizar una RPC de
 *              PostgreSQL (`create_campaign_with_creation`), garantizando la
 *              atomicidad transaccional en la creación de las entidades
 *              `Creation` y `Campaign`.
 * @author Raz Podesta - MetaShark Tech
 * @version 5.0.0
 */
"use server";
import "server-only";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import {
  createAuditLog,
  createPersistentErrorLog,
} from "@/lib/actions/_helpers";
import { getAuthenticatedUserOrThrow } from "@/lib/actions/_helpers/auth.helper";
import { requireSitePermission } from "@/lib/auth/user-permissions";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import {
  type ActionResult,
  CreateCampaignSchema,
  type ValidationErrorKey,
} from "@/lib/validators";

/**
 * @public
 * @async
 * @function createCampaignAction
 * @description Orquesta el flujo de creación de una nueva campaña. Valida permisos,
 *              invoca una RPC transaccional para crear la `Creation` y la `Campaign`
 *              atómicas, y maneja los efectos secundarios como la auditoría y la
 *              revalidación de caché.
 * @param {FormData} formData - Datos del formulario que contienen el nombre, slug y siteId.
 * @returns {Promise<ActionResult<{ id: string }>>} El resultado de la operación,
 *          conteniendo el ID de la nueva `Creation` en caso de éxito.
 */
export async function createCampaignAction(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const rawData = Object.fromEntries(formData);
  let context: Record<string, any> = { payload: rawData };

  try {
    const user = await getAuthenticatedUserOrThrow();
    context.userId = user.id;

    logger.trace(context, "[createCampaignAction] Iniciando acción.");

    const { name, slug, site_id } = CreateCampaignSchema.parse(rawData);

    const permissionCheck = await requireSitePermission(site_id, [
      "owner",
      "admin",
      "member",
    ]);
    if (!permissionCheck.success) {
      return { success: false, error: "sites.create_permission_denied" };
    }
    const { site } = permissionCheck.data;

    const supabase = createClient();
    const { data: newCreation, error: rpcError } = await supabase
      .rpc("create_campaign_with_creation", {
        p_name: name,
        p_slug: slug,
        p_site_id: site_id,
        p_user_id: user.id,
        p_workspace_id: site.workspace_id,
        p_initial_content: { theme: "light", blocks: [] },
      })
      .select("id")
      .single();

    if (rpcError) throw rpcError;
    if (!newCreation) throw new Error("RPC did not return the new creation ID");

    await createAuditLog("campaign.created", {
      userId: user.id,
      targetEntityId: newCreation.id, // Auditar sobre la Creation
      metadata: { name, slug, siteId: site_id },
    });

    revalidatePath(`/dashboard/sites/${site_id}/campaigns`);
    logger.info(
      { creationId: newCreation.id, ...context },
      "[createCampaignAction] Campaña y Creation creadas con éxito vía RPC."
    );
    return { success: true, data: { id: newCreation.id } };
  } catch (error) {
    let errorKey: ValidationErrorKey = "campaigns.create_failed";
    if (error instanceof ZodError) {
      errorKey = error.errors[0].message as ValidationErrorKey;
    } else if (error instanceof Error && error.message.includes("23505")) {
      // Error de unicidad (slug + site_id)
      errorKey = "sites.subdomain_already_in_use"; // Reutilizando, idealmente sería 'campaigns.slug_in_use'
    }

    const errorId = await createPersistentErrorLog(
      "createCampaignAction",
      error as Error,
      context
    );
    logger.error(
      { err: error, errorId, ...context },
      "[createCampaignAction] Fallo en la acción."
    );
    return { success: false, error: errorKey };
  }
}
// src/lib/actions/campaigns/create.action.ts
