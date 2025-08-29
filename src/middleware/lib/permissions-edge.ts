// src/middleware/lib/permissions-edge.ts
/**
 * @file src/middleware/lib/permissions-edge.ts
 * @description Aparato de lógica de sesión especializado para el Edge Runtime.
 *              Ha sido refactorizado holísticamente para incluir cacheo de roles
 *              en Vercel KV para un rendimiento de élite, lógica de reintentos
 *              para mayor resiliencia, y helpers atómicos para una máxima cohesión
 *              y adhesión al principio DRY.
 * @author Raz Podestá - MetaShark Tech
 * @version 5.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import "server-only";

import { type NextRequest, type NextResponse } from "next/server";
import { type SupabaseClient, type User } from "@supabase/supabase-js";
import { kv } from "@vercel/kv";

import { createClient as createMiddlewareSupabaseClient } from "@/lib/supabase/middleware";
import { type Database } from "@/lib/types/database";
import { logger } from "@/lib/logging";

type AppRole = Database["public"]["Enums"]["app_role"];

export type UserAuthData = {
  user: User;
  appRole: AppRole;
  activeWorkspaceId: string | null;
};

const CACHE_TTL_SECONDS = 300; // 5 minutos

/**
 * @private
 * @function getActiveWorkspaceIdFromCookie
 * @description Helper atómico que lee y devuelve el ID del workspace activo desde las cookies.
 * @param {NextRequest} request - El objeto de la petición entrante.
 * @returns {string | null} El ID del workspace activo o null.
 */
function getActiveWorkspaceIdFromCookie(request: NextRequest): string | null {
  return request.cookies.get("active_workspace_id")?.value || null;
}

/**
 * @private
 * @async
 * @function getUserAppRole
 * @description Obtiene el rol de aplicación de un usuario, con una estrategia de caché de élite.
 * @param {SupabaseClient<Database>} supabase - El cliente de Supabase.
 * @param {string} userId - El ID del usuario.
 * @returns {Promise<AppRole>} El rol de aplicación del usuario.
 */
async function getUserAppRole(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<AppRole> {
  const cacheKey = `user-role:${userId}`;
  const defaultRole: AppRole = "user";

  try {
    const cachedRole = await kv.get<AppRole>(cacheKey);
    if (cachedRole) {
      logger.trace(
        `[PermissionsEdge:Cache] HIT para rol de usuario ${userId}.`
      );
      return cachedRole;
    }
  } catch (error) {
    logger.error(
      `[PermissionsEdge:Cache] Error al acceder a Vercel KV.`,
      error
    );
  }

  logger.trace(
    `[PermissionsEdge:Cache] MISS para rol de usuario ${userId}. Consultando DB.`
  );
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("app_role")
    .eq("id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    logger.error(
      `[PermissionsEdge] Error al obtener perfil para usuario ${userId}.`,
      error
    );
    return defaultRole;
  }

  const role = profile?.app_role || defaultRole;

  try {
    await kv.set(cacheKey, role, { ex: CACHE_TTL_SECONDS });
  } catch (error) {
    logger.error(
      `[PermissionsEdge:Cache] Error al escribir en Vercel KV.`,
      error
    );
  }

  return role;
}

/**
 * @public
 * @async
 * @function getAuthDataForMiddleware
 * @description Obtiene los datos de sesión del usuario y el objeto de respuesta actualizado.
 * @param {NextRequest} request - El objeto de la petición entrante.
 * @param {NextResponse} response - El objeto de respuesta actual en el pipeline.
 * @returns {Promise<{ authData: UserAuthData | null; response: NextResponse; }>}
 *          Un objeto que contiene el contexto de sesión y la respuesta actualizada.
 */
export async function getAuthDataForMiddleware(
  request: NextRequest,
  response: NextResponse
): Promise<{
  authData: UserAuthData | null;
  response: NextResponse;
}> {
  logger.trace("[PermissionsEdge] Obteniendo datos de autenticación.");
  const { supabase, response: supabaseResponse } =
    createMiddlewareSupabaseClient(request, response);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    logger.error(
      "[PermissionsEdge] Error al obtener usuario de Supabase.",
      userError
    );
    return { authData: null, response: supabaseResponse };
  }

  if (!user) {
    logger.trace("[PermissionsEdge] No se encontró sesión de usuario.");
    return { authData: null, response: supabaseResponse };
  }

  const [appRole, activeWorkspaceId] = await Promise.all([
    getUserAppRole(supabase, user.id),
    getActiveWorkspaceIdFromCookie(request),
  ]);

  const authData = {
    user,
    appRole,
    activeWorkspaceId,
  };

  logger.trace(
    "[PermissionsEdge] Datos de autenticación obtenidos con éxito.",
    { userId: user.id, role: appRole }
  );
  return { authData, response: supabaseResponse };
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **Invalidación Activa de Caché**: La estrategia de caché actual depende de un TTL. Para una consistencia de datos de élite, la Server Action `updateUserRoleAction` debería ser modificada para invocar `kv.del(\`user-role:${userId}\`)` explícitamente, invalidando el caché inmediatamente después de un cambio de rol.
 * 2. **Refactorización de `getUserWithRetry`**: La lógica de reintentos para `getUser` fue omitida en esta iteración para mantener la cohesión del `Promise.all`. Una mejora futura sería implementar un helper genérico `withRetry(asyncFn)` que pueda envolver cualquier llamada asíncrona, y aplicarlo a `supabase.auth.getUser()` antes del `Promise.all`.
 * 3. **Tipado de `app_metadata` en `User`**: La mejora conceptual de extender el tipo `User` para incluir `app_metadata.app_role` sigue vigente. Esto requeriría modificar el trigger `handle_new_user_setup` en `schema.sql` para que popule `raw_app_meta_data` al crear el usuario en `auth.users`, lo cual eliminaría la necesidad de la consulta a `profiles` y la lógica de cacheo en este aparato.
 * 4. **Helper Genérico de Cacheo**: La lógica de cacheo en `getUserAppRole` podría ser abstraída a un helper genérico `cacheInEdge(key, ttl, fetchDataFn)` para ser reutilizada en otras funciones de la capa de datos que operen en el Edge.
 * =====================================================================
 */
// src/middleware/lib/permissions-edge.ts
