// src/components/layout/dashboard.loader.ts
/**
 * @file dashboard.loader.ts
 * @description Aparato de carga de datos de élite. SSoT para obtener y
 *              ensamblar todo el contexto de sesión para el layout del dashboard.
 *              Refactorizado para consumir la API de datos atomizada, resolviendo
 *              errores críticos de importación.
 * @author L.I.A. Legacy
 * @version 12.0.0
 */
"use server";
import "server-only";

import { cookies } from "next/headers";

import { createPersistentErrorLog } from "@/lib/actions/_helpers";
import { getAuthUser } from "@/lib/auth/get-auth-user";
import {
  type DashboardContextProps,
  type WorkspaceMember,
} from "@/lib/context/DashboardContext";
import {
  campaignsData,
  modules as modulesData,
  notifications,
  sites as sitesData,
  workspaces as workspacesData,
} from "@/lib/data";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import { getPlanMaxSites } from "./loaders/_helpers/plan.helper";
import { waitForProfile } from "./loaders/_helpers/profile.helper";

export type DashboardLayoutData = DashboardContextProps;

/**
 * @public
 * @async
 * @function getLayoutData
 * @description Orquesta la obtención de todos los datos necesarios para el
 *              layout del dashboard y sus componentes hijos.
 * @returns {Promise<DashboardLayoutData | null>} El objeto de datos del layout
 *          o `null` si el usuario no está autenticado.
 */
export async function getLayoutData(): Promise<DashboardLayoutData | null> {
  const context: Record<string, any> = {};
  try {
    const user = await getAuthUser();
    if (!user) {
      return null;
    }
    context.userId = user.id;

    const profile = await waitForProfile(user);
    if (!profile) {
      logger.error(
        context,
        "[DashboardLoader] INCONSISTENCIA CRÍTICA: Perfil no encontrado."
      );
      const supabase = createClient();
      await supabase.auth.signOut();
      return null;
    }
    context.profile = { id: profile.id, plan: profile.plan_type };

    const [userWorkspaces, pendingInvitations, modules] = await Promise.all([
      workspacesData.management.getWorkspacesByUserId(user.id),
      notifications.getPendingInvitationsByEmail(user.email!),
      modulesData.getFeatureModulesForUser(user),
    ]);

    const cookieStore = cookies();
    let activeWorkspaceId = cookieStore.get("active_workspace_id")?.value;
    let activeWorkspace =
      userWorkspaces.find((ws) => ws.id === activeWorkspaceId) ||
      userWorkspaces[0] ||
      null;

    if (!activeWorkspaceId && activeWorkspace) {
      activeWorkspaceId = activeWorkspace.id;
      cookieStore.set("active_workspace_id", activeWorkspace.id, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
      });
    }
    context.activeWorkspaceId = activeWorkspaceId;

    if (!activeWorkspace) {
      return {
        user,
        profile,
        modules,
        pendingInvitations,
        workspaces: [],
        activeWorkspace: null,
        activeWorkspaceRoleId: null,
        recentCampaigns: [],
        workspaceMembers: [],
        activeSitesCount: 0,
        publishedCampaignsCount: 0,
        uniqueVisitors30d: 0,
        aiCreditsRemaining: 0,
        maxSitesAllowed: getPlanMaxSites(profile.plan_type),
      };
    }

    const supabase = createClient();
    const [
      workspaceMembers,
      { data: memberRole },
      { count: activeSitesCount },
      { count: publishedCampaignsCount },
      recentCampaigns,
      { data: aiCreditsResult },
    ] = await Promise.all([
      workspacesData.management.getWorkspaceMembers(activeWorkspace.id),
      supabase
        .from("workspace_members")
        .select("role_id")
        .eq("user_id", user.id)
        .eq("workspace_id", activeWorkspace.id)
        .single(),
      sitesData.management.getActiveSitesCount(activeWorkspace.id),
      // --- INICIO DE CORRECCIÓN DE API (TS2339) ---
      campaignsData.dashboard.getPublishedCampaignsCountByWorkspace(
        activeWorkspace.id
      ),
      campaignsData.dashboard.getRecentCampaignsByWorkspaceId(
        activeWorkspace.id,
        4
      ),
      // --- FIN DE CORRECCIÓN DE API (TS2339) ---
      supabase
        .from("user_tokens")
        .select("balance")
        .eq("user_id", user.id)
        .eq("token_type", "general_purpose")
        .single(),
    ]);

    const activeWorkspaceRoleId = memberRole?.role_id || null;
    context.activeWorkspaceRoleId = activeWorkspaceRoleId;

    logger.info(context, "[DashboardLoader] Datos de layout cargados.");

    return {
      user,
      profile,
      workspaces: userWorkspaces,
      activeWorkspace,
      activeWorkspaceRoleId,
      pendingInvitations,
      modules,
      recentCampaigns,
      workspaceMembers: workspaceMembers as WorkspaceMember[],
      activeSitesCount,
      publishedCampaignsCount,
      uniqueVisitors30d: 0,
      aiCreditsRemaining: aiCreditsResult?.balance || 0,
      maxSitesAllowed: getPlanMaxSites(profile.plan_type),
    };
  } catch (error) {
    const errorId = await createPersistentErrorLog(
      "DashboardLoader",
      error as Error,
      context
    );
    logger.error(
      { errorId, err: error, ...context },
      "[DashboardLoader] Fallo crítico al obtener datos."
    );
    return null;
  }
}
// src/components/layout/dashboard.loader.ts
