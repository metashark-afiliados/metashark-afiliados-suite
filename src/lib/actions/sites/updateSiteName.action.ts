// src/lib/actions/sites/updateSiteName.action.ts
/**
 * @file updateSiteName.action.ts
 * @description Server Action atómica para actualizar el nombre de un sitio.
 * @author L.I.A. Legacy & RaZ WriTe (Arquitecto)
 * @version 1.0.0
 * @see .docs-espejo/lib/actions/sites/updateSiteName.action.ts.md
 */
"use server";
import "server-only";

import { revalidatePath } from "next/cache";

import {
  createAuditLog,
  createPersistentErrorLog,
} from "@/lib/actions/_helpers";
import { requireSitePermission } from "@/lib/auth/user-permissions";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type ActionResult, UpdateSiteNameSchema } from "@/lib/validators";

export async function updateSiteNameAction(
  siteId: string,
  newName: string
): Promise<ActionResult<void>> {
  let userIdForErrorLog: string | undefined;

  try {
    const validation = UpdateSiteNameSchema.safeParse({
      siteId,
      name: newName,
    });
    if (!validation.success) {
      logger.warn(`[SitesActions:updateSiteName] Datos de entrada inválidos.`, {
        errors: validation.error.flatten(),
        siteId,
        newName,
      });
      const firstError = validation.error.errors[0]?.message;
      return {
        success: false,
        error: firstError || "ValidationErrors.error_invalid_data",
      };
    }

    const permissionCheck = await requireSitePermission(siteId, [
      "owner",
      "admin",
    ]);
    if (!permissionCheck.success) {
      logger.warn(
        `[SitesActions:updateSiteName] Permiso denegado para usuario ${permissionCheck.data?.user?.id} en sitio ${siteId}.`
      );
      return {
        success: false,
        error: "ValidationErrors.sites_update_permission_denied",
      };
    }
    const { user } = permissionCheck.data;
    userIdForErrorLog = user.id;

    const supabase = createClient();
    const { error } = await supabase
      .from("sites")
      .update({ name: newName, updated_at: new Date().toISOString() })
      .eq("id", siteId);

    if (error) {
      throw error;
    }

    await createAuditLog("site.name_updated", {
      userId: user.id,
      targetEntityId: siteId,
      targetEntityType: "site",
      metadata: { newName },
    });

    revalidatePath("/dashboard/sites");
    revalidatePath(`/dashboard/sites/${siteId}/campaigns`);

    logger.info(
      `[SitesActions:updateSiteName] Nombre del sitio ${siteId} actualizado a '${newName}'.`,
      { userId: user.id }
    );
    return { success: true, data: undefined };
  } catch (error) {
    const errorId = await createPersistentErrorLog(
      "updateSiteNameAction.unexpected",
      error as Error,
      { siteId, newName, userId: userIdForErrorLog }
    );
    logger.error(
      `[SitesActions:updateSiteName] Error inesperado. Log ID: ${errorId}`,
      {
        error: error instanceof Error ? error.message : String(error),
      }
    );
    return { success: false, error: "ValidationErrors.error_server_generic" };
  }
}
// src/lib/actions/sites/updateSiteName.action.ts
