// src/lib/actions/creations/update-content.action.ts
/**
 * @file update-content.action.ts
 * @description Server Action atómica para actualizar el contenido de una `Creation`.
 *              Esta es la SSoT para la lógica de negocio de guardado de diseños,
 *              ahora alineada con la Constitución de Observabilidad y el Manifiesto
 *              de Manejo de Errores.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 */
"use server";
import "server-only";

import { revalidatePath } from "next/cache";

import {
  createAuditLog,
  createPersistentErrorLog,
} from "@/lib/actions/_helpers";
import { getAuthUser } from "@/lib/auth/get-auth-user";
import { type CampaignConfig } from "@/lib/builder/types.d";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import { type Json } from "@/lib/types/database";
import { type ActionResult, type ValidationErrorKey } from "@/lib/validators";

/**
 * @public
 * @async
 * @function updateCreationContentAction
 * @description Actualiza el campo `content` de una `Creation` en la base de datos,
 *              previa validación de permisos.
 * @param {string} creationId - El ID de la `Creation` a actualizar.
 * @param {CampaignConfig} content - El nuevo objeto de configuración del diseño.
 * @returns {Promise<ActionResult<void>>} El resultado de la operación.
 */
export async function updateCreationContentAction(
  creationId: string,
  content: CampaignConfig
): Promise<ActionResult<void>> {
  const user = await getAuthUser();
  if (!user) {
    return { success: false, error: "generic.error_unauthenticated" };
  }

  const context = { userId: user.id, creationId };
  logger.trace(context, "[UpdateCreationAction] Iniciando guardado.");

  try {
    const supabase = createClient();

    const { data: existingCreation, error: permissionError } = await supabase
      .from("creations")
      .select("created_by")
      .eq("id", creationId)
      .single();

    if (permissionError || !existingCreation) {
      const errorKey: ValidationErrorKey = "sites.not_found"; // Reutilizando clave, idealmente sería 'creations.not_found'
      logger.warn(context, `[UpdateCreationAction] 'Creation' no encontrada.`);
      return { success: false, error: errorKey };
    }

    if (existingCreation.created_by !== user.id) {
      logger.warn(
        context,
        `[UpdateCreationAction] VIOLACIÓN DE PERMISOS: Intento de guardado no autorizado.`
      );
      return { success: false, error: "generic.error_permission_denied" };
    }

    const { error: updateError } = await supabase
      .from("creations")
      .update({
        content: content as unknown as Json,
        name: content.name,
        updated_at: new Date().toISOString(),
      })
      .eq("id", creationId);

    if (updateError) {
      throw updateError;
    }

    await createAuditLog("creation.content_updated", {
      userId: user.id,
      targetEntityId: creationId,
      metadata: { creationName: content.name },
    });

    revalidatePath(`/builder/${creationId}`);

    logger.info(
      context,
      `[UpdateCreationAction] 'Creation' guardada con éxito.`
    );
    return { success: true, data: undefined };
  } catch (error) {
    const errorId = await createPersistentErrorLog(
      "updateCreationContentAction",
      error as Error,
      context
    );
    logger.error(
      { err: error, errorId, ...context },
      `[UpdateCreationAction] Fallo al guardar la 'creation'.`
    );
    return {
      success: false,
      error: "generic.error_server_generic",
    };
  }
}
// src/lib/actions/creations/update-content.action.ts
