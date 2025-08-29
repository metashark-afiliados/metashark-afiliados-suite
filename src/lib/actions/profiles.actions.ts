// src/lib/actions/profiles.actions.ts
/**
 * @file src/lib/actions/profiles.actions.ts
 * @description Contiene las Server Actions para la gestión del perfil del
 *              usuario. Ha sido refactorizado holísticamente para que
 *              `updateProfilePreferencesAction` acepte el contrato de datos completo
 *              `DashboardLayoutPreferencesSchema`, resolviendo un error de tipo
 *              sistémico y permitiendo una personalización de UI persistente y de élite.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use server";
import "server-only";

import { revalidatePath } from "next/cache";
import { type z } from "zod";

import { createClient } from "@/lib/supabase/server";
import {
  type ActionResult,
  type DashboardLayoutPreferencesSchema,
} from "@/lib/validators";
import { getAuthenticatedUser } from "./_helpers";
import { logger } from "@/lib/logging";

/**
 * @public
 * @async
 * @function updateProfilePreferencesAction
 * @description Actualiza las preferencias de UI del usuario en la columna
 *              `dashboard_layout` de la tabla `profiles`.
 * @param {z.infer<typeof DashboardLayoutPreferencesSchema>} preferences - Un objeto con las preferencias a actualizar.
 * @returns {Promise<ActionResult<void>>} El resultado de la operación.
 */
export async function updateProfilePreferencesAction(
  preferences: z.infer<typeof DashboardLayoutPreferencesSchema>
): Promise<ActionResult<void>> {
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

  return { success: true, data: undefined };
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **Validación de `preferences` con Zod**: Antes de la fusión, el objeto `preferences` podría ser validado con `DashboardLayoutPreferencesSchema.safeParse()` para una capa adicional de seguridad en tiempo de ejecución.
 * 2. **Revalidación Condicional**: La revalidación de la ruta no es necesaria ya que la UI se actualiza de forma optimista. Sin embargo, si futuras preferencias afectaran el renderizado del servidor, se podría añadir una `revalidatePath("/dashboard", "layout")` condicional.
 * 3. **Logging de Cambios Específicos**: El log de `trace` podría ser mejorado para mostrar un "diff" entre las preferencias antiguas y las nuevas, proporcionando una auditoría más granular.
 * =====================================================================
 */
