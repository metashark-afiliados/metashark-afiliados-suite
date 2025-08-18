// src/lib/actions/_helpers/error-log.helper.ts
/**
 * @file error-log.helper.ts
 * @description Helper atómico para registrar errores críticos persistentes.
 *              Ha sido refactorizado para devolver el ID del log creado,
 *              permitiendo que la UI muestre un identificador de error trazable.
 * @author Raz Podestá
 * @version 2.0.0
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
 * @description Inserta un registro de error y devuelve su ID.
 * @param {string} source - El módulo donde se originó el error.
 * @param {Error} error - El objeto de error capturado.
 * @param {Json} [metadata] - Datos contextuales adicionales.
 * @returns {Promise<string>} El ID del log de error creado, o una cadena genérica si falla.
 */
export async function createPersistentErrorLog(
  source: string,
  error: Error,
  metadata?: Json
): Promise<string> {
  try {
    const supabase = createClient();
    const logData: TablesInsert<"system_errors"> = {
      source,
      error_message: error.message,
      stack_trace: error.stack,
      metadata: metadata || {},
      status: "new",
    };

    const { data, error: insertError } = await supabase
      .from("system_errors")
      .insert(logData)
      .select("id")
      .single();

    if (insertError) {
      logger.error(
        `[ErrorLogHelper] FALLO AL REGISTRAR FALLO PERSISTENTE. Origen: ${source}`,
        insertError
      );
      return "log-failed";
    }

    const errorId = String(data.id);
    logger.info(
      `[ErrorLogHelper] Error persistente registrado con ID: ${errorId}`
    );
    return errorId;
  } catch (e) {
    logger.error(
      `[ErrorLogHelper] FALLO CRÍTICO irrecuperable en el helper. Origen: ${source}`,
      e
    );
    return "log-critical-failure";
  }
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Trazabilidad de Errores**: ((Implementada)) La función ahora devuelve el ID del error registrado, una mejora crítica que permite a la UI mostrar un código de referencia al usuario para el soporte técnico.
 * =====================================================================
 */
// src/lib/actions/_helpers/error-log.helper.ts
