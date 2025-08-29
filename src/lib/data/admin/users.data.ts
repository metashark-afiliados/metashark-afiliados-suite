// src/lib/data/admin/users.data.ts
/**
 * @file users.data.ts
 * @description Aparato de datos atómico. Responsable de las operaciones de
 *              lectura de alto privilegio para la gestión de usuarios, para
 *              uso exclusivo en el Dev Console.
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
import { type UserProfilesWithEmail } from "./types";

/**
 * @public
 * @async
 * @function getPaginatedUsersWithRoles
 * @description Obtiene una lista paginada y filtrada de todos los perfiles de usuario
 *              de la plataforma, consultando la vista `user_profiles_with_email`.
 *              Utiliza el cliente de administrador para eludir las RLS.
 * @param {object} options - Opciones de paginación y búsqueda.
 * @param {number} [options.page=1] - El número de página a obtener.
 * @param {number} [options.limit=20] - El número de usuarios por página.
 * @param {string} [options.query=""] - El término de búsqueda para filtrar usuarios.
 * @returns {Promise<{ profiles: UserProfilesWithEmail[]; totalCount: number }>} Los perfiles y el conteo total.
 * @throws {Error} Si la consulta a la base de datos falla.
 */
export async function getPaginatedUsersWithRoles({
  page = 1,
  limit = 20,
  query = "",
}: {
  page?: number;
  limit?: number;
  query?: string;
}): Promise<{ profiles: UserProfilesWithEmail[]; totalCount: number }> {
  logger.trace(
    "[DataLayer:AdminUsers] Iniciando obtención de perfiles de usuario.",
    { page, limit, query }
  );
  try {
    const supabase = createAdminClient();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let queryBuilder = supabase
      .from("user_profiles_with_email")
      .select("*", { count: "exact" });

    if (query) {
      queryBuilder = queryBuilder.or(
        `email.ilike.%${query}%,full_name.ilike.%${query}%`
      );
    }

    const { data: profiles, error, count } = await queryBuilder.range(from, to);

    if (error) {
      throw error;
    }

    // El casteo es seguro aquí debido a la SSoT de la vista en la DB.
    return {
      profiles: (profiles as UserProfilesWithEmail[]) || [],
      totalCount: count || 0,
    };
  } catch (error) {
    logger.error(
      `[DataLayer:AdminUsers] Error crítico al obtener perfiles de usuario:`,
      error
    );
    throw new Error("No se pudieron obtener los perfiles de usuario.");
  }
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **Índices de Búsqueda (GIN)**: ((Vigente)) Para optimizar el rendimiento de la búsqueda `ILIKE` en un gran número de usuarios, se deben crear índices GIN con la extensión `pg_trgm` en las columnas `email` y `full_name` de la tabla `profiles`.
 * 2. **Filtros por Rol**: ((Vigente)) Extender la función para aceptar un parámetro `role: AppRole` que permita filtrar a los usuarios por su `app_role`, una funcionalidad esencial para la gestión de usuarios.
 * 3. **Ordenamiento Dinámico**: ((Vigente)) Añadir un parámetro `sort` para permitir ordenar los resultados por diferentes columnas (ej. `email`, `full_name`, `created_at`).
 * =====================================================================
 */
// src/lib/data/admin/users.data.ts
