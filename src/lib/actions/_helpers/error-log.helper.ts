// src/lib/actions/_helpers/error-log.helper.ts
/**
 * @file error-log.helper.ts
 * @description Helper atómico para registrar errores críticos persistentes.
 *              Ha sido refactorizado holísticamente para sanitizar de forma
 *              robusta los metadatos, aceptando cualquier objeto y garantizando
 *              la serialización JSON, resolviendo una cascada de errores TS2345.
 * @author Raz Podestá
 * @version 3.0.0
 */
"use server";
import "server-only";

import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type Json, type TablesInsert } from "@/lib/types/database";

/**
 * @private
 * @function sanitizeForJson
 * @description Sanea recursivamente un objeto para asegurar que sea serializable a JSON.
 *              Convierte objetos `File` en un formato serializable y maneja otros tipos no estándar.
 * @param {any} data - Los datos a sanear.
 * @returns {Json} Los datos saneados y listos para ser serializados.
 */
function sanitizeForJson(data: any): Json {
  if (data === undefined) {
    return null;
  }
  if (data instanceof File) {
    return {
      fileName: data.name,
      fileSize: data.size,
      fileType: data.type,
      _sanitized: "FileObject",
    };
  }
  if (Array.isArray(data)) {
    return data.map(sanitizeForJson);
  }
  if (typeof data === "object" && data !== null) {
    const sanitizedObj: { [key: string]: Json } = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        sanitizedObj[key] = sanitizeForJson(data[key]);
      }
    }
    return sanitizedObj;
  }
  // Primitivos, null, etc., son seguros.
  return data;
}

/**
 * @public
 * @async
 * @function createPersistentErrorLog
 * @description Inserta un registro de error y devuelve su ID.
 * @param {string} source - El módulo donde se originó el error.
 * @param {Error} error - El objeto de error capturado.
 * @param {Record<string, any>} [metadata] - Datos contextuales adicionales que serán saneados.
 * @returns {Promise<string>} El ID del log de error creado, o una cadena genérica si falla.
 */
export async function createPersistentErrorLog(
  source: string,
  error: Error,
  metadata?: Record<string, any>
): Promise<string> {
  try {
    const supabase = createClient();
    const sanitizedMetadata = metadata ? sanitizeForJson(metadata) : {};

    const logData: TablesInsert<"system_errors"> = {
      source,
      error_message: error.message,
      stack_trace: error.stack,
      metadata: sanitizedMetadata,
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
 * @subsection Melhorias Futuras
 * 1. **Manejo de Profundidad Máxima**: ((Vigente)) La función de saneamiento recursivo podría ser mejorada para incluir un límite de profundidad y prevenir desbordamientos de pila con objetos circulares o extremadamente anidados.
 * 2. **Tipado de Retorno de Saneamiento**: ((Vigente)) El tipo `Json` es amplio. Se podrían utilizar genéricos avanzados para inferir un tipo de retorno más preciso de la función `sanitizeForJson`.
 * =====================================================================
 */
// src/lib/actions/_helpers/error-log.helper.ts
