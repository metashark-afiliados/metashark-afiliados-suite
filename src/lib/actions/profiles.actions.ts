// src/lib/actions/profiles.actions.ts
/**
 * @file src/lib/actions/profiles.actions.ts
 * @description Contiene las Server Actions para la gestión del perfil del usuario.
 *              Refactorizada para validar su payload, consumir la SSoT de
 *              autenticación, cumplir el contrato `ActionResult` y alinearse
 *              con la Constitución de Observabilidad.
 * @author L.I.A. Legacy
 * @version 4.0.0
 */
"use server";
import "server-only";

import { revalidatePath } from "next/cache";

import {
  createAuditLog,
  createPersistentErrorLog,
} from "@/lib/actions/_helpers";
import { getAuthUser } from "@/lib/auth/get-auth-user";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import { type DashboardLayoutPreferences } from "@/lib/types/database/tables/profiles";
import {
  type ActionResult,
  DashboardLayoutPreferencesSchema,
  type ValidationErrorKey,
} from "@/lib/validators";

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
  const user = await getAuthUser();
  if (!user) {
    return {
      success: false,
      error: "generic.error_unauthenticated" as ValidationErrorKey,
    };
  }

  const context = { userId: user.id, preferences };
  logger.trace(
    context,
    "[ProfilesAction] Iniciando actualización de preferencias de UI."
  );

  const validation =
    DashboardLayoutPreferencesSchema.partial().safeParse(preferences);

  if (!validation.success) {
    logger.warn(
      { userId: user.id, errors: validation.error.flatten() },
      "[ProfilesAction] Payload de preferencias inválido."
    );
    return {
      success: false,
      error: "generic.error_invalid_data" as ValidationErrorKey,
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
      context
    );
    logger.error(
      { err: error, errorId, ...context },
      `[ProfilesAction] Fallo al actualizar preferencias.`
    );
    return {
      success: false,
      error: "generic.error_update_failed" as ValidationErrorKey,
    };
  }
}
// src/lib/actions/profiles.actions.ts
