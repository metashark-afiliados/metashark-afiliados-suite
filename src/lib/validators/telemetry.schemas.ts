// src/lib/validators/telemetry.schemas.ts
/**
 * @file telemetry.schemas.ts
 * @description Aparato de validación atómico. Contiene los schemas de Zod
 *              específicos para el sistema de telemetría. Separa los contratos
 *              para la creación inicial de logs y para el enriquecimiento
 *              posterior desde el cliente.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

const UuidSchema = z
  .string()
  .uuid({ message: "ValidationErrors.invalid_uuid" });

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
    .min(1, { message: "ValidationErrors.fingerprint_required" }),
  ip_address: z.string().ip({ message: "ValidationErrors.invalid_ip" }),
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
    .min(1, { message: "ValidationErrors.fingerprint_required" }),
  browser_context: z.record(z.any()).nullable().optional(),
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Contratos Atómicos**: ((Implementada)) Se han creado schemas específicos para cada caso de uso (creación vs. enriquecimiento), mejorando la precisión de la validación y el SRP.
 *
 * =====================================================================
 */
// src/lib/validators/telemetry.schemas.ts
