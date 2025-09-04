// src/lib/actions/sites/createSite.action.ts
/**
 * @file createSite.action.ts
 * @description Server Action atómica para la creación de un nuevo sitio.
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
import { requireWorkspacePermission } from "@/lib/auth/user-permissions";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import {
  type ActionResult,
  CreateSiteServerSchema,
  type ValidationErrorKey,
} from "@/lib/validators";

/**
 * @public
 * @async
 * @function createSiteAction
 * @description Orquesta la creación de un nuevo sitio, validando permisos y
 *              manejando la inserción en la base de datos.
 * @param {FormData} formData - Los datos del formulario de creación.
 * @returns {Promise<ActionResult<{ id: string }>>} El resultado de la operación.
 */
export async function createSiteAction(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const rawData = Object.fromEntries(formData.entries());
  let context: Record<string, any> = { payload: rawData };

  try {
    const parsedData = CreateSiteServerSchema.parse(rawData);
    const { workspace_id, subdomain, name } = parsedData;
    context.parsedData = parsedData;

    const permissionCheck = await requireWorkspacePermission(workspace_id, [
      "owner",
      "admin",
      "member",
    ]);

    if (!permissionCheck.success) {
      const userId = permissionCheck.data?.user?.id;
      context.userId = userId;
      logger.warn(context, `[createSiteAction] Permiso denegado.`);
      return {
        success: false,
        error: "sites.create_permission_denied",
      };
    }

    const { user } = permissionCheck.data;
    context.userId = user.id;

    const supabase = createClient();
    const { data: newSite, error } = await supabase
      .from("sites")
      .insert({ ...parsedData, owner_id: user.id })
      .select("id")
      .single();

    if (error) {
      if (error.code === "23505") {
        logger.warn(
          context,
          `[createSiteAction] Intento de crear sitio con subdominio duplicado.`
        );
        return {
          success: false,
          error: "sites.subdomain_already_in_use",
        };
      }
      throw error;
    }

    await createAuditLog("site.created", {
      userId: user.id,
      targetEntityId: newSite.id,
      targetEntityType: "site",
      metadata: { subdomain, name, workspaceId: workspace_id },
    });

    revalidatePath("/dashboard/sites");
    logger.info(
      { siteId: newSite.id, ...context },
      `[createSiteAction] Sitio creado.`
    );
    return { success: true, data: { id: newSite.id } };
  } catch (error) {
    let errorKey: ValidationErrorKey;

    if (error instanceof ZodError) {
      errorKey = error.errors[0]?.message as ValidationErrorKey;
      logger.warn(
        { errors: error.flatten(), ...context },
        `[createSiteAction] Datos de formulario inválidos.`
      );
    } else {
      errorKey = "generic.error_server_generic";
    }

    const errorId = await createPersistentErrorLog(
      "createSiteAction",
      error as Error,
      context
    );
    logger.error(
      { err: error, errorId, ...context },
      `[createSiteAction] Error inesperado.`
    );
    return {
      success: false,
      error: errorKey,
    };
  }
}
// src/lib/actions/sites/createSite.action.ts
