// src/lib/data/admin/telemetry.data.ts
/**
 * @file telemetry.data.ts
 * @description Aparato de datos atómico. Responsable de las operaciones de
 *              lectura de alto privilegio para la gestión de logs de telemetría.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use server";
import "server-only";

import { logger } from "@/lib/logging";
import { createAdminClient } from "@/lib/supabase/server";
import { type Tables } from "@/lib/types/database";

/**
 * @public
 * @async
 * @function getVisitorLogs
 * @description Obtiene una lista paginada y filtrada de todos los logs de visitantes.
 * @param {object} options - Opciones de paginación y búsqueda.
 * @returns {Promise<{ logs: Tables<'visitor_logs'>[]; totalCount: number }>}
 * @throws {Error} Si la consulta a la base de datos falla.
 */
export async function getVisitorLogs({
  page = 1,
  limit = 25,
  query = "",
}: {
  page?: number;
  limit?: number;
  query?: string;
}): Promise<{ logs: Tables<"visitor_logs">[]; totalCount: number }> {
  const supabase = createAdminClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let queryBuilder = supabase
    .from("visitor_logs")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (query) {
    queryBuilder = queryBuilder.or(
      `ip_address::text.ilike.%${query}%,fingerprint.ilike.%${query}%,user_id::text.ilike.%${query}%`
    );
  }

  const { data: logs, error, count } = await queryBuilder.range(from, to);

  if (error) {
    logger.error(
      `[DataLayer:AdminTelemetry] Error al obtener los logs de visitantes:`,
      error
    );
    throw new Error("No se pudieron obtener los logs de visitantes.");
  }

  return {
    logs: (logs as Tables<"visitor_logs">[]) || [],
    totalCount: count || 0,
  };
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical (SRP)**: ((Implementada)) Este nuevo aparato tiene la única y clara responsabilidad de gestionar el acceso a los datos de telemetría.
 * 2. **Búsqueda Robusta**: ((Implementada)) Se ha añadido `::text` al casteo de `ip_address` y `user_id` para asegurar que la consulta `ILIKE` funcione correctamente en tipos no textuales.
 *
 * @subsection Melhorias Futuras
 * 1. **Índices de Búsqueda (GIN)**: ((Implementada)) Como ya se ha implementado en un script de migración SQL, los índices GIN para `visitor_logs` optimizarán el rendimiento de esta función.
 *
 * =====================================================================
 */
// src/lib/data/admin/telemetry.data.ts
