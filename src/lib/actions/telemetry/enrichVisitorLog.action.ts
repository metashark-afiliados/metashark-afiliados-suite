// src/lib/actions/telemetry/enrichVisitorLog.action.ts
/**
 * @file enrichVisitorLog.action.ts
 * @description Server Action atómica para enriquecer un log de visitante
 *              existente con datos del navegador del cliente. Refactorizada
 *              a un estándar de élite para cumplir con la Constitución.
 * @author L.I.A Legacy
 * @version 4.0.0
 * @see .docs-espejo/lib/actions/telemetry/enrichVisitorLog.action.ts.md
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
  // Extracción preliminar y segura del sessionId para el contexto de logging.
  const preliminarySessionId =
    typeof payload === "object" && payload !== null && "sessionId" in payload
      ? (payload as { sessionId: unknown }).sessionId
      : undefined;

  const context = { payload, sessionId: preliminarySessionId };

  try {
    const { sessionId, ...enrichmentData } =
      ClientEnrichmentSchema.parse(payload);

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
      { ...context, sessionId }, // Usar sessionId validado para el log de éxito.
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
      return {
        success: false,
        error: errorKey,
      };
    }

    const errorId = await createPersistentErrorLog(
      "enrichVisitorLogAction",
      error as Error,
      context // El contexto ya contiene el sessionId preliminar.
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
