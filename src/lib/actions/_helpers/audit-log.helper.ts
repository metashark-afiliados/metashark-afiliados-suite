// src/lib/actions/_helpers/audit-log.helper.ts
/**
 * @file src/lib/actions/_helpers/audit-log.helper.ts
 * @description Helper atómico y SSoT para registrar eventos de auditoría.
 *              Esta es la Única Fuente de Verdad para la creación de registros
 *              inmutables de acciones críticas en la plataforma.
 * @author L.I.A. Legacy
 * @version 4.0.0
 */
"use server";
import "server-only";

import { headers } from "next/headers";

import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import { type Json } from "@/lib/types/database";

/**
 * @public
 * @interface AuditLogDetails
 * @description Define el contrato de datos para los detalles de un evento de auditoría.
 *              Proporciona una estructura clara y extensible para el contexto de la acción.
 */
export interface AuditLogDetails {
  /** El ID del usuario que realiza la acción (el actor). */
  userId?: string;
  /** El ID de la entidad que está siendo afectada (ej. siteId, campaignId). */
  targetEntityId?: string;
  /** El tipo de la entidad afectada (ej. "site", "workspace", "user"). */
  targetEntityType?: string;
  /** Cualquier metadato adicional relevante para la acción, en formato JSON. */
  metadata?: Json;
}

/**
 * @public
 * @async
 * @function createAuditLog
 * @description Registra un evento de auditoría en la tabla `audit_logs`. Es un pilar
 *              de la arquitectura de observabilidad y seguridad.
 * @param {string} action - El nombre de la acción realizada, usando notación de punto
 *        (ej. "user.login", "site.created").
 * @param {AuditLogDetails} details - Un objeto que contiene los detalles contextuales
 *        del evento de auditoría.
 * @returns {Promise<void>} Una promesa que resuelve cuando la operación ha concluido.
 *          La función maneja sus propios errores internos para no interrumpir
 *          el flujo principal de la Server Action que la invoca.
 */
export async function createAuditLog(
  action: string,
  details: AuditLogDetails
): Promise<void> {
  const context = { action, details };
  logger.trace(context, "[AuditLogHelper] Intentando registrar acción.");

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
      // Adherencia a la Directiva 1.1: El error es parte del contexto.
      logger.error(
        { err: error, ...context },
        "[AuditLogHelper] No se pudo guardar el log de auditoría."
      );
    } else {
      logger.trace(
        context,
        "[AuditLogHelper] Log de auditoría guardado con éxito."
      );
    }
  } catch (err) {
    // Adherencia a la Directiva 1.1: El error es parte del contexto.
    logger.error(
      { err, ...context },
      "[AuditLogHelper] Fallo crítico al intentar guardar el log."
    );
  }
}
// src/lib/actions/_helpers/audit-log.helper.ts
