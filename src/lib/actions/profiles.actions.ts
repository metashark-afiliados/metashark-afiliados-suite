// src/lib/actions/profiles.actions.ts
/**
 * @file src/lib/actions/profiles.actions.ts
 * @description Contiene las Server Actions para la gestión del perfil del
 *              usuario. Ampliado para incluir la persistencia de preferencias de UI.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use server";
import "server-only";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { type ActionResult } from "@/lib/validators";
import { getAuthenticatedUser } from "./_helpers";
import { logger } from "@/lib/logging";

/**
 * @public
 * @async
 * @function updateProfilePreferencesAction
 * @description Actualiza las preferencias de UI del usuario en la columna
 *              `dashboard_layout` de la tabla `profiles`.
 * @param {object} preferences - Un objeto con las preferencias a actualizar.
 * @returns {Promise<ActionResult<void>>} El resultado de la operación.
 */
export async function updateProfilePreferencesAction(preferences: {
  isSidebarCollapsed: boolean;
}): Promise<ActionResult<void>> {
  const authResult = await getAuthenticatedUser();
  if ("error" in authResult) return authResult.error;
  const { user } = authResult;

  logger.trace(
    `[ProfilesAction] Actualizando preferencias de UI para usuario ${user.id}`,
    preferences
  );

  const supabase = createClient();
  const { data: currentProfile, error: fetchError } = await supabase
    .from("profiles")
    .select("dashboard_layout")
    .eq("id", user.id)
    .single();

  if (fetchError) {
    logger.error(
      `[ProfilesAction] Error al obtener perfil para actualizar preferencias:`,
      fetchError
    );
    return { success: false, error: "error_server_generic" };
  }

  const newLayout = {
    ...((currentProfile?.dashboard_layout as object) || {}),
    ...preferences,
  };

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ dashboard_layout: newLayout })
    .eq("id", user.id);

  if (updateError) {
    logger.error(
      `[ProfilesAction] Error al guardar preferencias:`,
      updateError
    );
    return { success: false, error: "error_update_failed" };
  }

  // No es necesario revalidar la ruta, ya que la UI se actualiza
  // de forma optimista desde el estado del cliente.
  return { success: true, data: undefined };
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Persistencia de Preferencias en DB:** Esta nueva acción proporciona el endpoint de backend necesario para la sincronización de estado entre dispositivos.
 * =====================================================================
 */
// src/lib/actions/profiles.actions.ts
