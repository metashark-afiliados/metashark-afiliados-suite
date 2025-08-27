// src/lib/data/admin/users.data.ts
/**
 * @file users.data.ts
 * @description Aparato de datos atómico. Responsable de las operaciones de
 *              lectura de alto privilegio para la gestión de usuarios.
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
import { type UserProfilesWithEmail } from "./types";

/**
 * @public
 * @async
 * @function getPaginatedUsersWithRoles
 * @description Obtiene una lista paginada y filtrada de todos los perfiles de usuario
 *              de la plataforma, consultando la vista `user_profiles_with_email`.
 * @param {object} options - Opciones de paginación y búsqueda.
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
    logger.error(
      `[DataLayer:AdminUsers] Error al obtener perfiles de usuario:`,
      error
    );
    throw new Error("No se pudieron obtener los perfiles de usuario.");
  }

  return {
    profiles: (profiles as UserProfilesWithEmail[]) || [],
    totalCount: count || 0,
  };
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical (SRP)**: ((Implementada)) Este nuevo aparato tiene la única y clara responsabilidad de gestionar el acceso a los datos de los usuarios, mejorando la cohesión y mantenibilidad. Su lógica fue migrada directamente desde el monolito `admin.ts`.
 *
 * @subsection Melhorias Futuras
 * 1. **Índices de Búsqueda**: ((Vigente)) Para optimizar el rendimiento de la búsqueda a gran escala, se deben crear índices GIN con la extensión `pg_trgm` en las columnas `email` y `full_name` de la tabla `profiles`. Propondré la creación del script de migración SQL para esto.
 *
 * =====================================================================
 */
// src/lib/data/admin/users.data.ts
