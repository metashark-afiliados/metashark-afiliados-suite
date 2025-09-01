// src/lib/actions/sites/updateSite.action.ts
/**
 * @file updateSite.action.ts
 * @description Server Action atómica para la actualización general de un sitio.
 * @author L.I.A. Legacy & RaZ WriTe (Arquitecto)
 * @version 1.0.0
 * @see .docs-espejo/lib/actions/sites/updateSite.action.ts.md
 */
"use server";
import "server-only";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import {
  createAuditLog,
  createPersistentErrorLog,
} from "@/lib/actions/_helpers";
import { requireSitePermission } from "@/lib/auth/user-permissions";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type ActionResult, UpdateSiteSchema } from "@/lib/validators";

export async function updateSiteAction(
  formData: FormData
): Promise<ActionResult<{ message: string }>> {
  const rawData = Object.fromEntries(formData);
  let userIdForErrorLog: string | undefined;

  try {
    const { site_id, ...updateData } = UpdateSiteSchema.parse(rawData);

    const permissionCheck = await requireSitePermission(site_id, [
      "owner",
      "admin",
    ]);
    if (!permissionCheck.success) {
      logger.warn(
        `[SitesActions:updateSite] Permiso denegado para usuario ${permissionCheck.data?.user?.id} en sitio ${site_id}.`
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
      .update(updateData)
      .eq("id", site_id);

    if (error) {
      throw error;
    }

    await createAuditLog("site.updated", {
      userId: user.id,
      targetEntityId: site_id,
      targetEntityType: "site",
      metadata: { changes: updateData },
    });

    revalidatePath("/dashboard/sites");
    revalidatePath(`/dashboard/sites/${site_id}/settings`);
    logger.info(
      `[SitesActions:updateSite] Sitio ${site_id} actualizado con éxito.`,
      { userId: user.id, updateData }
    );
    return {
      success: true,
      data: { message: "Sitio actualizado correctamente." }, // NOTA: Este mensaje es para un toast de admin, puede ser hardcodeado o migrado a un namespace `AdminToasts`.
    };
  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn(`[SitesActions:updateSite] Datos de formulario inválidos:`, {
        errors: error.flatten(),
      });
      const firstError = error.errors[0]?.message;
      return {
        success: false,
        error: firstError || "ValidationErrors.error_invalid_data",
      };
    }

    const errorId = await createPersistentErrorLog(
      "updateSiteAction.unexpected",
      error as Error,
      { userId: userIdForErrorLog, payload: rawData }
    );
    logger.error(
      `[SitesActions:updateSite] Error inesperado. Log ID: ${errorId}`,
      {
        error: error instanceof Error ? error.message : String(error),
      }
    );
    return { success: false, error: "ValidationErrors.error_server_generic" };
  }
}
// src/lib/actions/sites/updateSite.action.ts
