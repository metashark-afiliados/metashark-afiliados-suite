// src/lib/actions/telemetry/logVisitor.action.ts
/**
 * @file logVisitor.action.ts
 * @description Server Action atómica para la creación/actualización inicial
 *              de un log de visitante.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 * @see .docs-espejo/lib/actions/telemetry/logVisitor.action.ts.md
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
 * @description [Servidor] Valida y realiza un upsert de los datos iniciales de un visitante.
 * @param {unknown} payload - Los datos iniciales del visitante (desde el middleware).
 * @returns {Promise<ActionResult<void>>} El resultado de la operación.
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
      return {
        success: false,
        error: "ValidationErrors.generic.error_server_generic",
      };
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
      return {
        success: false,
        error: "ValidationErrors.generic.error_invalid_data",
      };
    }
    logger.error("[TelemetryAction] Error inesperado en logVisitorAction:", {
      error: error instanceof Error ? error.message : String(error),
    });
    return {
      success: false,
      error: "ValidationErrors.generic.error_unexpected",
    };
  }
}
// src/lib/actions/telemetry/logVisitor.action.ts
