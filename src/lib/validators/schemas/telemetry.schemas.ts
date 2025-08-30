// src/lib/validators/schemas/telemetry.schemas.ts
/**
 * @file src/lib/validators/schemas/telemetry.schemas.ts
 * @description Aparato de validación atómico y SSoT para el sistema de telemetría.
 *              Este módulo encapsula los schemas de Zod para validar los payloads
 *              de telemetría tanto en la creación inicial (middleware) como en el
 *              enriquecimiento posterior (cliente).
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-30
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { z } from "zod";
import { UuidSchema } from "./_base.schemas";

/**
 * @public
 * @constant VisitorLogSchema
 * @description Valida el payload completo para la creación de un nuevo log de
 *              visitante. Usado por el middleware y la acción `logVisitorAction`.
 */
export const VisitorLogSchema = z.object({
  session_id: UuidSchema,
  fingerprint: z
    .string()
    .min(1, { message: "ValidationErrors.generic.fingerprint_required" })
    .optional(), // Opcional porque el servidor no lo tiene inicialmente
  ip_address: z.string().ip({ message: "ValidationErrors.generic.invalid_ip" }),
  geo_data: z.record(z.any()).nullable().optional(),
  user_agent: z.string().nullable().optional(),
  utm_params: z.record(z.any()).nullable().optional(),
  referrer: z.string().url().nullable().optional(),
  landing_page: z.string().nullable().optional(),
  browser_context: z.record(z.any()).nullable().optional(),
  is_bot: z.boolean().optional(),
  is_known_abuser: z.boolean().optional(),
});

/**
 * @public
 * @constant ClientEnrichmentSchema
 * @description Valida el payload parcial enviado desde el `TelemetryClientLogger`
 *              para enriquecer un log existente.
 */
export const ClientEnrichmentSchema = z.object({
  sessionId: UuidSchema,
  fingerprint: z
    .string()
    .min(1, { message: "ValidationErrors.generic.fingerprint_required" }),
  browser_context: z.record(z.any()).nullable().optional(),
});