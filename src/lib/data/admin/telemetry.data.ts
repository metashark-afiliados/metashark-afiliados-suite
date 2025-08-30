// src/lib/data/admin/telemetry.data.ts
/**
 * @file telemetry.data.ts
 * @description Aparato de datos atómico. Responsable de las operaciones de
 *              lectura de alto privilegio para la gestión de logs de telemetría,
 *              para uso exclusivo en el Dev Console.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-29
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
  logger.trace(
    "[DataLayer:AdminTelemetry] Iniciando obtención de logs de visitantes.",
    { page, limit, query }
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
      // Búsqueda en múltiples columnas. El casteo a ::text es crucial para tipos no textuales.
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
      `[DataLayer:AdminTelemetry] Error crítico al obtener los logs de visitantes:`,
      error
    );
    throw new Error("No se pudieron obtener los logs de visitantes.");
  }
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **Índices de Búsqueda (GIN)**: Para optimizar el rendimiento de la búsqueda `ILIKE` en un gran volumen de datos, se deben crear índices GIN con la extensión `pg_trgm` en las columnas `ip_address`, `fingerprint` y `user_id`.
 * 2. **Filtros por Rango de Fechas**: Extender la función para aceptar `startDate` y `endDate` y así permitir filtrar los logs dentro de un período de tiempo específico, una funcionalidad esencial para el análisis de telemetría.
 * 3. **Particionamiento de Tabla**: A largo plazo, a medida que la tabla `visitor_logs` crezca a millones de registros, se debe implementar el particionamiento de tablas de PostgreSQL (ej. por mes) para mantener un rendimiento de consulta óptimo.
 * 4. **Tipado de Retorno con Zod**: Crear un `VisitorLogSchema` y usar `.parse()` en los datos devueltos para una validación en tiempo de ejecución.
 * 5. **Ordenamiento Dinámico**: Añadir un parámetro `sort` para permitir ordenar los resultados por diferentes columnas (ej. `created_at`, `ip_address`).
 * =====================================================================
 */
// src/lib/data/admin/telemetry.data.ts
