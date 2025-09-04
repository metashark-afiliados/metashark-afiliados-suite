// src/lib/actions/telemetry/enrichVisitorLog.action.ts
/**
 * @file enrichVisitorLog.action.ts
 * @description Server Action atómica para enriquecer un log de visitante
 *              existente con datos del navegador del cliente. Refactorizada
 *              a un estándar de élite para cumplir con la Constitución.
 * @author L.I.A Legacy
 * @version 4.0.0
 */
"use server";
import "server-only";

import { ZodError } from "zod";

import { createPersistentErrorLog } from "@/lib/actions/_helpers";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import { type Json } from "@/lib/types/database";
import {
  type ActionResult,
  ClientEnrichmentSchema,
  type ValidationErrorKey,
} from "@/lib/validators";

/**
 * @public
 * @async
 * @function enrichVisitorLogAction
 * @description [Cliente] Enriquece un log de visitante existente con datos del navegador.
 * @param {unknown} payload - Datos de enriquecimiento del cliente.
 * @returns {Promise<ActionResult<void>>} El resultado de la operación.
 */
export async function enrichVisitorLogAction(
  payload: unknown
): Promise<ActionResult<void>> {
  const context = { payload };
  try {
    const { sessionId, ...enrichmentData } =
      ClientEnrichmentSchema.parse(payload);
    context.sessionId = sessionId;

    const browserContext = enrichmentData.browser_context as Json;

    const updatePayload = {
      fingerprint: enrichmentData.fingerprint,
      browser_context: browserContext,
    };

    const supabase = createClient();
    const { error } = await supabase
      .from("visitor_logs")
      .update(updatePayload)
      .eq("session_id", sessionId);

    if (error) {
      throw error;
    }

    logger.trace(
      context,
      "[enrichVisitorLogAction] Log de visitante enriquecido."
    );

    return { success: true, data: undefined };
  } catch (error) {
    let errorKey: ValidationErrorKey = "generic.error_server_generic";

    if (error instanceof ZodError) {
      errorKey = "generic.error_invalid_data";
      logger.warn(
        { errors: error.flatten(), ...context },
        "[enrichVisitorLogAction] Payload de enriquecimiento inválido."
      );
      // No persistir errores de validación de cliente.
      return {
        success: false,
        error: errorKey,
      };
    }

    const errorId = await createPersistentErrorLog(
      "enrichVisitorLogAction",
      error as Error,
      context
    );
    logger.error(
      { err: error, errorId, ...context },
      "[enrichVisitorLogAction] Error inesperado."
    );

    return {
      success: false,
      error: errorKey,
    };
  }
}
// src/lib/actions/telemetry/enrichVisitorLog.action.ts
