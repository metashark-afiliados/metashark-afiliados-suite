// src/lib/actions/sites/deleteSite.action.ts
/**
 * @file deleteSite.action.ts
 * @description Server Action atómica para la eliminación de un sitio.
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
  DeleteSiteSchema,
  type ValidationErrorKey,
} from "@/lib/validators";

/**
 * @public
 * @async
 * @function deleteSiteAction
 * @description Orquesta la eliminación de un sitio, validando que el actor
 *              sea el 'owner' del workspace asociado.
 * @param {FormData} formData - Los datos del formulario que contienen `siteId`.
 * @returns {Promise<ActionResult<{ messageKey: ValidationErrorKey }>>} El resultado de la operación.
 */
export async function deleteSiteAction(
  formData: FormData
): Promise<ActionResult<{ messageKey: ValidationErrorKey }>> {
  const rawData = Object.fromEntries(formData);
  let context: Record<string, any> = { payload: rawData };

  try {
    const { siteId } = DeleteSiteSchema.parse(rawData);
    context.siteId = siteId;

    const permissionCheck = await requireSitePermission(siteId, ["owner"]);
    if (!permissionCheck.success) {
      const userId = permissionCheck.data?.user?.id;
      context.userId = userId;
      logger.warn(context, `[deleteSiteAction] Permiso denegado.`);
      return {
        success: false,
        error: "sites.delete_permission_denied",
      };
    }
    const { user, site } = permissionCheck.data;
    context.userId = user.id;

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
    logger.info(context, `[deleteSiteAction] Sitio eliminado con éxito.`);
    return {
      success: true,
      data: { messageKey: "sites.delete_success" },
    };
  } catch (error) {
    let errorKey: ValidationErrorKey;

    if (error instanceof ZodError) {
      errorKey = error.errors[0]?.message as ValidationErrorKey;
      logger.warn(
        { errors: error.flatten(), ...context },
        `[deleteSiteAction] ID de sitio inválido.`
      );
    } else {
      errorKey = "generic.error_server_generic";
    }

    const errorId = await createPersistentErrorLog(
      "deleteSiteAction",
      error as Error,
      context
    );
    logger.error(
      { err: error, errorId, ...context },
      `[deleteSiteAction] Error inesperado.`
    );
    return {
      success: false,
      error: errorKey,
    };
  }
}
// src/lib/actions/sites/deleteSite.action.ts
