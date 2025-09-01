// src/components/layout/dashboard.loader.ts
/**
 * @file dashboard.loader.ts
 * @description Aparato de carga de datos de élite. Restaurado a su estado funcional
 *              completo, obteniendo todas las métricas y datos requeridos para el
 *              dashboard de forma paralela y resiliente. Sincronizado con la
 *              arquitectura "Lean Database".
 * @author Raz Podestá & L.I.A. Legacy
 * @version 9.1.0
 * @date 2025-09-01
 */
"use server";

import { cookies } from "next/headers";
import { type User } from "@supabase/supabase-js";

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
import { type Tables } from "@/lib/types/database";
import { createPersistentErrorLog } from "@/lib/actions/_helpers";

export type DashboardLayoutData = DashboardContextProps;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getPlanMaxSites = (
  planType: "free" | "basic" | "pro" | "enterprise"
): number => {
  const planToMaxSitesMap = { free: 1, basic: 5, pro: 25, enterprise: 500 };
  return planToMaxSitesMap[planType] || 1;
};

export async function getLayoutData(): Promise<DashboardLayoutData | null> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    let profile: Tables<"profiles"> | null = null;
    for (let attempts = 0; attempts < 5; attempts++) {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (data) {
        profile = data;
        break;
      }
      await delay(300);
    }
    if (!profile) {
      await supabase.auth.signOut();
      return null;
    }

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
      campaignsData.management.getPublishedCampaignsCountByWorkspace(
        activeWorkspace.id
      ),
      campaignsData.management.getRecentCampaignsByWorkspaceId(
        activeWorkspace.id,
        4
      ),
      supabase
        .from("user_tokens")
        .select("balance")
        .eq("user_id", user.id)
        .eq("token_type", "general_purpose")
        .single(),
    ]);

    const activeWorkspaceRoleId = memberRole?.role_id || null;

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
      "DashboardLayout:getLayoutData.critical",
      error as Error,
      {}
    );
    logger.error(
      { errorId },
      `[DashboardLoader] Fallo crítico al obtener datos.`
    );
    return null;
  }
}
// src/components/layout/dashboard.loader.ts
