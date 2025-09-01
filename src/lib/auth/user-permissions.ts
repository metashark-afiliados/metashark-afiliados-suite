// src/lib/auth/user-permissions.ts
/**
 * @file user-permissions.ts
 * @description Guardián de seguridad de élite y SSoT para la obtención de datos de
 *              sesión en el servidor. Sincronizado con la arquitectura "Lean Database".
 * @author @author RaZ Podestá - MetaShark Tech
 * @version 6.0.0
 * @see .docs-espejo/lib/auth/user-permissions.md
 */
"use server";
import "server-only";

import { unstable_cache as cache } from "next/cache";
import { cookies } from "next/headers";
import { type User } from "@supabase/supabase-js";

import {
  sites as sitesData,
  permissions as permissionsData,
  campaignsData,
} from "@/lib/data";
import { type SiteBasicInfo } from "@/lib/data/sites/types";
import { logger } from "@/lib/logger";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { type Database } from "@/lib/types/database";
import { type WorkspaceRoleName } from "@/config/roles.config";

type AppRole = Database["public"]["Enums"]["app_role"];

export type UserAuthData = {
  user: User;
  appRole: AppRole;
  activeWorkspaceId: string | null;
};

type AuthResultSuccess<T> = { success: true; data: T };
type AuthResultError =
  | { success: false; error: "SESSION_NOT_FOUND"; data: null }
  | { success: false; error: "PERMISSION_DENIED"; data: UserAuthData }
  | { success: false; error: "NOT_FOUND"; data: null };

export type AuthResult<T> = AuthResultSuccess<T> | AuthResultError;

const getCachedUserAndProfile = cache(
  async (sessionId: string | undefined) => {
    logger.trace("[AuthCache] Miss: Obteniendo datos de usuario y perfil.");
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("app_role")
      .eq("id", user.id)
      .single();

    return {
      user,
      appRole: profile?.app_role || "user",
    };
  },
  ["user-profile-cache"],
  { tags: ["auth-data"], revalidate: 60 }
);

export async function getAuthenticatedUserAuthData(): Promise<UserAuthData | null> {
  const cookieStore = cookies();
  const sessionId = cookieStore.get(
    `sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split(".")[0].replace("https://", "")}-auth-token`
  )?.value;

  const cachedData = await getCachedUserAndProfile(sessionId);

  if (!cachedData) {
    return null;
  }

  const activeWorkspaceId =
    cookieStore.get("active_workspace_id")?.value || null;

  return {
    ...cachedData,
    activeWorkspaceId,
  };
}

/**
 * @public
 * @async
 * @function getRequiredAuthData
 * @description Obtiene los datos de sesión de un usuario autenticado. Lanza un error
 *              si no se encuentra una sesión válida. Es el reemplazo canónico
 *              para el obsoleto `getAuthenticatedUser`.
 * @returns {Promise<AuthResult<UserAuthData>>}
 */
export async function getRequiredAuthData(): Promise<AuthResult<UserAuthData>> {
  const authData = await getAuthenticatedUserAuthData();
  if (!authData) {
    return { success: false, error: "SESSION_NOT_FOUND", data: null };
  }
  return { success: true, data: authData };
}

export async function requireAppRole(
  requiredRoles: AppRole[]
): Promise<AuthResult<UserAuthData>> {
  const authData = await getAuthenticatedUserAuthData();
  if (!authData) {
    return { success: false, error: "SESSION_NOT_FOUND", data: null };
  }
  if (!requiredRoles.includes(authData.appRole)) {
    logger.warn(`[AuthGuard] VIOLACIÓN DE ROL: Acceso a recurso denegado.`, {
      userId: authData.user.id,
      role: authData.appRole,
      required: requiredRoles,
    });
    return { success: false, error: "PERMISSION_DENIED", data: authData };
  }
  return { success: true, data: authData };
}

export async function requireWorkspacePermission(
  workspaceId: string,
  requiredRoles: WorkspaceRoleName[]
): Promise<AuthResult<UserAuthData>> {
  const authData = await getAuthenticatedUserAuthData();
  if (!authData) {
    return { success: false, error: "SESSION_NOT_FOUND", data: null };
  }
  const isAuthorized = await permissionsData.hasWorkspacePermission(
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
  requiredRoles: WorkspaceRoleName[]
): Promise<AuthResult<{ user: User; site: SiteBasicInfo }>> {
  const authData = await getAuthenticatedUserAuthData();
  if (!authData) {
    return { success: false, error: "SESSION_NOT_FOUND", data: null };
  }
  const { user } = authData;
  const site = await sitesData.management.getSiteById(siteId);
  if (!site) {
    return { success: false, error: "NOT_FOUND", data: null };
  }
  const isAuthorized = await permissionsData.hasWorkspacePermission(
    user.id,
    site.workspace_id,
    requiredRoles
  );
  if (!isAuthorized) {
    logger.warn(`[AuthGuard] VIOLACIÓN DE SITIO: Acceso denegado.`, {
      userId: user.id,
      siteId,
      workspaceId: site.workspace_id,
    });
    return {
      success: false,
      error: "PERMISSION_DENIED",
      data: authData as any,
    };
  }
  return { success: true, data: { user, site } };
}

export async function requireCampaignPermission(
  campaignId: string,
  requiredRoles: WorkspaceRoleName[]
): Promise<AuthResult<UserAuthData>> {
  const authData = await getAuthenticatedUserAuthData();
  if (!authData) {
    return { success: false, error: "SESSION_NOT_FOUND", data: null };
  }
  const { user } = authData;

  const campaignInfo =
    await campaignsData.management.getCampaignSiteInfoById(campaignId);
  if (!campaignInfo || !campaignInfo.workspace_id) {
    logger.warn(
      `[AuthGuard] Fallo de permiso de campaña: Campaña no encontrada o sin workspace.`,
      { campaignId }
    );
    return { success: false, error: "NOT_FOUND", data: null };
  }

  const isAuthorized = await permissionsData.hasWorkspacePermission(
    user.id,
    campaignInfo.workspace_id,
    requiredRoles
  );

  if (!isAuthorized) {
    logger.warn(`[AuthGuard] VIOLACIÓN DE CAMPAÑA: Acceso denegado.`, {
      userId: user.id,
      campaignId,
      workspaceId: campaignInfo.workspace_id,
    });
    return { success: false, error: "PERMISSION_DENIED", data: authData };
  }

  return { success: true, data: authData };
}
// src/lib/auth/user-permissions.ts
