// src/lib/auth/user-permissions.ts
/**
 * @file user-permissions.ts
 * @description Guardián de seguridad de élite. Ha sido restaurado y mejorado para que
 *              el tipo `AuthResult` devuelva contexto de usuario en fallos de
 *              permisos, habilitando una observabilidad y manejo de errores superiores.
 * @author Raz Podestá
 * @version 2.1.0
 */
"use server";
import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { type User } from "@supabase/supabase-js";

import { hasWorkspacePermission } from "@/lib/data/permissions";
import { getSiteById, type SiteBasicInfo } from "@/lib/data/sites";
import { logger } from "@/lib/logging";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { type Database } from "@/lib/types/database";

type AppRole = Database["public"]["Enums"]["app_role"];
type WorkspaceRole = Database["public"]["Enums"]["workspace_role"];

export type UserAuthData = {
  user: User;
  appRole: AppRole;
  activeWorkspaceId: string | null;
};

// --- INICIO DE RESTAURACIÓN DE CONTRATO DE ÉLITE ---
type AuthResultSuccess<T> = { success: true; data: T };
type AuthResultError =
  | { success: false; error: "SESSION_NOT_FOUND"; data: null }
  | { success: false; error: "PERMISSION_DENIED"; data: UserAuthData } // Devuelve contexto de usuario
  | { success: false; error: "NOT_FOUND"; data: null };

export type AuthResult<T> = AuthResultSuccess<T> | AuthResultError;
// --- FIN DE RESTAURACIÓN DE CONTRATO DE ÉLITE ---

export const getAuthenticatedUserAuthData = cache(
  async (): Promise<UserAuthData | null> => {
    logger.trace("[AuthCache] Miss: Obteniendo datos de sesión del usuario.");
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const cookieStore = cookies();
    const { data: profile } = await supabase
      .from("profiles")
      .select("app_role")
      .eq("id", user.id)
      .single();

    return {
      user,
      appRole: profile?.app_role || "user",
      activeWorkspaceId: cookieStore.get("active_workspace_id")?.value || null,
    };
  }
);

export async function requireAppRole(
  requiredRoles: AppRole[]
): Promise<AuthResult<UserAuthData>> {
  const authData = await getAuthenticatedUserAuthData();

  if (!authData) {
    return { success: false, error: "SESSION_NOT_FOUND", data: null };
  }

  if (!requiredRoles.includes(authData.appRole)) {
    logger.warn(
      `[AuthGuard] VIOLACIÓN DE ACCESO DE ROL: Usuario ${authData.user.id} con rol '${authData.appRole}' intentó acceder a un recurso que requiere [${requiredRoles.join(", ")}].`
    );
    return { success: false, error: "PERMISSION_DENIED", data: authData };
  }

  return { success: true, data: authData };
}

export async function requireWorkspacePermission(
  workspaceId: string,
  requiredRoles: WorkspaceRole[]
): Promise<AuthResult<UserAuthData>> {
  const authData = await getAuthenticatedUserAuthData();

  if (!authData) {
    return { success: false, error: "SESSION_NOT_FOUND", data: null };
  }

  const isAuthorized = await hasWorkspacePermission(
    authData.user.id,
    workspaceId,
    requiredRoles
  );

  if (!isAuthorized) {
    return { success: false, error: "PERMISSION_DENIED", data: authData };
  }

  return { success: true, data: authData };
}

export async function requireSitePermission(
  siteId: string,
  requiredRoles: WorkspaceRole[]
): Promise<AuthResult<{ user: User; site: SiteBasicInfo }>> {
  const authData = await getAuthenticatedUserAuthData();

  if (!authData) {
    return { success: false, error: "SESSION_NOT_FOUND", data: null };
  }
  const { user } = authData;

  const site = await getSiteById(siteId);
  if (!site) {
    return { success: false, error: "NOT_FOUND", data: null };
  }

  const isAuthorized = await hasWorkspacePermission(
    user.id,
    site.workspace_id,
    requiredRoles
  );

  if (!isAuthorized) {
    logger.warn(
      `[AuthGuard] VIOLACIÓN DE ACCESO A SITIO: Usuario ${user.id} intentó acceder al sitio ${siteId} sin permisos en el workspace ${site.workspace_id}.`
    );
    // Aunque falle, devolvemos el contexto del usuario para logging.
    // El tipo de retorno para éxito es diferente, por lo que aquí devolvemos un error genérico
    // que incluye el contexto del usuario.
    const errorResult: AuthResultError = {
      success: false,
      error: "PERMISSION_DENIED",
      data: authData,
    };
    // Realizamos un type assertion aquí porque la lógica de negocio es devolver un error específico,
    // y este tipo específico es compatible con la definición amplia de AuthResult.
    return errorResult as AuthResult<{ user: User; site: SiteBasicInfo }>;
  }

  return { success: true, data: { user, site } };
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Restauración de Funcionalidad**: ((Implementada)) Se ha restaurado y mejorado el contrato `AuthResult`, eliminando la regresión y resolviendo el error `TS2339` en `dev-console/layout.tsx`.
 * 2. **Seguridad de Tipos Mejorada**: ((Implementada)) La unión discriminada explícita `AuthResultSuccess | AuthResultError` hace que el contrato sea aún más robusto y fácil de entender para el compilador y los desarrolladores.
 *
 * =====================================================================
 */
// src/lib/auth/user-permissions.ts
