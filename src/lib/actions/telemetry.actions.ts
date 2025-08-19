// src/lib/actions/telemetry.actions.ts
/**
 * @file telemetry.actions.ts
 * @description Aparato de acciones atómicas para la telemetría. Ha sido
 *              refactorizado a un estándar de élite para separar la lógica de
 *              creación inicial (`logVisitorAction`) de la de enriquecimiento
 *              desde el cliente (`enrichVisitorLogAction`).
 * @author L.I.A. Legacy
 * @version 3.0.0
 */
"use server";
import "server-only";

import { ZodError } from "zod";

import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type Json, type TablesInsert } from "@/lib/types/database";
import {
  type ActionResult,
  ClientEnrichmentSchema,
  VisitorLogSchema,
} from "@/lib/validators";

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
      return { success: false, error: "ValidationErrors.error_server_generic" };
    }
    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn("[TelemetryAction] Payload de enriquecimiento inválido.", {
        errors: error.flatten(),
      });
      return { success: false, error: "ValidationErrors.invalid_data" };
    }
    logger.error(
      "[TelemetryAction] Error inesperado en enrichVisitorLogAction:",
      { error: error instanceof Error ? error.message : String(error) }
    );
    return { success: false, error: "ValidationErrors.error_unexpected" };
  }
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad de Acciones (SRP)**: ((Implementada)) La lógica se ha dividido en dos acciones distintas y atómicas, una implementación de élite del Principio de Responsabilidad Única.
 *
 * =====================================================================
 */
// src/lib/actions/telemetry.actions.ts
