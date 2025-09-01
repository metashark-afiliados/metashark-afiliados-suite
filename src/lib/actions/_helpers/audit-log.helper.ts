// src/lib/actions/_helpers/audit-log.helper.ts
/**
 * @file src/lib/actions/_helpers/audit-log.helper.ts
 * @description Helper atómico y reutilizable para registrar eventos de auditoría.
 *              Alineado con la arquitectura de logging de élite (pino).
 * @author @author RaZ Podestá - MetaShark Tech
 * @version 2.0.0
 * @see .docs-espejo/lib/actions/_helpers/audit-log.helper.ts.md
 */
"use server";
import "server-only";

import { headers } from "next/headers";

import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import { type Json } from "@/lib/types/database";

/**
 * @public
 * @async
 * @function createAuditLog
 * @description Registra un evento de auditoría en la tabla `audit_logs`.
 * @param {string} action - El nombre de la acción realizada (ej. "user.login").
 * @param {object} details - Detalles del evento.
 * @param {string} [details.userId] - ID del usuario actor.
 * @param {string} [details.targetEntityId] - ID de la entidad afectada.
 * @param {string} [details.targetEntityType] - Tipo de la entidad afectada.
 * @param {Json} [details.metadata] - Metadatos adicionales en JSON.
 */
export async function createAuditLog(
  action: string,
  details: {
    userId?: string;
    targetEntityId?: string;
    targetEntityType?: string;
    metadata?: Json;
    [key: string]: any;
  }
) {
  logger.trace(`[AuditLogHelper] Intentando registrar acción: '${action}'`);
  try {
    const supabase = createClient();
    const ip = headers().get("x-forwarded-for") ?? "127.0.0.1";

    const { error } = await supabase.from("audit_logs").insert({
      action,
      actor_id: details.userId,
      target_entity_id: details.targetEntityId,
      target_entity_type: details.targetEntityType,
      metadata: details.metadata || {},
      ip_address: ip,
    });

    if (error) {
      // Utiliza la nueva firma de logging de pino
      logger.error(
        `[AuditLogHelper] No se pudo guardar el log de auditoría para la acción '${action}'`,
        { err: error }
      );
    } else {
      logger.trace(
        `[AuditLogHelper] Log de auditoría para '${action}' guardado con éxito.`
      );
    }
  } catch (e) {
    logger.error(
      `[AuditLogHelper] Fallo crítico al intentar guardar el log para la acción '${action}'`,
      { err: e }
    );
  }
}
// src/lib/actions/_helpers/audit-log.helper.ts
