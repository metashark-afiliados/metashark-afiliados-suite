// src/lib/actions/sites/updateSiteName.action.ts
/**
 * @file updateSiteName.action.ts
 * @description Server Action atómica para actualizar el nombre de un sitio.
 *              Refactorizada a un estándar de élite para adherirse a la firma
 *              de logging canónica, el contrato `ActionResult` blindado y la
 *              observabilidad completa.
 * @author L.I.A. Legacy
 * @version 4.0.0
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
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import {
  type ActionResult,
  UpdateSiteNameSchema,
  type ValidationErrorKey,
} from "@/lib/validators";

/**
 * @public
 * @async
 * @function updateSiteNameAction
 * @description Actualiza el nombre de un sitio específico, validando los permisos del actor.
 * @param {string} siteId - El UUID del sitio a actualizar.
 * @param {string} newName - El nuevo nombre para el sitio.
 * @returns {Promise<ActionResult<void>>} Un objeto `ActionResult`.
 */
export async function updateSiteNameAction(
  siteId: string,
  newName: string
): Promise<ActionResult<void>> {
  const context: Record<string, any> = { siteId, newName };

  try {
    const validation = UpdateSiteNameSchema.safeParse({
      siteId,
      name: newName,
    });
    if (!validation.success) {
      const firstError = validation.error.errors[0];
      logger.warn(
        { errors: validation.error.flatten(), ...context },
        "[updateSiteNameAction] Datos de entrada inválidos."
      );
      return {
        success: false,
        error: firstError.message as ValidationErrorKey,
      };
    }

    const permissionCheck = await requireSitePermission(siteId, [
      "owner",
      "admin",
    ]);
    if (!permissionCheck.success) {
      context.userId = permissionCheck.data?.user?.id;
      logger.warn(context, "[updateSiteNameAction] Permiso denegado.");
      return {
        success: false,
        error: "sites.update_permission_denied",
      };
    }
    const { user } = permissionCheck.data;
    context.userId = user.id;

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
      context,
      "[updateSiteNameAction] Nombre del sitio actualizado."
    );
    return { success: true, data: undefined };
  } catch (error) {
    const errorId = await createPersistentErrorLog(
      "updateSiteNameAction",
      error as Error,
      context
    );
    logger.error(
      { err: error, errorId, ...context },
      `[updateSiteNameAction] Error inesperado.`
    );
    return {
      success: false,
      error: "generic.error_server_generic",
    };
  }
}
// src/lib/actions/sites/updateSiteName.action.ts
