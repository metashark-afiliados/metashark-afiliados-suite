// src/lib/actions/telemetry/logVisitor.action.ts
/**
 * @file logVisitor.action.ts
 * @description Server Action atómica para la creación/actualización inicial
 *              de un log de visitante. Refactorizada para alinearse con la
 *              Constitución de Observabilidad y Errores Soberanos.
 * @author RaZ Podestá - MetaShark Tech
 * @version 4.0.0
 */
"use server";
import "server-only";

import { ZodError } from "zod";

import { createPersistentErrorLog } from "@/lib/actions/_helpers";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import { type TablesInsert } from "@/lib/types/database";
import {
  type ActionResult,
  VisitorLogSchema,
  type ValidationErrorKey,
} from "@/lib/validators";

/**
 * @public
 * @async
 * @function logVisitorAction
 * @description [Servidor/Middleware] Valida y realiza un upsert de los datos iniciales de un visitante.
 * @param {unknown} payload - Los datos iniciales del visitante.
 * @returns {Promise<ActionResult<void>>} El resultado de la operación.
 */
export async function logVisitorAction(
  payload: unknown
): Promise<ActionResult<void>> {
  const context = { payload };
  try {
    const validatedPayload = VisitorLogSchema.parse(payload);
    const supabase = createClient();
    const { error } = await supabase
      .from("visitor_logs")
      .upsert(validatedPayload as TablesInsert<"visitor_logs">, {
        onConflict: "session_id",
      });

    if (error) {
      throw error;
    }

    logger.info(
      { sessionId: validatedPayload.session_id },
      "[logVisitorAction] Log de visitante registrado/actualizado."
    );
    return { success: true, data: undefined };
  } catch (error) {
    let errorKey: ValidationErrorKey = "generic.error_server_generic";

    if (error instanceof ZodError) {
      errorKey = "generic.error_invalid_data";
      logger.warn(
        { errors: error.flatten(), ...context },
        "[logVisitorAction] Payload de visitante inválido."
      );
      // No se persiste el error de validación
    } else {
      // Persistir solo errores inesperados del servidor
      const errorId = await createPersistentErrorLog(
        "logVisitorAction",
        error as Error,
        context
      );
      logger.error(
        { err: error, errorId, ...context },
        "[logVisitorAction] Error inesperado."
      );
    }

    return {
      success: false,
      error: errorKey,
    };
  }
}
// src/lib/actions/telemetry/logVisitor.action.ts
