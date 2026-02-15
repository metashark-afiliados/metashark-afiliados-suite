// src/lib/actions/creations/update-content.action.ts
/**
 * @file update-content.action.ts
 * @description Server Action atómica para actualizar el contenido de una `Creation`.
 *              Esta es la SSoT para la lógica de negocio de guardado de diseños.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use server";
import "server-only";

import { revalidatePath } from "next/cache";

import { createAuditLog, getAuthenticatedUser } from "@/lib/actions/_helpers";
import { type CampaignConfig } from "@/lib/builder/types.d";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type Json } from "@/lib/types/database";
import { type ActionResult } from "@/lib/validators";

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
  const authResult = await getAuthenticatedUser();
  if ("error" in authResult) {
    return authResult.error;
  }
  const { user } = authResult;

  logger.trace(
    `[UpdateCreationAction] Iniciando guardado para creationId: ${creationId}`,
    { userId: user.id }
  );

  try {
    const supabase = createClient();

    // 1. Verificación de Permisos: Asegurar que el usuario es el propietario.
    const { data: existingCreation, error: permissionError } = await supabase
      .from("creations")
      .select("id, name, created_by")
      .eq("id", creationId)
      .single();

    if (permissionError || !existingCreation) {
      return { success: false, error: "error_creation_not_found" };
    }

    if (existingCreation.created_by !== user.id) {
      logger.warn(
        `[SEGURIDAD] VIOLACIÓN: Usuario ${user.id} intentó guardar la 'creation' ${creationId} sin ser el propietario.`
      );
      return { success: false, error: "error_permission_denied" };
    }

    // 2. Ejecutar la mutación
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

    // 3. Auditoría y Revalidación
    await createAuditLog("creation.content_updated", {
      userId: user.id,
      targetEntityId: creationId,
      metadata: { creationName: content.name },
    });

    revalidatePath(`/builder/${creationId}`);

    logger.info(
      `[UpdateCreationAction] 'Creation' ${creationId} guardada con éxito.`
    );
    return { success: true, data: undefined };
  } catch (error) {
    logger.error(
      `[UpdateCreationAction] Fallo al guardar la 'creation' ${creationId}`,
      { error }
    );
    return { success: false, error: "error_update_failed" };
  }
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Lógica de Guardado Segura**: ((Implementada)) La acción incluye una verificación de permisos explícita, asegurando que solo el propietario de una `Creation` pueda modificarla.
 * 2. **Full Observabilidad y Resiliencia**: ((Implementada)) El flujo completo está envuelto en `try/catch` con logging detallado, y cada operación exitosa se registra en la tabla de auditoría.
 *
 * @subsection Melhorias Futuras
 * 1. **Validación de `content` con Zod**: ((Vigente)) Antes de la inserción, el objeto `content` debería ser validado contra un `CampaignConfigSchema` de Zod para garantizar la integridad de los datos guardados.
 * 2. **Revalidación de Rutas Públicas**: ((Vigente)) Si una `Creation` está asociada a una o más `Campaigns` publicadas, esta acción debería consultar esas campañas y revalidar sus rutas públicas (`/s/[subdomain]/[slug]`) para que los cambios se reflejen inmediatamente.
 *
 * =====================================================================
 */
// src/lib/actions/creations/update-content.action.ts
