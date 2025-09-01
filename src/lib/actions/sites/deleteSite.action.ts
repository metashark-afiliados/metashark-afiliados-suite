// src/lib/actions/sites/deleteSite.action.ts
/**
 * @file deleteSite.action.ts
 * @description Server Action atómica para la eliminación de un sitio.
 * @author L.I.A. Legacy & RaZ WriTe (Arquitecto)
 * @version 1.0.0
 * @see .docs-espejo/lib/actions/sites/deleteSite.action.ts.md
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
import { type ActionResult, DeleteSiteSchema } from "@/lib/validators";

export async function deleteSiteAction(
  formData: FormData
): Promise<ActionResult<{ message: string }>> {
  let siteId: string | undefined;
  const rawData = Object.fromEntries(formData);
  let userIdForErrorLog: string | undefined;

  try {
    const parsedData = DeleteSiteSchema.parse(rawData);
    siteId = parsedData.siteId;

    const permissionCheck = await requireSitePermission(siteId, ["owner"]);
    if (!permissionCheck.success) {
      logger.warn(
        `[SitesActions:deleteSite] Permiso denegado para usuario ${permissionCheck.data?.user?.id} en sitio ${siteId}.`
      );
      return {
        success: false,
        error: "ValidationErrors.sites_delete_permission_denied",
      };
    }
    const { user, site } = permissionCheck.data;
    userIdForErrorLog = user.id;

    const supabase = createClient();
    const { error } = await supabase.from("sites").delete().eq("id", siteId);

    if (error) {
      throw error;
    }

    await createAuditLog("site.deleted", {
      userId: user.id,
      targetEntityId: siteId,
      targetEntityType: "site",
      metadata: { subdomain: site.subdomain },
    });

    revalidatePath("/dashboard/sites");
    logger.info(
      `[SitesActions:deleteSite] Sitio ${site.subdomain} eliminado con éxito.`,
      { siteId, userId: user.id }
    );
    return {
      success: true,
      data: { message: "Sitio eliminado correctamente." }, // NOTA: Mensaje para toast de admin.
    };
  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn(`[SitesActions:deleteSite] ID de sitio inválido:`, {
        errors: error.flatten(),
      });
      const firstError = error.errors[0]?.message;
      return {
        success: false,
        error: firstError || "ValidationErrors.sites_delete_invalid_id",
      };
    }

    const errorId = await createPersistentErrorLog(
      "deleteSiteAction.unexpected",
      error as Error,
      {
        siteId: siteId ?? "unknown",
        userId: userIdForErrorLog,
        payload: rawData,
      }
    );
    logger.error(
      `[SitesActions:deleteSite] Error inesperado. Log ID: ${errorId}`,
      {
        error,
      }
    );
    return { success: false, error: "ValidationErrors.error_server_generic" };
  }
}
// src/lib/actions/sites/deleteSite.action.ts
