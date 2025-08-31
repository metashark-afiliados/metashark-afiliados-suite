// src/lib/actions/profiles.actions.ts
/**
 * @file src/lib/actions/profiles.actions.ts
 * @description Contiene las Server Actions para la gestión del perfil del usuario.
 *              Ha sido refactorizado para validar su payload de entrada y consumir
 *              el contrato de tipo canónico, completando la inversión de control.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 2.0.0
 */
"use server";
import "server-only";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { type DashboardLayoutPreferences } from "@/lib/types/database/tables/profiles";
import {
  type ActionResult,
  DashboardLayoutPreferencesSchema,
} from "@/lib/validators";
import {
  createAuditLog,
  createPersistentErrorLog,
  getAuthenticatedUser,
} from "./_helpers";
import { logger } from "@/lib/logging";

/**
 * @public
 * @async
 * @function updateProfilePreferencesAction
 * @description Actualiza las preferencias de UI del usuario en la columna
 *              `dashboard_layout` de la tabla `profiles`.
 * @param {Partial<DashboardLayoutPreferences>} preferences - Un objeto con las preferencias a actualizar.
 * @returns {Promise<ActionResult<void>>} El resultado de la operación.
 */
export async function updateProfilePreferencesAction(
  preferences: Partial<DashboardLayoutPreferences>
): Promise<ActionResult<void>> {
  const authResult = await getAuthenticatedUser();
  if ("error" in authResult) return authResult.error;
  const { user } = authResult;

  logger.trace(
    `[ProfilesAction] Iniciando actualización de preferencias de UI para usuario ${user.id}`,
    preferences
  );

  const validation =
    DashboardLayoutPreferencesSchema.partial().safeParse(preferences);

  if (!validation.success) {
    logger.warn(
      `[ProfilesAction] Payload de preferencias inválido para usuario ${user.id}`,
      { errors: validation.error.flatten() }
    );
    return {
      success: false,
      error: "ValidationErrors.generic.error_invalid_data",
    };
  }

  try {
    const supabase = createClient();
    const { data: currentProfile, error: fetchError } = await supabase
      .from("profiles")
      .select("dashboard_layout")
      .eq("id", user.id)
      .single();

    if (fetchError) throw fetchError;

    const newLayout = {
      ...((currentProfile?.dashboard_layout as object) || {}),
      ...validation.data,
    };

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ dashboard_layout: newLayout })
      .eq("id", user.id);

    if (updateError) throw updateError;

    await createAuditLog("profile.preferences_updated", {
      userId: user.id,
      metadata: { updatedPreferences: validation.data },
    });

    revalidatePath("/dashboard", "layout");

    return { success: true, data: undefined };
  } catch (error) {
    const errorId = await createPersistentErrorLog(
      "updateProfilePreferencesAction",
      error as Error,
      {
        userId: user.id,
        preferences,
      }
    );
    logger.error(
      `[ProfilesAction] Fallo al actualizar preferencias para ${user.id}. Log ID: ${errorId}`
    );
    return {
      success: false,
      error: "ValidationErrors.generic.error_update_failed",
    };
  }
}
// src/lib/actions/profiles.actions.ts
