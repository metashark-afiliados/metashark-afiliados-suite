// src/lib/auth/user-permissions.ts
/**
 * @file user-permissions.ts
 * @description Guardián de seguridad de élite. Ha sido extendido para incluir
 *              `requireCampaignPermission`, un nuevo guardián para validar
 *              permisos a nivel de campaña.
 * @author Raz Podestá
 * @version 4.0.0
 * @date 2025-08-27
 */
"use server";
import "server-only";

import { cache } from "react";
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
      `[AuthGuard] VIOLACIÓN DE ACCESO A SITIO: Usuario ${user.id} intentó acceder al sitio ${siteId} sin permisos en el workspace ${site.workspace_id}.`
    );
    const errorResult: AuthResultError = {
      success: false,
      error: "PERMISSION_DENIED",
      data: authData,
    };
    return errorResult as AuthResult<{ user: User; site: SiteBasicInfo }>;
  }
  return { success: true, data: { user, site } };
}

/**
 * @public
 * @async
 * @function requireCampaignPermission
 * @description Guardián de seguridad de élite para campañas. Valida que el
 *              usuario autenticado pertenezca al workspace que contiene la campaña.
 * @param {string} campaignId - El ID de la campaña a verificar.
 * @param {WorkspaceRole[]} requiredRoles - Los roles de workspace requeridos para el acceso.
 * @returns {Promise<AuthResult<UserAuthData>>} El resultado de la validación.
 */
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
      `[AuthGuard] Fallo de permiso de campaña: Campaña ${campaignId} no encontrada o no asignada a un workspace.`
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
      `[AuthGuard] VIOLACIÓN DE ACCESO A CAMPAÑA: Usuario ${user.id} intentó acceder a la campaña ${campaignId} sin permisos en el workspace ${campaignInfo.workspace_id}.`
    );
    return { success: false, error: "PERMISSION_DENIED", data: authData };
  }

  return { success: true, data: authData };
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Nuevo Guardián de Seguridad**: Se ha implementado `requireCampaignPermission`, un nuevo guardián que extiende la capa de seguridad al nivel de la entidad `campaigns`.
 * 2. ((Implementada)) **Reutilización de Lógica (DRY)**: El nuevo guardián reutiliza `hasWorkspacePermission` y consume la nueva función de datos `getCampaignSiteInfoById`, demostrando una arquitectura de capas cohesiva y eficiente.
 * 3. ((Implementada)) **Full Observabilidad**: El guardián incluye logs de advertencia específicos para violaciones de acceso, mejorando la auditoría de seguridad.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) **Permisos a Nivel de Campaña**: Para una granularidad de élite, se podría crear una tabla `campaign_members` que permita asignar permisos de edición o visualización a usuarios específicos para una campaña individual, independientemente de su rol en el workspace.
 *
 * =====================================================================
 */
// src/lib/auth/user-permissions.ts
