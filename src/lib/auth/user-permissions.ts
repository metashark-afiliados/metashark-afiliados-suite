// src/lib/auth/user-permissions.ts
/**
 * @file user-permissions.ts
 * @description Guardián de seguridad de élite y SSoT para la obtención y
 *              enriquecimiento de datos de sesión en el servidor. Sincronizado
 *              con la arquitectura de datos atomizada.
 * @author L.I.A. Legacy
 * @version 9.0.0
 */
"use server";
import "server-only";

import { unstable_cache as cache } from "next/cache";
import { cookies } from "next/headers";
import { type User } from "@supabase/supabase-js";

import { getAuthUser } from "@/lib/auth/get-auth-user";
import { type WorkspaceRoleName } from "@/config/roles.config";
import {
  permissions as permissionsData,
  sites as sitesData,
  campaignsData, // Importar el namespace principal
} from "@/lib/data";
import { type SiteBasicInfo } from "@/lib/data/sites/types";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import { type Database } from "@/lib/types/database";

type AppRole = Database["public"]["Enums"]["app_role"];

export type UserAuthData = {
  user: User;
  appRole: AppRole;
  activeWorkspaceId: string | null;
  activeWorkspaceRoleId: number | null;
};

type AuthResultSuccess<T> = { success: true; data: T };
type AuthResultError =
  | { success: false; error: "SESSION_NOT_FOUND"; data: null }
  | {
      success: false;
      error: "PERMISSION_DENIED";
      data: UserAuthData;
    }
  | { success: false; error: "NOT_FOUND"; data: null };

export type AuthResult<T> = AuthResultSuccess<T> | AuthResultError;

const getCachedEnrichedAuthData = cache(
  async (userId: string | undefined): Promise<UserAuthData | null> => {
    logger.trace(
      { userId },
      "[AuthCache] Miss: Obteniendo datos enriquecidos."
    );
    const user = await getAuthUser();
    if (!user) return null;

    const cookieStore = cookies();
    const supabase = createClient();
    const activeWorkspaceId =
      cookieStore.get("active_workspace_id")?.value || null;

    const [profile, memberRole] = await Promise.all([
      supabase.from("profiles").select("app_role").eq("id", user.id).single(),
      activeWorkspaceId
        ? supabase
            .from("workspace_members")
            .select("role_id")
            .eq("user_id", user.id)
            .eq("workspace_id", activeWorkspaceId)
            .single()
        : Promise.resolve({ data: null }),
    ]);

    return {
      user,
      appRole: profile.data?.app_role || "user",
      activeWorkspaceId,
      activeWorkspaceRoleId: memberRole.data?.role_id || null,
    };
  },
  ["enriched-auth-data"],
  { tags: ["auth-data"], revalidate: 60 }
);

export async function getAuthenticatedUserAuthData(): Promise<UserAuthData | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return getCachedEnrichedAuthData(user?.id);
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
      {
        userId: authData.user.id,
        role: authData.appRole,
        required: requiredRoles,
      },
      "[AuthGuard] VIOLACIÓN DE ROL: Acceso denegado."
    );
    return { success: false, error: "PERMISSION_DENIED", data: authData };
  }
  return { success: true, data: authData };
}

export async function requireWorkspacePermission(
  workspaceId: string,
  requiredRoles: WorkspaceRoleName[]
): Promise<AuthResult<{ user: User }>> {
  const authData = await getAuthenticatedUserAuthData();
  if (!authData) {
    return { success: false, error: "SESSION_NOT_FOUND", data: null };
  }
  const { user } = authData;

  const isAuthorized = await permissionsData.hasWorkspacePermission(
    user.id,
    workspaceId,
    requiredRoles
  );

  if (!isAuthorized) {
    logger.warn(
      { userId: user.id, workspaceId, requiredRoles },
      "[AuthGuard] VIOLACIÓN DE WORKSPACE: Acceso denegado."
    );
    return { success: false, error: "PERMISSION_DENIED", data: authData };
  }

  return { success: true, data: { user } };
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
    logger.warn(
      { userId: user.id, siteId, workspaceId: site.workspace_id },
      "[AuthGuard] VIOLACIÓN DE SITIO: Acceso denegado."
    );
    return { success: false, error: "PERMISSION_DENIED", data: authData };
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

  // --- INICIO DE CORRECCIÓN (TS2305) ---
  const campaignInfo =
    await campaignsData.auth.getCampaignSiteInfoById(campaignId);
  // --- FIN DE CORRECCIÓN ---

  if (!campaignInfo || !campaignInfo.workspace_id) {
    return { success: false, error: "NOT_FOUND", data: null };
  }

  const isAuthorized = await permissionsData.hasWorkspacePermission(
    user.id,
    campaignInfo.workspace_id,
    requiredRoles
  );

  if (!isAuthorized) {
    return { success: false, error: "PERMISSION_DENIED", data: authData };
  }

  return { success: true, data: authData };
}
// src/lib/auth/user-permissions.ts
