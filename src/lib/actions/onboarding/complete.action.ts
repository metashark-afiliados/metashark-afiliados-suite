// src/lib/actions/onboarding/complete.action.ts
/**
 * @file complete.action.ts
 * @description Server Action atómica para completar el onboarding del usuario.
 *              Refactorizada a un estándar de élite, alineada con la SSoT de
 *              autenticación, el contrato `ActionResult` y la Constitución de
 *              Observabilidad.
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
import { type ActionResult, type ValidationErrorKey } from "@/lib/validators";

/**
 * @public
 * @async
 * @function completeOnboardingAction
 * @description Marca el flag `has_completed_onboarding` del usuario actual como `true`.
 *              Esta acción es un paso crucial en el ciclo de vida del usuario,
 *              indicando que ha superado el flujo de bienvenida inicial.
 * @returns {Promise<ActionResult<void>>} El resultado de la operación.
 */
export async function completeOnboardingAction(): Promise<ActionResult<void>> {
  const user = await getAuthUser();
  if (!user) {
    logger.warn(
      {},
      "[OnboardingAction] Intento no autenticado de completar onboarding."
    );
    return {
      success: false,
      error: "onboarding.unauthenticated",
    };
  }

  const context = { userId: user.id };

  try {
    logger.trace(
      context,
      "[OnboardingAction] Iniciando actualización de estado."
    );
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ has_completed_onboarding: true })
      .eq("id", user.id);

    if (error) {
      logger.error(
        { err: error, ...context },
        "[OnboardingAction] Fallo al actualizar el perfil en la base de datos."
      );
      return {
        success: false,
        error: "onboarding.update_failed",
      };
    }

    await createAuditLog("onboarding.completed", { userId: user.id });

    // Revalida el layout del dashboard para que el WelcomeModal no se vuelva a mostrar.
    revalidatePath("/dashboard", "layout");

    logger.info(context, "[OnboardingAction] Onboarding completado con éxito.");
    return { success: true, data: undefined };
  } catch (error) {
    const errorId = await createPersistentErrorLog(
      "completeOnboardingAction.unexpected",
      error as Error,
      context
    );
    logger.error(
      { err: error, errorId, ...context },
      "[OnboardingAction] Error inesperado en la acción."
    );
    return {
      success: false,
      error: "generic.error_server_generic",
    };
  }
}
// src/lib/actions/onboarding/complete.action.ts
