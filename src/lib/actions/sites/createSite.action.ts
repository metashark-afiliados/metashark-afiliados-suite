// src/lib/actions/sites/createSite.action.ts
/**
 * @file createSite.action.ts
 * @description Server Action atómica para la creación de un nuevo sitio.
 * @author L.I.A. Legacy & RaZ WriTe (Arquitecto)
 * @version 1.0.0
 * @see .docs-espejo/lib/actions/sites/createSite.action.ts.md
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
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type ActionResult, CreateSiteServerSchema } from "@/lib/validators";

export async function createSiteAction(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const rawData = Object.fromEntries(formData);
  let userIdForErrorLog: string | undefined;

  try {
    const parsedData = CreateSiteServerSchema.parse(rawData);
    const { workspace_id, subdomain, name } = parsedData;

    const permissionCheck = await requireWorkspacePermission(workspace_id, [
      "owner",
      "admin",
      "member",
    ]);

    if (!permissionCheck.success) {
      logger.warn(
        `[SitesActions:createSite] Permiso denegado para usuario ${permissionCheck.data?.user?.id} en workspace ${workspace_id}.`
      );
      return {
        success: false,
        error: "ValidationErrors.sites_create_permission_denied",
      };
    }

    const { user } = permissionCheck.data;
    userIdForErrorLog = user.id;

    const supabase = createClient();

    const { data: newSite, error } = await supabase
      .from("sites")
      .insert({ ...parsedData, owner_id: user.id })
      .select("id")
      .single();

    if (error) {
      if (error.code === "23505") {
        // Unique constraint violation
        logger.warn(
          `[SitesActions:createSite] Intento de crear sitio con subdominio duplicado: ${subdomain}`
        );
        return {
          success: false,
          error: "ValidationErrors.sites_subdomain_already_in_use",
        };
      }
      // Re-lanzar otros errores de DB para ser capturados por el catch principal.
      throw error;
    }

    await createAuditLog("site.created", {
      userId: user.id,
      targetEntityId: newSite.id,
      targetEntityType: "site",
      metadata: { subdomain, name, workspaceId: workspace_id },
    });

    revalidatePath("/dashboard/sites");
    logger.info(`[SitesActions:createSite] Sitio ${name} creado con éxito.`, {
      siteId: newSite.id,
      userId: user.id,
    });
    return { success: true, data: { id: newSite.id } };
  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn(`[SitesActions:createSite] Datos de formulario inválidos:`, {
        errors: error.flatten(),
      });
      const firstError = error.errors[0]?.message;
      return {
        success: false,
        error: firstError || "ValidationErrors.error_invalid_data",
      };
    }

    const errorId = await createPersistentErrorLog(
      "createSiteAction.unexpected",
      error as Error,
      { userId: userIdForErrorLog, payload: rawData }
    );
    logger.error(
      `[SitesActions:createSite] Error inesperado. Log ID: ${errorId}`,
      {
        error,
      }
    );
    return { success: false, error: "ValidationErrors.error_server_generic" };
  }
}
// src/lib/actions/sites/createSite.action.ts
