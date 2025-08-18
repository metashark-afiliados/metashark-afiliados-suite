// src/lib/actions/onboarding.actions.ts
/**
 * @file src/lib/actions/onboarding.actions.ts
 * @description Aparato de acción atómico para gestionar el ciclo de vida del onboarding.
 *              Ha sido corregido para alinear la sintaxis de la llamada a Supabase
 *              con el contrato de la API, resolviendo una regresión funcional crítica.
 * @author Raz Podestá
 * @version 1.1.0
 */
"use server";
import "server-only";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { type ActionResult } from "@/lib/validators";
import { createAuditLog } from "./_helpers";
import { logger } from "@/lib/logging";

/**
 * @public
 * @async
 * @function completeOnboardingAction
 * @description Marca el onboarding del usuario actual como completado.
 * @returns {Promise<ActionResult<void>>} El resultado de la operación.
 */
export async function completeOnboardingAction(): Promise<ActionResult<void>> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "error_unauthenticated" };
  }

  // --- INICIO DE CORRECCIÓN DE REGRESIÓN FUNCIONAL ---
  const { error } = await supabase
    .from("profiles")
    .update({ has_completed_onboarding: true })
    .eq("id", user.id);
  // --- FIN DE CORRESIÓN DE REGRESIÓN FUNCIONAL ---

  if (error) {
    logger.error(
      `[OnboardingAction] Fallo al actualizar el perfil para el usuario ${user.id}`,
      { error }
    );
    return { success: false, error: "error_update_failed" };
  }

  await createAuditLog("onboarding.completed", { userId: user.id });

  revalidatePath("/dashboard", "layout");
  return { success: true, data: undefined };
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Corrección de Regresión Crítica**: ((Implementada)) Se ha reestructurado la llamada a `supabase.from(...).update(...).eq(...)` para asegurar que se resuelva a una promesa, alineándola con la sintaxis correcta de la API de Supabase y resolviendo el `TypeError`.
 * 2. **Observabilidad Mejorada**: ((Implementada)) Se ha añadido un `logger.error` contextualizado en el caso de fallo de la base de datos, mejorando la capacidad de diagnóstico.
 *
 * @subsection Melhorias Futuras
 * 1. **Otorgar Recompensas**: ((Vigente)) Esta acción podría otorgar un logro ("Primeros Pasos") o tokens de IA al usuario.
 *
 * =====================================================================
 */
// src/lib/actions/onboarding.actions.ts
