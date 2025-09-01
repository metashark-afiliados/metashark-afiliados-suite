// src/lib/actions/telemetry/enrichVisitorLog.action.ts
/**
 * @file enrichVisitorLog.action.ts
 * @description Server Action atómica para enriquecer un log de visitante
 *              existente con datos del navegador del cliente.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 * @see .docs-espejo/lib/actions/telemetry/enrichVisitorLog.action.ts.md
 */
"use server";
import "server-only";

import { ZodError } from "zod";

import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type Json } from "@/lib/types/database";
import { type ActionResult, ClientEnrichmentSchema } from "@/lib/validators";

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
      logger.error(
        `[TelemetryAction] Error al enriquecer log para sesión ${sessionId}:`,
        { error: error.message }
      );
      return {
        success: false,
        error: "ValidationErrors.generic.error_server_generic",
      };
    }
    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn("[TelemetryAction] Payload de enriquecimiento inválido.", {
        errors: error.flatten(),
      });
      return {
        success: false,
        error: "ValidationErrors.generic.error_invalid_data",
      };
    }
    logger.error(
      "[TelemetryAction] Error inesperado en enrichVisitorLogAction:",
      { error: error instanceof Error ? error.message : String(error) }
    );
    return {
      success: false,
      error: "ValidationErrors.generic.error_unexpected",
    };
  }
}
// src/lib/actions/telemetry/enrichVisitorLog.action.ts
