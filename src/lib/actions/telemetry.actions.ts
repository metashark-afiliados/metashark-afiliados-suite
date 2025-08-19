// src/lib/actions/telemetry.actions.ts
/**
 * @file telemetry.actions.ts
 * @description Aparato de acción atómico para la telemetría. Contiene la
 *              Server Action `logVisitorAction`, que es la SSoT para la lógica
 *              de negocio de registrar o enriquecer un log de visitante.
 * @author L.I.A. Legacy
 * @version 2.0.0
 */
"use server";
import "server-only";

import { ZodError } from "zod";

import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type TablesInsert } from "@/lib/types/database";
import { type ActionResult, VisitorLogSchema } from "@/lib/validators";

/**
 * @public
 * @async
 * @function logVisitorAction
 * @description Valida y realiza un upsert de los datos de un visitante en la tabla `visitor_logs`.
 *              Es una operación segura, idempotente y la única forma canónica de
 *              escribir datos de telemetría.
 * @param {unknown} payload - Los datos del visitante a registrar, que serán validados.
 * @returns {Promise<ActionResult<void>>} El resultado de la operación, conteniendo
 *          claves de i18n en caso de error.
 */
export async function logVisitorAction(
  payload: unknown
): Promise<ActionResult<void>> {
  try {
    const validatedPayload = VisitorLogSchema.parse(payload);
    const supabase = createClient();
    const { error } = await supabase
      .from("visitor_logs")
      .upsert(validatedPayload as TablesInsert<"visitor_logs">, {
        onConflict: "session_id",
      });

    if (error) {
      logger.error("[TelemetryAction] Error en upsert de visitante:", {
        error: error.message,
      });
      return { success: false, error: "ValidationErrors.error_server_generic" };
    }

    logger.info("[TelemetryAction] Log de visitante registrado/actualizado.", {
      sessionId: validatedPayload.session_id,
    });
    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn("[TelemetryAction] Payload de visitante inválido.", {
        errors: error.flatten(),
      });
      return { success: false, error: "ValidationErrors.invalid_data" };
    }
    logger.error("[TelemetryAction] Error inesperado en logVisitorAction:", {
      error: error instanceof Error ? error.message : String(error),
    });
    return { success: false, error: "ValidationErrors.error_unexpected" };
  }
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad de Lógica de Negocio**: ((Implementada)) Este nuevo aparato encapsula toda la lógica de negocio de la telemetría, convirtiéndose en un "Lego" reutilizable y la SSoT para esta operación.
 * 2. **Full Internacionalización**: ((Implementada)) Devuelve claves de i18n del namespace `ValidationErrors` en caso de fallo, adhiriéndose al protocolo.
 *
 * @subsection Melhorias Futuras
 * 1. **Enriquecimiento de `user_id`**: ((Vigente)) La acción podría intentar obtener la sesión del usuario actual (`supabase.auth.getUser()`) para vincular la sesión anónima a un usuario autenticado.
 *
 * =====================================================================
 */
// src/lib/actions/telemetry.actions.ts
