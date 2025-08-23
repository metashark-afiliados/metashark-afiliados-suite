// src/lib/validators/i18n/TelemetryTable.schema.ts
/**
 * @file TelemetryTable.schema.ts
 * @description Define el contrato de datos para el namespace 'app.dev-console.TelemetryTable'.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { z } from "zod";

export const TelemetryTableSchema = z.object({
  title: z.string(),
  description: z.string(),
  error_title: z.string(),
  error_description: z.string(),
  header_timestamp: z.string(),
  header_user_session: z.string(),
  header_ip_country: z.string(),
  header_fingerprint: z.string(),
  header_actions: z.string(),
  action_view_geo: z.string(),
  action_view_utms: z.string(),
  empty_state: z.string(),
  dialog_title_geo: z.string(),
  dialog_title_utms: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Restauración de Integridad**: ((Implementada)) La creación de este schema resuelve otra dependencia crítica para la infraestructura de i18n.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/TelemetryTable.schema.ts
