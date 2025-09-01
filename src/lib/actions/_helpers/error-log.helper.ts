// src/lib/actions/_helpers/error-log.helper.ts
/**
 * @file error-log.helper.ts
 * @description Helper atómico para registrar errores críticos persistentes. Sanitiza
 *              robustamente los metadatos para garantizar la serialización JSON.
 * @author @author RaZ Podestá - MetaShark Tech
 * @version 2.0.0
 * @see .docs-espejo/lib/actions/_helpers/error-log.helper.ts.md
 */
"use server";
import "server-only";

import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import { type Json, type TablesInsert } from "@/lib/types/database";

/**
 * @private
 * @function sanitizeForJson
 * @description Sanea recursivamente un objeto para asegurar que sea serializable a JSON.
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
  return data;
}

/**
 * @public
 * @async
 * @function createPersistentErrorLog
 * @description Inserta un registro de error en la tabla `system_errors` y devuelve su ID.
 * @param {string} source - El módulo donde se originó el error (ej. "createSiteAction").
 * @param {Error} error - El objeto de error capturado.
 * @param {Record<string, any>} [metadata] - Datos contextuales adicionales que serán saneados.
 * @returns {Promise<string>} El ID del log de error creado, o una cadena genérica si la operación falla.
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
        { err: insertError }
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
      { err: e }
    );
    return "log-critical-failure";
  }
}
// src/lib/actions/_helpers/error-log.helper.ts
