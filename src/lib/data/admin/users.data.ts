// src/lib/data/admin/users.data.ts
/**
 * @file users.data.ts
 * @description Aparato de datos atómico. Responsable de las operaciones de
 *              lectura de alto privilegio para la gestión de usuarios, para
 *              uso exclusivo en el Dev Console. Refactorizado para alinear el
 *              logging a la firma canónica.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 */
"use server";
import "server-only";

import { logger } from "@/lib/logger";
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
  const context = { page, limit, query };
  logger.trace(
    context,
    "[DataLayer:AdminUsers] Iniciando obtención de perfiles de usuario."
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

    return {
      profiles: (profiles as UserProfilesWithEmail[]) || [],
      totalCount: count || 0,
    };
  } catch (error) {
    logger.error(
      { err: error, context },
      `[DataLayer:AdminUsers] Error crítico al obtener perfiles de usuario.`
    );
    throw new Error("No se pudieron obtener los perfiles de usuario.");
  }
}
// src/lib/data/admin/users.data.ts
