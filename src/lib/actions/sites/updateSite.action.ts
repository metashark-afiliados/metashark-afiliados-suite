// src/lib/actions/sites/updateSite.action.ts
/**
 * @file updateSite.action.ts
 * @description Server Action atómica para la actualización general de un sitio.
 *              Refactorizada para adherirse al contrato `ActionResult` blindado,
 *              la Constitución de Observabilidad y la SSoT de seguridad.
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
  UpdateSiteSchema,
  type ValidationErrorKey,
} from "@/lib/validators";

/**
 * @public
 * @async
 * @function updateSiteAction
 * @description Orquesta la actualización de los metadatos de un sitio.
 * @param {FormData} formData - Los datos del formulario de actualización.
 * @returns {Promise<ActionResult<{ messageKey: ValidationErrorKey }>>} El resultado de la operación.
 */
export async function updateSiteAction(
  formData: FormData
): Promise<ActionResult<{ messageKey: ValidationErrorKey }>> {
  const rawData = Object.fromEntries(formData);
  let context: Record<string, any> = { payload: rawData };

  try {
    const { site_id, ...updateData } = UpdateSiteSchema.parse(rawData);
    context.siteId = site_id;
    context.updateData = updateData;

    const permissionCheck = await requireSitePermission(site_id, [
      "owner",
      "admin",
    ]);
    if (!permissionCheck.success) {
      context.userId = permissionCheck.data?.user?.id;
      logger.warn(context, `[updateSiteAction] Permiso denegado.`);
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
    logger.info(context, `[updateSiteAction] Sitio actualizado con éxito.`);
    return {
      success: true,
      data: { messageKey: "sites.update_success" },
    };
  } catch (error) {
    let errorKey: ValidationErrorKey;

    if (error instanceof ZodError) {
      errorKey = error.errors[0]?.message as ValidationErrorKey;
      logger.warn(
        { errors: error.flatten(), ...context },
        `[updateSiteAction] Datos de formulario inválidos.`
      );
    } else {
      errorKey = "generic.error_server_generic";
    }

    const errorId = await createPersistentErrorLog(
      "updateSiteAction",
      error as Error,
      context
    );
    logger.error(
      { err: error, errorId, ...context },
      `[updateSiteAction] Error inesperado.`
    );
    return {
      success: false,
      error: errorKey,
    };
  }
}
// src/lib/actions/sites/updateSite.action.ts
