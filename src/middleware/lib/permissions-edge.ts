// src/middleware/lib/permissions-edge.ts
/**
 * @file src/middleware/lib/permissions-edge.ts
 * @description Aparato de lógica de sesión para el Edge Runtime. Utiliza Vercel KV
 *              para un cacheo de roles de alto rendimiento y se alinea con el
 *              patrón de "respuesta encadenada" para una funcionalidad robusta.
 * @author Raz Podestá - MetaShark Tech
 * @copilot RaZ WriTe
 * @version 4.0.0
 * @see .docs-espejo/middleware/lib/permissions-edge.md
 */
import "server-only";

import { type NextRequest, type NextResponse } from "next/server";
import {
  type SupabaseClient,
  type User,
  isAuthError,
  AuthSessionMissingError,
} from "@supabase/supabase-js";
import { kv } from "@vercel/kv";

import { createClient as createMiddlewareSupabaseClient } from "@/lib/supabase/middleware";
import { type Database } from "@/lib/types/database";
import { logger } from "@/lib/logger";

type AppRole = Database["public"]["Enums"]["app_role"];

export type UserAuthData = {
  user: User;
  appRole: AppRole;
  activeWorkspaceId: string | null;
};

const CACHE_TTL_SECONDS = 300; // 5 minutos

function getActiveWorkspaceIdFromCookie(request: NextRequest): string | null {
  return request.cookies.get("active_workspace_id")?.value || null;
}

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
        { userId },
        "[PermissionsEdge:Cache] HIT: Rol de usuario obtenido del caché."
      );
      return cachedRole;
    }
  } catch (error) {
    logger.error(
      { error },
      `[PermissionsEdge:Cache] Error al acceder a Vercel KV.`
    );
  }

  logger.trace(
    { userId },
    "[PermissionsEdge:Cache] MISS: Rol de usuario no encontrado en caché. Consultando DB."
  );
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("app_role")
    .eq("id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    logger.error(
      { error },
      `[PermissionsEdge] Error al obtener perfil para usuario ${userId}.`
    );
    return defaultRole;
  }

  const role = profile?.app_role || defaultRole;

  try {
    await kv.set(cacheKey, role, { ex: CACHE_TTL_SECONDS });
  } catch (error) {
    logger.error(
      { error },
      `[PermissionsEdge:Cache] Error al escribir en Vercel KV.`
    );
  }

  return role;
}

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

  if (userError || !user) {
    if (
      isAuthError(userError) &&
      userError instanceof AuthSessionMissingError
    ) {
      logger.trace(
        "[PermissionsEdge] No se encontró sesión de usuario (esperado para anónimos)."
      );
    } else if (userError) {
      logger.error(
        { error: userError },
        "[PermissionsEdge] Error inesperado al obtener usuario de Supabase."
      );
    }
    return { authData: null, response: supabaseResponse };
  }

  const [appRole, activeWorkspaceId] = await Promise.all([
    getUserAppRole(supabase, user.id),
    getActiveWorkspaceIdFromCookie(request),
  ]);

  const authData = { user, appRole, activeWorkspaceId };

  logger.trace(
    { userId: user.id, role: appRole },
    "[PermissionsEdge] Datos de autenticación obtenidos con éxito."
  );
  return { authData, response: supabaseResponse };
}
// src/middleware/lib/permissions-edge.ts
