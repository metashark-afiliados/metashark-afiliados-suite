// src/lib/validators/schemas/telemetry.schemas.ts
/**
 * @file src/lib/validators/schemas/telemetry.schemas.ts
 * @description Aparato de validación atómico y SSoT para el sistema de telemetría.
 *              Este módulo encapsula los schemas de Zod para validar los payloads
 *              de telemetría tanto en la creación inicial (middleware) como en el
 *              enriquecimiento posterior (cliente).
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-29
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
    .min(1, { message: "ValidationErrors.generic.fingerprint_required" }),
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

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **Tipado Estricto para `geo_data` y `browser_context`**: Reemplazar `z.record(z.any())` por schemas de Zod más específicos que definan la forma esperada de estos objetos JSON, mejorando la integridad de los datos.
 * 2. **Validación de User-Agent Data**: Para `browser_context`, se podría crear un schema que valide la estructura de la API `User-Agent Client Hints` (`navigator.userAgentData`), proporcionando una validación más robusta de los datos del navegador.
 * 3. **Schema para `utm_params`**: Crear un schema que valide la presencia de los parámetros UTM estándar (`utm_source`, `utm_medium`, `utm_campaign`), asegurando que los datos de marketing sean consistentes.
 * 4. **Enum para `status` de Log**: Si en el futuro se añade un campo `status` a `visitor_logs` (ej. 'processing', 'completed'), se debería añadir aquí la validación correspondiente.
 * 5. **Refinamiento de `referrer`**: La validación de `referrer` podría ser mejorada para permitir `null` o una URL válida, pero no un string vacío.
 * =====================================================================
 */
// src/lib/validators/schemas/telemetry.schemas.ts
