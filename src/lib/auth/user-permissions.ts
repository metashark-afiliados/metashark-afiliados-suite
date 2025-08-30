// src/lib/auth/user-permissions.ts
/**
 * @file user-permissions.ts
 * @description Guardián de seguridad de élite. Ha sido refactorizado para
 *              extraer la llamada a `cookies()` fuera del ámbito de `unstable_cache`,
 *              resolviendo un error crítico de build en Vercel.
 * @author Raz Podestá
 * @version 6.0.0
 * @date 2025-08-30
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

export async function requireAppRole(
  requiredRoles: AppRole[]
): Promise<AuthResult<UserAuthData>> {
  const authData = await getAuthenticatedUserAuthData();
  if (!authData) {
    return { success: false, error: "SESSION_NOT_FOUND", data: null };
  }
  if (!requiredRoles.includes(authData.appRole)) {
    logger.warn(
      `[AuthGuard] VIOLACIÓN DE ROL: Usuario ${authData.user.id} con rol '${authData.appRole}' intentó acceder a recurso que requiere [${requiredRoles.join(", ")}].`
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
  requiredRoles: WorkspaceRole[]
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
    logger.warn(
      `[AuthGuard] VIOLACIÓN DE SITIO: Usuario ${user.id} intentó acceder al sitio ${siteId} sin permisos en workspace ${site.workspace_id}.`
    );
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
  requiredRoles: WorkspaceRole[]
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
      `[AuthGuard] Fallo de permiso de campaña: Campaña ${campaignId} no encontrada o sin workspace.`
    );
    return { success: false, error: "NOT_FOUND", data: null };
  }

  const isAuthorized = await permissionsData.hasWorkspacePermission(
    user.id,
    campaignInfo.workspace_id,
    requiredRoles
  );

  if (!isAuthorized) {
    logger.warn(
      `[AuthGuard] VIOLACIÓN DE CAMPAÑA: Usuario ${user.id} intentó acceder a la campaña ${campaignId} sin permisos en workspace ${campaignInfo.workspace_id}.`
    );
    return { success: false, error: "PERMISSION_DENIED", data: authData };
  }

  return { success: true, data: authData };
}
// src/lib/auth/user-permissions.ts
