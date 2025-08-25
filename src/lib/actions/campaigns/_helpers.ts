// src/lib/actions/campaigns/_helpers.ts
/**
 * @file src/lib/actions/campaigns/_helpers.ts
 * @description Aparatos helper atómicos para las Server Actions de campañas.
 *              Refactorizado para contener únicamente funciones asíncronas
 *              compatibles con la directiva "use server".
 * @author Raz Podestá
 * @version 2.0.0
 */
"use server";
import "server-only";

import { revalidatePath } from "next/cache";
import { type User } from "@supabase/supabase-js";

import { requireSitePermission } from "@/lib/auth/user-permissions";
import { type ActionResult } from "@/lib/validators";

import { createAuditLog, getAuthenticatedUser } from "../_helpers";

/**
 * @public
 * @async
 * @function validateCampaignCreationPermissions
 * @description Valida que el usuario esté autenticado y, si se provee un siteId,
 *              que tenga permisos para crear campañas en ese sitio.
 * @param {string} [siteId] - El ID opcional del sitio.
 * @returns {Promise<ActionResult<{ user: User }>>} El objeto de usuario si es exitoso.
 */
export async function validateCampaignCreationPermissions(
  siteId?: string
): Promise<ActionResult<{ user: User }>> {
  const authResult = await getAuthenticatedUser();
  if ("error" in authResult) return authResult.error;
  const { user } = authResult;

  if (siteId) {
    const permissionCheck = await requireSitePermission(siteId, [
      "owner",
      "admin",
      "member",
    ]);
    if (!permissionCheck.success) {
      return {
        success: false,
        error: "CampaignsPage.errors.permission_denied",
      };
    }
  }
  return { success: true, data: { user } };
}

/**
 * @public
 * @async
 * @function handlePostCreationEffects
 * @description Encapsula los efectos secundarios post-creación: auditoría y revalidación.
 * @param {object} params - Los parámetros necesarios para los efectos.
 */
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

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error de Build**: ((Implementada)) Se ha eliminado la función síncrona `generateCampaignPayload`, resolviendo la causa del error.
 * 2. **Cohesión Arquitectónica**: ((Implementada)) El módulo ahora cumple estrictamente con el contrato de "use server".
 *
 * =====================================================================
 */
// src/lib/actions/campaigns/_helpers.ts
