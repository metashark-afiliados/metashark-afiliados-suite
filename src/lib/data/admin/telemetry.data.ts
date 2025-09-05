// src/lib/data/admin/telemetry.data.ts
/**
 * @file telemetry.data.ts
 * @description Aparato de datos atómico. Responsable de las operaciones de
 *              lectura de alto privilegio para la gestión de logs de telemetría,
 *              para uso exclusivo en el Dev Console. Refactorizado para alinearse
 *              con la firma de logging canónica de la Constitución.
 * @author L.I.A Legacy
 * @version 2.0.0
 * @see .docs-espejo/lib/data/admin/telemetry.data.ts.md
 */
"use server";
import "server-only";

import { logger } from "@/lib/logger";
import { createAdminClient } from "@/lib/supabase/server";
import { type Tables } from "@/lib/types/database";

/**
 * @public
 * @async
 * @function getVisitorLogs
 * @description Obtiene una lista paginada y filtrada de todos los logs de visitantes.
 *              Utiliza el cliente de administrador para eludir las RLS.
 * @param {object} options - Opciones de paginación y búsqueda.
 * @param {number} [options.page=1] - El número de página a obtener.
 * @param {number} [options.limit=25] - El número de logs por página.
 * @param {string} [options.query=""] - El término de búsqueda para filtrar logs.
 * @returns {Promise<{ logs: Tables<'visitor_logs'>[]; totalCount: number }>} Los logs y el conteo total.
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
  const context = { page, limit, query };
  logger.trace(
    context,
    "[DataLayer:AdminTelemetry] Iniciando obtención de logs de visitantes."
  );
  try {
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
      throw error;
    }

    return {
      logs: (logs as Tables<"visitor_logs">[]) || [],
      totalCount: count || 0,
    };
  } catch (error) {
    logger.error(
      { err: error as Error, context },
      `[DataLayer:AdminTelemetry] Error crítico al obtener los logs de visitantes.`
    );
    throw new Error("No se pudieron obtener los logs de visitantes.");
  }
}
// src/lib/data/admin/telemetry.data.ts
