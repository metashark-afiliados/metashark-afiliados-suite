// src/lib/actions/_helpers/error-log.helper.ts
/**
 * @file error-log.helper.ts
 * @description Helper atómico para registrar errores críticos persistentes en la base de datos.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use server";
import "server-only";

import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type Json, type TablesInsert } from "@/lib/types/database";

/**
 * @public
 * @async
 * @function createPersistentErrorLog
 * @description Inserta un registro de error en la tabla `system_errors`. Es
 *              una operación "fire-and-forget" resiliente.
 * @param {string} source - El identificador del módulo donde se originó el error.
 * @param {Error} error - El objeto de error capturado.
 * @param {Json} [metadata] - Datos contextuales adicionales.
 */
export async function createPersistentErrorLog(
  source: string,
  error: Error,
  metadata?: Json
) {
  try {
    const supabase = createClient();
    const logData: TablesInsert<"system_errors"> = {
      source,
      error_message: error.message,
      stack_trace: error.stack,
      metadata: metadata || {},
      status: "new",
    };

    const { error: insertError } = await supabase
      .from("system_errors")
      .insert(logData);

    if (insertError) {
      logger.error(
        `[ErrorLogHelper] FALLO AL REGISTRAR FALLO PERSISTENTE. Origen: ${source}`,
        insertError
      );
    }
  } catch (e) {
    logger.error(
      `[ErrorLogHelper] FALLO CRÍTICO irrecuperable en el helper de registro de errores. Origen: ${source}`,
      e
    );
  }
}
// src/lib/actions/_helpers/error-log.helper.ts
