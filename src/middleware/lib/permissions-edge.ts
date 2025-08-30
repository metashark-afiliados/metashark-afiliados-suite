// src/middleware/lib/permissions-edge.ts
/**
 * @file src/middleware/lib/permissions-edge.ts
 * @description Aparato de lógica de sesión especializado para el Edge Runtime.
 *              Ha sido refactorizado holísticamente para incluir cacheo de roles
 *              en Vercel KV para un rendimiento de élite, y helpers atómicos para
 *              una máxima cohesión y adhesión al principio DRY.
 * @author Raz Podestá - MetaShark Tech
 * @version 5.1.0
 * @date 2025-08-30
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
    if (userError) {
      logger.error(
        "[PermissionsEdge] Error al obtener usuario de Supabase.",
        userError
      );
    } else {
      logger.trace("[PermissionsEdge] No se encontró sesión de usuario.");
    }
    return { authData: null, response: supabaseResponse };
  }

  const [appRole, activeWorkspaceId] = await Promise.all([
    getUserAppRole(supabase, user.id),
    getActiveWorkspaceIdFromCookie(request),
  ]);

  const authData = { user, appRole, activeWorkspaceId };

  logger.trace(
    "[PermissionsEdge] Datos de autenticación obtenidos con éxito.",
    { userId: user.id, role: appRole }
  );
  return { authData, response: supabaseResponse };
}
// src/middleware/lib/permissions-edge.ts
