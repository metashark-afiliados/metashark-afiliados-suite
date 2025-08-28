// src/lib/actions/onboarding.actions.ts
/**
 * @file src/lib/actions/onboarding.actions.ts
 * @description Aparato de acción atómico para gestionar el ciclo de vida del onboarding.
 *              Ha sido refactorizado holísticamente para **centralizar los mensajes
 *              de error en el namespace `shared.ValidationErrors`** y registrar
 *              errores persistentes, mejorando la observabilidad y la consistencia.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use server";
import "server-only";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { type ActionResult } from "@/lib/validators";
import { createAuditLog, createPersistentErrorLog } from "./_helpers"; // Importar createPersistentErrorLog
import { logger } from "@/lib/logging";

/**
 * @public
 * @async
 * @function completeOnboardingAction
 * @description Marca el onboarding del usuario actual como completado.
 *              Registra errores persistentes si falla la actualización.
 * @returns {Promise<ActionResult<void>>} El resultado de la operación.
 */
export async function completeOnboardingAction(): Promise<ActionResult<void>> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Error centralizado ---
    logger.warn(
      "[OnboardingAction] Intento no autenticado de completar onboarding."
    );
    return {
      success: false,
      error: "ValidationErrors.onboarding_unauthenticated",
    };
    // --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---
  }

  try {
    const { error } = await supabase
      .from("profiles")
      .update({ has_completed_onboarding: true })
      .eq("id", user.id);

    if (error) {
      logger.error(
        `[OnboardingAction] Fallo al actualizar el perfil para el usuario ${user.id}`,
        { error }
      );
      // --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Error centralizado y persistente ---
      await createPersistentErrorLog("completeOnboardingAction.update", error, {
        userId: user.id,
      });
      return {
        success: false,
        error: "ValidationErrors.onboarding_update_failed",
      };
      // --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---
    }

    await createAuditLog("onboarding.completed", { userId: user.id });

    revalidatePath("/dashboard", "layout");
    return { success: true, data: undefined };
  } catch (error) {
    // --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Manejo de errores inesperados ---
    const errorId = await createPersistentErrorLog(
      "completeOnboardingAction.unexpected",
      error as Error,
      { userId: user.id }
    );
    logger.error(`[OnboardingAction] Error inesperado. Log ID: ${errorId}`, {
      error: error instanceof Error ? error.message : String(error),
    });
    return { success: false, error: "ValidationErrors.error_server_generic" };
    // --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---
  }
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Centralización de Errores (SSoT)**: ((Implementada)) Todos los mensajes de error `hardcodeados` ahora utilizan claves del namespace `shared.ValidationErrors` con prefijos de dominio (`onboarding_`). Esto consolida la "Única Fuente de Verdad" para los errores de onboarding.
 * 2. **Full Observabilidad Mejorada**: ((Implementada)) Se ha integrado `createPersistentErrorLog` para registrar errores de actualización y errores inesperados, proporcionando una trazabilidad completa para el diagnóstico en producción.
 * 3. **Consistencia en el Manejo de Errores**: ((Implementada)) Se ha estandarizado la forma en que los errores son reportados por la Server Action, haciendo que el `ActionResult` de error sea más predecible.
 * 4. **No Regresión Funcional**: ((Implementada)) La lógica de negocio principal se mantiene intacta, con la mejora centrada en la resiliencia y la internacionalización.
 *
 * @subsection Melhorias Futuras
 * 1. **Otorgar Recompensas o Beneficios**: ((Vigente)) Una vez que el onboarding se completa, esta acción podría desencadenar la concesión de logros (`achievements`) o tokens de IA iniciales (`user_tokens`) al usuario, como parte de un sistema de gamificación.
 *
 * =====================================================================
 */
