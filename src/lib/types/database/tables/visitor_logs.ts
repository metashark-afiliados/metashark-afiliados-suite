// src/lib/types/database/tables/visitor_logs.ts
/**
 * @file visitor_logs.ts
 * @description Define el contrato de datos para `visitor_logs`. Ha sido enriquecido
 *              y sincronizado para incluir los campos de seguridad `is_bot` y
 *              `is_known_abuser`.
 * @author Raz Podestá
 * @version 3.1.0 (Enriched Telemetry)
 */
import { type Json } from "../_shared";

export type VisitorLogs = {
  Row: {
    id: string;
    session_id: string;
    user_id: string | null;
    fingerprint: string;
    ip_address: string | null; // <-- Corregido a nullable según schema
    geo_data: Json | null;
    user_agent: string | null;
    utm_params: Json | null;
    created_at: string;
    referrer: string | null;
    landing_page: string | null;
    browser_context: Json | null;
    is_bot: boolean; // <-- SINCRONIZADO
    is_known_abuser: boolean; // <-- SINCRONIZADO
  };
  Insert: {
    id?: string;
    session_id: string;
    user_id?: string | null;
    fingerprint: string;
    ip_address?: string | null; // <-- Corregido a nullable
    geo_data?: Json | null;
    user_agent?: string | null;
    utm_params?: Json | null;
    created_at?: string;
    referrer?: string | null;
    landing_page?: string | null;
    browser_context?: Json | null;
    is_bot?: boolean;
    is_known_abuser?: boolean;
  };
  Update: never;
  Relationships: [
    {
      foreignKeyName: "visitor_logs_user_id_fkey";
      columns: ["user_id"];
      isOneToOne: false;
      referencedRelation: "profiles";
      referencedColumns: ["id"];
    },
  ];
};
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Esquema**: ((Implementada)) Se han añadido `is_bot` y `is_known_abuser` al contrato, alineándolo con el `schema.sql` y el `TelemetryHandler`.
 *
 * =====================================================================
 */
// src/lib/types/database/tables/visitor_logs.ts
